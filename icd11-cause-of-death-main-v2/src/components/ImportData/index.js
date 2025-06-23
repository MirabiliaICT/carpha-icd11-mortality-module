import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Button, Table , message, Upload, List, Typography, Progress} from "antd";
import { UploadOutlined , CheckCircleTwoTone } from '@ant-design/icons';


import { generateDhis2Payload, generateDhis2Payloadx, generateBulkDhis2Payload } from "../../utils";
import { Hooks } from "tracker-capture-app-core";
import { generateCode } from "../../utils";

import { getToken } from "../../utils/icd11";

import {
    mutateTei,
    mutateAttribute,
    mutateEnrollment,
    mutateEvent
} from "../../redux/actions/data";

// const [loading,setLoading]=useState(false);
const { useApi } = Hooks;



const ImportData = ({metadata, icdApi_clientToken }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [orgUnits, setOrgUnits] = useState([]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('');

    // Separate state for DORIS section
    const [dorisFileData, setDorisFileData] = useState(null);
    const [dorisProcessingData, setDorisProcessingData] = useState({
        isProcessing: false,
        hasStarted: false,
        totalRows: 0,
        processedRows: 0,
        data: [],
        error: null,
        errorCount: 0,
        erroredRows: []
    });

    // Separate state for DHIS section
    const [dhisFileData, setDhisFileData] = useState(null);
    const [dhisProcessingData, setDhisProcessingData] = useState({
        isProcessing: false,
        hasStarted: false,
        totalRows: 0,
        processedRows: 0,
        data: [],
        error: null,
        errorCount: 0,
        erroredRows: []
    });
    
    const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [processingData, setProcessingData] = useState({
        isProcessing: false,
        hasStarted: false,
        totalRows: 0,
        processedRows: 0,
        data: [],
        error: null,
        errorCount: 0,
        erroredRows: []
    });

    
  const [fileList, setFileList] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);


    const [progress, setProgress] = useState(0);
    const { dataApi, metadataApi } = useApi();
    const { keyUiLocale } = metadata;


    const handleDorisUploadFileSelection = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target.result;
                let parsedData = [];
                let headers = [];


                if (file.type === "application/json") {
                    if (parsedData.length > 0) {
                        headers = Object.keys(parsedData[0]); // Extract headers from the first object
                    }
                } else if (file.type === "text/csv") {
                    const rows = content.split('\n').filter(line => line.trim() !== '');

                    if (rows.length > 0) {
                        headers = rows[0].split(',');
                        for (let i = 1; i < rows.length; i++) {
                            const values = rows[i].split(',');
                            const rowData = {};
                            for (let j = 0; j < headers.length; j++) {
                                rowData[headers[j].trim()] = values[j] ? values[j].trim() : null;
                            }
                            parsedData.push(rowData);
                        }
                    }
                } else {
                    throw new Error('Unsupported file format');
                }

                setDorisFileData({
                    content: parsedData,
                    fileName: file.name,
                    type: file.type,
                    headers: headers
                });

                setDorisProcessingData({
                    isProcessing: false,
                    totalRows: parsedData.length,
                    processedRows: 0,
                    data: parsedData,
                    error: null
                });

            } catch (error) {
                setDorisProcessingData(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        };
        reader.readAsText(file);
    };

    // Start processing
    const beginDorisCodProcessing = async () => {
        if (!dorisFileData || !dorisFileData.content) {
            console.log("There is no data in the file ---------Error!!!");
            return;
        }

        const { content, headers } = dorisFileData;
        console.log("Extracted Headers:", headers);

        const dataRows = content.slice(0); // Skip the header row

        setDorisProcessingData(prev => ({
            ...prev,
            isProcessing: true,
            hasStarted: true,
            totalRows: content.length,
            processedRows: 0,
            data: content,
            error: null,
            errorCount: 0,
            erroredRows: []
        }));

        try {
            await processCertificateList(content, icdApi_clientToken, 100, headers);
        } catch (error) {
            setDorisProcessingData(prev => ({
                ...prev,
                error: error.message
            }));
        } finally {
            setDorisProcessingData(prev => ({
                ...prev,
                isProcessing: false
            }));
        }
    };

    // Process a single certificate
    const processCertificate = async (deathCertificate, access) => {

        const baseUrl = "https://id.who.int/icd/release/11/2024-01/doris";

        const url = new URL(baseUrl);

        // Function to conditionally append parameters
        const appendIfNotNull = (key, value) => {
            if (value !== null && value !== undefined && value !== '') {
                url.searchParams.append(key, value);
            }
        };

        // Conditionally appending parameters
        appendIfNotNull("sex", deathCertificate.Sex);
        appendIfNotNull("estimatedAge", deathCertificate.EstimatedAge);
        appendIfNotNull("dateBirth", deathCertificate.DateBirth);
        appendIfNotNull("dateDeath", deathCertificate.DateDeath);


        appendIfNotNull("causeOfDeathCodeA", deathCertificate.CauseOfDeathCodeA);
        appendIfNotNull("causeOfDeathCodeB", deathCertificate.CauseOfDeathCodeB);
        appendIfNotNull("causeOfDeathCodeC", deathCertificate.CauseOfDeathCodeC);
        appendIfNotNull("causeOfDeathCodeD", deathCertificate.CauseOfDeathCodeD);
        appendIfNotNull("causeOfDeathCodeE", deathCertificate.CauseOfDeathCodeE);


        appendIfNotNull("causeOfDeathURIA", deathCertificate.CauseOfDeathURIA);
        appendIfNotNull("causeOfDeathURIB", deathCertificate.CauseOfDeathURIB);
        appendIfNotNull("causeOfDeathURIC", deathCertificate.CauseOfDeathURIC);
        appendIfNotNull("causeOfDeathURID", deathCertificate.CauseOfDeathURID);
        appendIfNotNull("causeOfDeathURIE", deathCertificate.CauseOfDeathURIE);

        appendIfNotNull("causeOfDeathTextA", deathCertificate.CauseOfDeathTextA);
        appendIfNotNull("causeOfDeathTextB", deathCertificate.CauseOfDeathTextB);
        appendIfNotNull("causeOfDeathTextC", deathCertificate.CauseOfDeathTextC);
        appendIfNotNull("causeOfDeathTextD", deathCertificate.CauseOfDeathTextD);
        appendIfNotNull("causeOfDeathTextE", deathCertificate.CauseOfDeathTextE);


        appendIfNotNull("intervalA", deathCertificate.IntervalA);
        appendIfNotNull("intervalB", deathCertificate.IntervalB);
        appendIfNotNull("intervalC", deathCertificate.IntervalC);
        appendIfNotNull("intervalD", deathCertificate.IntervalD);
        appendIfNotNull("intervalE", deathCertificate.IntervalE);

        appendIfNotNull("surgeryWasPerformed", deathCertificate.SurgeryWasPerformed);
        appendIfNotNull("mannerOfDeath", deathCertificate.MannerOfDeath);
        appendIfNotNull("maternalDeathWasPregnant", deathCertificate.MaternalDeathWasPregnant);
        appendIfNotNull("maternalDeathTimeFromPregnancy", deathCertificate.MaternalDeathTimeFromPregnancy);
        appendIfNotNull("maternalDeathPregnancyContribute", deathCertificate.MaternalDeathPregnancyContribute);




  var finalUrl = url
  
  console.log("finalUrl: " + finalUrl);

  const response = await fetch(url, {
      method: 'GET',
      headers: {
          'Accept': '*/*',
          'Accept-Encoding' : 'gzip, deflate, br',
          // 'Connection' : 'keep-alive',
          'API-Version': 'v2',
          'Accept-Language': 'en',
          'Authorization': `Bearer ${icdApi_clientToken}`
      } 
  });
  
  if (response.status === 200) {
              const data = await response.json();
              return data;
          } else {
              throw new Error('Failed to process certificate');
          }

    };

    const processCertificateList = async (deathCertificates, access, delayInMillis, headers) => {
        const apiResponsesProcessedList = [];
        const erroredRows = [];


        for (const deathCertificate of deathCertificates) {
            try {
                const apiResponse = await processCertificate(deathCertificate, access);

                if (apiResponse.reject == true || apiResponse.reject == "TRUE") {

                    erroredRows.push(apiResponse); // Add the errored row to the list

                    await new Promise(resolve => setTimeout(resolve, delayInMillis));


                    setDorisProcessingData(prev => ({
                        ...prev,
                        processedRows: prev.processedRows + 1,
                        errorCount: prev.errorCount + 1,
                        erroredRows
                    }));

                } else {
                    apiResponsesProcessedList.push(apiResponse);

                    await new Promise(resolve => setTimeout(resolve, delayInMillis));

                    setDorisProcessingData(prev => ({
                        ...prev,
                        processedRows: prev.processedRows + 1
                    }));

                }


            } catch (error) {

                erroredRows.push(deathCertificate); // Add the errored row to the list

                setDorisProcessingData(prev => ({
                    ...prev,
                    processedRows: prev.processedRows + 1,
                    errorCount: prev.errorCount + 1,
                    erroredRows
                }));

                console.error(`Error processing certificate ${deathCertificate.CertificateKey}:`, error);
            }
        }

        console.log("writeCsv----" + headers)
        console.log("writeCsv----" + deathCertificates)


        writeCsv(apiResponsesProcessedList, `sample${Math.random()}.csv`, headers, deathCertificates);

        if (erroredRows.length > 0) {
            downloadErrorCsv(erroredRows, `sample_Errors${Math.random()}.csv`, headers, deathCertificates);; // Automatically download errors CSV if errors exist
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }

        setDorisFileData(null); // Clear the file data


    };

    const writeCsv = (responses, filePath, originalHeadersx, originalData) => {
        // Combine the original headers with the report headers
        const header = [...originalHeadersx, "stemCode", "stemURI", "code", "uri", "report", "reject", "error", "warning"].map(header => header.trim());

        // Escape special characters in the report field
        const escapeReport = (report) => {
            if (!report) return '';
            report = report.replace(/\n/g, "\\n"); // Replace newlines with a placeholder
            return `"${report}"`; // Wrap the report in double quotes to handle commas
        };

        // Escape special characters in the report field
        const escapeWarning = (warning) => {
            if (!warning) return '';
            warning = warning.replace(/\n/g, "\\n"); // Replace newlines with a placeholder
            return `"${warning}"`; // Wrap the report in double quotes to handle commas
        };

        // Create CSV content
        const csvContent = [
            header.join(","), // Header row
            ...responses.map((response, index) => {
                const originalRow = originalData[index];
                return [
                    ...originalHeadersx.map(header => originalRow[header]), // Original row values
                    response.stemCode,
                    response.stemURI,
                    response.code,
                    response.uri,
                    escapeReport(response.report), // Escaped report field
                    response.reject,
                    response.error,
                    escapeWarning(response.warning)
                ].join(","); // Join the row with commas
            })
        ].join("\n"); // Join all rows with newlines

        // Create and download the CSV file
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const downloadErrorCsv = (erroredRows, filePath, originalHeadersx, originalData) => {
        const header = [...originalHeadersx, "stemCode", "stemURI", "code", "uri", "report", "reject", "error", "warning"].map(header => header.trim());

        const escapeReport = (report) => {
            if (!report) return '';
            report = report.replace(/\n/g, "\\n"); // Replace newlines with a placeholder
            return `"${report}"`; // Wrap the report in double quotes to handle commas
        };

        const csvContent = [
            header.join(","),
            ...erroredRows.map((response, index) => {
                const originalRow = originalData[index];
                return [
                    ...originalHeadersx.map(header => originalRow[header]), // Original row values
                    response.stemCode,
                    response.stemURI,
                    response.code,
                    response.uri,
                    escapeReport(response.report), // Escaped report field
                    response.reject,
                    response.error,
                    response.warning
                ].join(","); // Join the row with commas
            })
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filePath);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const dorisColumns = [
        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    const dorisDataSource = [
        { key: '1', metric: 'Total Rows', value: dorisProcessingData.totalRows },
        { key: '2', metric: 'Processed Rows', value: dorisProcessingData.processedRows },
        { key: '3', metric: 'Errors', value: dorisProcessingData.errorCount },
        { key: '4', metric: 'Progress', value: `${((dorisProcessingData.processedRows / dorisProcessingData.totalRows) * 100).toFixed(1)}%` }
    ];

     const dhisColumns = [
        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    const dhisDataSource = [
        { key: '1', metric: 'Total Rows', value: dhisProcessingData.totalRows },
        { key: '2', metric: 'Processed Rows', value: dhisProcessingData.processedRows },
        { key: '3', metric: 'Errors', value: dhisProcessingData.errorCount },
        { key: '4', metric: 'Progress', value: `${((dhisProcessingData.processedRows / dhisProcessingData.totalRows) * 100).toFixed(1)}%` }
    ];

    const fetctOrgUnits = async () => {
        try {
            const orgUnits = await metadataApi.getOrgUnitsLevel3();
            console.error('Expected an array' + orgUnits);
            console.error('Expected an arrayxxxx' + orgUnits.organisationUnits);
            return orgUnits.organisationUnits
        } catch (error) {
            console.error('Expected an array but got:vvvvvvvvvvvvvvvvvvvvvvvvv');
        }

    }

    useEffect(() => {
        const loadOrgUnits = async () => {
            const units = await fetctOrgUnits();
            console.log('API Response:', units.org); // Log the response

            console.log('API Response:', units.organisationUnits); // Log the response

            if (Array.isArray(units)) {
                setOrgUnits(units);
            } else {
                console.error('Expected an array but got:', units);
            }
        };

        loadOrgUnits();
    }, []);

    const handleOrgUnitChange = (event) => {
        setSelectedOrgUnit(event.target.value);
        console.log('Selected Organization Unit ID:', event.target.value);
    };


    const handleFileUploadToDhis = (file) => {
        
        const formMapping = require("../../asset/metadata/mapping.json");

        if (!file) return false;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const content = e.target.result;
                let parsedData = [];
                let headers = [];
                let orgUnitID = selectedOrgUnit;

                if (file.type === "text/csv") {
                    const rows = content.split('\n').filter(line => line.trim() !== '');
                    if (rows.length > 0) {
                        headers = rows[0].split(',').map(header => header.trim());
                        const dataElementsMapping = formMapping.dataElements;
                        const dataAttributesMapping = formMapping.attributes;

                        // Mapping headers to dataElement/attribute IDs
                        const mappedHeaders = headers.map(header => {
                            const dataElementKey = Object.keys(dataElementsMapping).find(
                                key => key.toLowerCase() === header.toLowerCase()
                            );
                            if (dataElementKey) {
                                return { type: "dataElement", id: dataElementsMapping[dataElementKey] };
                            }

                            const attributeKey = Object.keys(dataAttributesMapping).find(
                                key => key.toLowerCase() === header.toLowerCase()
                            );
                            if (attributeKey) {

                                console.log( attributeKey  + "attributeattribute")
                                return { type: "attribute", id: dataAttributesMapping[attributeKey] };
                            }

                            return { type: "unknown", id: header };
                        });

                        for (let i = 1; i < rows.length; i++) {
                            const values = rows[i].split(',');
                            const dataValues = [];
                            const attributeValues = [];


                            for (let j = 0; j < headers.length; j++) {
                                const mappedHeader = mappedHeaders[j];
                                const valueCLeaned = values[j] ? values[j].trim() : "";
                                const value = valueCLeaned !== null ? valueCLeaned : "";


                                if (mappedHeader.type === "dataElement") {

                                    dataValues.push({ dataElement: mappedHeader.id, value });
                                }

                                if (mappedHeader.type === "attribute") {

                                    attributeValues.push({ attribute: mappedHeader.id, value });

                                    console.log("attribute logged " +  mappedHeader.id);

                                   console.log("attribute  value logged " +  value);

                                }
                            }

                            // Build the payload structure for each row
                            const trackID  = generateCode();
                            const trackentitytype  = generateCode();
                            const enrollmentID  = generateCode();
                            const programid = "ogrOUKoSaWA";
                            const programStageId = 'WlWJt4lVSWw';
                            const trackedEntityTypeId = 'RQrHOJGKT5H';
                            //    const trackedEntityTypeId =  'nEenWmSyUEp';

                            const dateandTime = new Date().toISOString().split('T')[0];

                            const eventPayload = {

                                enrollment:{
                                 //storedBy : thu username 
                                 createdAtClient: dateandTime,
                                  program: programid,
                                  lastUpdated: dateandTime,
                                  created: dateandTime,
                                  orgUnit: orgUnitID,
                                  enrollment: enrollmentID,      // Keep the ID
                                  trackedEntityInstance: trackID,
                                trackedEntityType: trackedEntityTypeId,
                                    //orgUnitName: fetch from api 
                                lastUpdatedAtClient: dateandTime,
                                enrollmentDate: new Date().toISOString().split('T')[0],
                                deleted: false,
                                incidentDate: new Date().toISOString().split('T')[0],
                                status: "COMPLETED",
                                lastUpdatedByUserInfo: {
                                        uid:"M5zQapPyTZI",
                                        firstName:"admin",
                                        surname:"admin",
                                        username:"admin"
                                    },
                                createdByUserInfo:{
                                        uid:"M5zQapPyTZI",
                                        firstName:"admin",
                                        surname:"admin",
                                        username:"admin"
                                     },
                                notes:[  
                                     ],
                                relationships:[                                   
                                     ] ,
                                attributes: attributeValues,

                                    isDirty: true,
                                    isNew: true

                                },

                                trackedEntityInstance: {
                                    created: dateandTime,
                                    createdAtClient: dateandTime,
                                    lastUpdated: dateandTime,
                                    trackedEntityType: trackedEntityTypeId,
                                    lastUpdatedAtClient: dateandTime,
                                    //storedBy : thu username 
                                    potentialDuplicate: false,
                                    inactive: false,
                                    deleted: false,
                                    featureType: "NONE",

                                    lastUpdatedByUserInfo: {
                                        uid: "xE7jOejl9FI",
                                        firstName: "John",
                                        surname: "Traore",
                                        username: "admin"
                                    },
                                    createdByUserInfo: {
                                        uid: "xE7jOejl9FI",
                                        firstName: "John",
                                        surname: "Traore",
                                        username: "admin"
                                    },

                                    programOwners: [
                                        {
                                            ownerOrgUnit: orgUnitID,
                                            program: programid,
                                            trackedEntityInstance: trackID
                                        }
                                    ],
                                    relationships: [],

                                     orgUnit: orgUnitID,
                                     program: programid,
                                       attributes: attributeValues,
                                     trackedEntityInstance: trackID
                                },
                                events: { },
                                event: {
                                    event: generateCode(),
                                    isDirty: false,
                                    isNew: true,
                                    orgUnit: orgUnitID,
                                    enrollment: enrollmentID,
                                    trackedEntityInstance: trackID,
                                    program: programid,
                                    programStage: programStageId,
                                    dataValues: dataValues,
                                    eventDate: new Date().toISOString().split('T')[0],
                                    dueDate: new Date().toISOString().split('T')[0],
                                    attributes: attributeValues
                                }
                            };
                            parsedData.push(eventPayload);
                        }
                    }

                    console.log("parsedDataparsedDataparsedData" + parsedData);



                } else {
                    throw new Error('Unsupported file format');
                }

                setDhisFileData({
                    content: parsedData,
                    fileName: file.name,
                    type: file.type,
                    headers: headers,
                    orgUnitID: selectedOrgUnit
                });

                setDhisProcessingData({
                    isProcessing: false,
                    totalRows: parsedData.length,
                    processedRows: 0,
                    data: parsedData,
                    error: null
                });

                console.log("Generated Parsed Payload:", parsedData);
                let processedCount = 0;
                const totalRows = parsedData.length;

                setDhisProcessingData(prev => ({
                    ...prev,
                    isProcessing: true,
                    hasStarted: true
                }));

                for (const data of parsedData) {

                    console.log("Generated Individual Data :", data);


                    const programid = "ogrOUKoSaWA";
                    const programMetadata = await metadataApi.getProgramMetadata(programid);

                    try {

                        const { trackedEntityInstance, enrollment, events } = generateDhis2Payloadx(data, programMetadata);

                        console.log("currentEventscurrentEvents" + trackedEntityInstance);
                        console.log("enrollmentenrollment" + enrollment);
                        console.log("eventevent" + events);


                        await dataApi.pushTrackedEntityInstance(
                            data.trackedEntityInstance,
                            programMetadata.id
                        );

                        await dataApi.pushEnrollment(
                            data.enrollment,
                            programMetadata.id
                        );

                        await dataApi.pushEvents({ events: [data.event] });
                        console.log("DOneeeeeee");


                    } catch (error) {
                        // console.error(`Error processing data for TEI: ${currentTei.trackedEntityInstance}`, error);
                    }

                    processedCount++;
                    setProgress(Math.round((processedCount / totalRows) * 100));

                    setDhisProcessingData(prev => ({
                        ...prev,
                        processedRows: processedCount
                    }));
                }

                setDhisProcessingData(prev => ({
                        ...prev,
                        processedRows: false
                    }));



            } catch (error) {
                setDhisProcessingData(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        };

        reader.readAsText(file);
        return false;
    };

    const uploadProps = {
        beforeUpload: handleFileUploadToDhis,
        showUploadList: false,
    };

    
    const handleCloseDorisTable = () => {
        // Reset the DORIS processing state
        setDorisProcessingData({
            isProcessing: false,
            hasStarted: false,
            processedRows: 0,
            totalRows: 0,
            errorCount: 0,
            erroredRows: []
        });

        // Optionally clear the file data as well
        setDorisFileData(null);

        console.log("DORIS Processing table closed successfully.");
    };

    const handleCloseDhisTable = () => {
        // Reset the DHIS processing state
        setDhisProcessingData({
            isProcessing: false,
            hasStarted: false,
            processedRows: 0,
            totalRows: 0,
            errorCount: 0,
            erroredRows: []
        });

        // Optionally clear the file data as well
        setDhisFileData(null);

        console.log("DHIS Processing table closed successfully.");
    };



    return (


        <div style={{ padding: 20, maxWidth: '95%', margin: 'auto'}}>
            <h1 style={{ textAlign: 'center', marginBottom: 20, color: '#125887', fontSize: '38px', width: '40%', margin: '10px auto 20px auto'}}>Mortality and Morbidity Data Import Module</h1>

            {/* Import General Section*/}
            <div className="general-wrapper" style={{ width: '80%', display: 'flex', margin: 'auto', justifyContent: 'space-between'}}>
                {/* DORIS Import Section */}
            <div className="doris-import-wrapper" style={{ margin: '0 auto'}}>
                

                <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20, position: 'relative', height: '230px', width: '600px' }}>
                    <h2 style={{ fontSize: '28px'}}>DORIS ICD-11 Underlying Cause of Death </h2>
                    <p style={{ color: '#6E6E6E'}}>Upload a csv file containing mortality data for the generation of Underlying COD.</p>
                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleDorisUploadFileSelection} style={{ display: 'none' }} />
                    <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10, color: '#6E6E6E', borderRadius: 5 }}>Select COD FIle</Button>
                    {dorisFileData && !dorisProcessingData.isProcessing && (
                        <Button style={{backgroundColor: '#125887', borderRadius: 5}} type="primary" onClick={beginDorisCodProcessing}>Start Data Import</Button>
                    )}
                </div>

                {/* Processing Section */}
                {(dorisProcessingData.isProcessing || dhisProcessingData.processedRows >= 1) && (
                    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20, width: '553px', margin: 'auto' }}>
                        <h3>Processing: {dorisFileData?.fileName}</h3>
                        <Table columns={dorisColumns} dataSource={dorisDataSource} pagination={false} bordered size="small" style={{ maxWidth: '100%' }} />

                        {/* Close Button */}
                        <Button
                            onClick={handleCloseDorisTable}
                            style={{ position: 'relative', top: 10, right: -1 }}
                            danger
                        >
                            Close
                        </Button>

                        {dorisProcessingData.processedRows >= dorisProcessingData.totalRows && (
                            <>
                                <div style={{ marginTop: 20, color: 'green' }}>Processing complete!</div>

                                {dorisProcessingData.errorCount > 0 && (
                                    <div style={{ marginTop: 10, color: 'red' }}>
                                        Errors Encountered: {dorisProcessingData.errorCount}
                                    </div>
                                )}
                            </>
                        )}


                    </div>

                    )}
                                        </div>


            {/* DHIS and its Process Table */}
            <div className="dhis-wrapper" style={{ margin: '0 auto'}} >
                
                {/* DHIS Import Section */}
                <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20, height: '230px', width: '600px'}}>
                    <h2 style={{ fontSize: '28px'}}>Mortality Data DHIS Import</h2>
                    <p style={{ color: '#6E6E6E'}}>Upload CSV file into DHIS2.</p>


                    {/* Organization Units Dropdown */}
                    <div style={{ marginBottom: 20 }}>
                        {/* <label htmlFor="orgUnitDropdown">Select Organization Unit:</label> */}
                        <select
                            id="orgUnitDropdown"
                            value={selectedOrgUnit}
                            onChange={handleOrgUnitChange}
                            style={{ width: '100%', padding: 10, borderRadius: 5, color: '#6E6E6E', backgroundColor: '#F8F8F8'}}
                        >
                            <option value="">Select an organization unit</option>
                            {orgUnits.map(unit => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.displayName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Upload button for DHIS2 Import Section */}


                    <Upload {...uploadProps}>
                        <Button style={{borderRadius: 5}}icon={<UploadOutlined />}>Upload CSV</Button>
                    </Upload>


                    <input type="file" accept=".json" ref={fileInputRef} onChange={handleDorisUploadFileSelection} style={{ display: 'none' }} />
                    {/* <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10 }}>Select COD FIle</Button> */}
                    {dhisFileData && !dhisProcessingData.isProcessing && (
                        <Button style={{marginLeft: '10px', backgroundColor: '#125887', borderRadius: 5}} type="primary" onClick={beginDorisCodProcessing}>Start Data Import</Button>
                    )}


                </div>
                {dhisProcessingData.error && (
                    <div style={{color:'red', marginBottom: 10}} > Error: {dhisProcessingData.error}</div>
                )}

                {(dhisProcessingData.isProcessing || dhisProcessingData.processedRows >= 1) && (
                    <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20, width: '553px', margin: 'auto' }}>
                        <h3>Processing: {dhisFileData?.fileName}</h3>
                        <Table columns={dhisColumns} dataSource={dhisDataSource} pagination={false} bordered size="small" style={{ maxWidth: '100%' }} />

                        {/* Close Button */}
                        <Button
                            onClick={handleCloseDhisTable}
                            style={{ position: 'relative', top: 10, right: -1 }}
                            danger
                        >
                            Close
                        </Button>   

                        {dhisProcessingData.processedRows >= dhisProcessingData.totalRows && (
                            <>
                                <div style={{ marginTop: 20, color: 'green' }}>Processing complete!</div>

                                {dhisProcessingData.errorCount > 0 && (
                                    <div style={{ marginTop: 10, color: 'red' }}>
                                        Errors Encountered: {dhisProcessingData.errorCount}
                                    </div>
                                )}
                            </>
                        )}


                    </div>
                )}
            </div>
            </div>


        </div>


    );

};

const mapStateToProps = (state) => {
    return {
      metadata: state.metadata,
      data: state.data,
    icdApi_clientToken: state.metadata.icdApi_clientToken,
        keyUILocale: state.metadata.keyUiLocale

    };
};

export default connect(mapStateToProps)(ImportData);