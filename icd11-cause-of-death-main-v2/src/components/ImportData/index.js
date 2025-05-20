import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Button, Table , message, Upload, Progress} from "antd";
import { UploadOutlined } from '@ant-design/icons';

import { generateDhis2Payload, generateDhis2Payloadx, generateBulkDhis2Payload } from "../../utils";
import { Hooks } from "tracker-capture-app-core";
import { generateCode } from "../../utils";

import {  getToken } from "../../utils/icd11";

// import { UploadOutlined } from '@ant-design/icons';
import {
    mutateTei,
    mutateAttribute,
    mutateEnrollment,
    mutateEvent
  } from "../../redux/actions/data";


//Methods that this class would include are but not limited to 
// 1 a method that updates the count of the rejected / accepted / ignored import from doris
// 2 On the long run th evision is for this module to produce a csv with pre-determined cause of death and results from doris 
// - the result would be a csv file which we would now decide as a team to either 
// a. have a button that directly imports the resulting csv directly into dhis 
// (we now have to think of how to handle the failed ones)
// b. ALternativelity decide if we wantto import the converted data into dhis using the import export app 


// const [loading,setLoading]=useState(false);
const { useApi } = Hooks;



const ImportData = ({
    metadata
}) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [orgUnits, setOrgUnits] = useState([]);
    const [selectedOrgUnit, setSelectedOrgUnit] = useState('');
    const [fileData, setFileData] = useState(null);
    const [loading,setLoading]=useState(false);
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

    const [processingDhisData, setProcessingDhisData] = useState({
        isProcessing: false,
        hasStarted: false,
        totalRows: 0,
        processedRows: 0,
        data: [],
        error: null,
        errorCount: 0,
        erroredRows: []
    });
    const [progress, setProgress] = useState(0);
    const { dataApi, metadataApi } = useApi();
    const {icdApi_clientToken, keyUiLocale } = metadata;

   
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
    
                setFileData({
                    content: parsedData,
                    fileName: file.name,
                    type: file.type,
                    headers: headers 
                });
    
                setProcessingData({
                    isProcessing: false,
                    totalRows: parsedData.length,
                    processedRows: 0,
                    data: parsedData,
                    error: null
                });
    
            } catch (error) {
                setProcessingData(prev => ({
                    ...prev,
                    error: error.message
                }));
            }
        };
        reader.readAsText(file);
    };

    // Start processing
    const beginDorisCodProcessing = async () => {
        if (!fileData || !fileData.content) {
            console.log("There is no data in the file ---------Error!!!");
            return;
        }
    
        const { content, headers } = fileData;
        console.log("Extracted Headers:", headers); 
          
        const dataRows = content.slice(0); // Skip the header row
    
        setProcessingData(prev => ({
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
            setProcessingData(prev => ({
                ...prev,
                error: error.message
            }));
        } finally {
            setProcessingData(prev => ({
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

                  if(apiResponse.reject == true || apiResponse.reject == "TRUE") {

                    erroredRows.push(apiResponse); // Add the errored row to the list

                    await new Promise(resolve => setTimeout(resolve, delayInMillis));


                    setProcessingData(prev => ({
                        ...prev,
                        processedRows: prev.processedRows + 1,
                        errorCount: prev.errorCount + 1,
                        erroredRows
                    }));

                  } else {
                    apiResponsesProcessedList.push(apiResponse);

                    await new Promise(resolve => setTimeout(resolve, delayInMillis));
  
                    setProcessingData(prev => ({
                        ...prev,
                        processedRows: prev.processedRows + 1
                    }));

                  }     

      
              } catch (error) {

                erroredRows.push(deathCertificate); // Add the errored row to the list

                setProcessingData(prev => ({
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

      
          writeCsv(apiResponsesProcessedList, `sample${Math.random()}.csv`,headers, deathCertificates);

          if (erroredRows.length > 0) {
            downloadErrorCsv(erroredRows, `sample_Errors${Math.random()}.csv`,headers, deathCertificates);; // Automatically download errors CSV if errors exist
        }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }

        setFileData(null); // Clear the file data

        
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

    const columns = [
        { title: 'Metric', dataIndex: 'metric', key: 'metric' },
        { title: 'Value', dataIndex: 'value', key: 'value' }
    ];

    const dataSource = [
        { key: '1', metric: 'Total Rows', value: processingData.totalRows },
        { key: '2', metric: 'Processed Rows', value: processingData.processedRows },
        { key: '3', metric: 'Errors', value:processingData.errorCount },
        { key: '4', metric: 'Progress', value: `${((processingData.processedRows / processingData.totalRows) * 100).toFixed(1)}%` }
    ];

    const fetctOrgUnits = async ()=>{
    try{
    const orgUnits = await metadataApi.getOrgUnitsLevel3();
    console.error('Expected an array' + orgUnits);
    console.error('Expected an arrayxxxx' + orgUnits.organisationUnits);
    return orgUnits.organisationUnits
    }catch(error){
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
                                const value  = valueCLeaned !== null ? valueCLeaned : "";

    
                                if (mappedHeader.type === "dataElement") {

                                    dataValues.push({ dataElement: mappedHeader.id, value });
                                }

                                if (mappedHeader.type === "attributes") {
                                    attributeValues.push({ attribute: mappedHeader.id, value });
                                }
                            }
    
                            // Build the payload structure for each row
                            const trackID  = generateCode();
                            const trackentitytype  = generateCode();
                            const enrollmentID  = generateCode();
                            const programid = "u95entEeZ0q";
                            const programStageId = "WlWJt4lVSWw";
                           const trackedEntityTypeId =  'RQrHOJGKT5H';
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
                                        uid:"xE7jOejl9FI",
                                        firstName:"John",
                                        surname:"Traore",
                                        username:"admin"
                                    },
                                createdByUserInfo:{
                                        uid:"xE7jOejl9FI",
                                        firstName:"John",
                                        surname:"Traore",
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
                                    potentialDuplicate:false,
                                    inactive:false,
                                    deleted:false,
                                    featureType:"NONE",

                                    lastUpdatedByUserInfo: {
                                        uid:"xE7jOejl9FI",
                                        firstName:"John",
                                        surname:"Traore",
                                        username:"admin"
                                    },
                                    createdByUserInfo:{
                                        uid:"xE7jOejl9FI",
                                        firstName:"John",
                                        surname:"Traore",
                                        username:"admin"
                                     },

                                     programOwners : [
                                        {
                                            ownerOrgUnit: orgUnitID,
                                            program: programid,
                                            trackedEntityInstance: trackID
                                        }
                                     ],
                                     relationships:[] ,

                                     orgUnit: orgUnitID,
                                     program: programid,
                                     trackedEntityInstance: trackID


                                },
                                events: {
                                event: {
                                    event: generateCode(),
                                    isDirty: true,
                                    isNew: true,
                                    orgUnit: orgUnitID,
                                    enrollment: enrollmentID,
                                    trackedEntityInstance: trackID,
                                    program: programid,
                                    programStage: programStageId,
                                    dataValues: dataValues,
                                    eventDate: new Date().toISOString().split('T')[0],
                                    dueDate: new Date().toISOString().split('T')[0]

                                    // dataElements: dataValues.dataElement


                                },
                                event: generateCode(),
                                isDirty: true,
                                isNew: true,
                                orgUnit: orgUnitID,
                                enrollment: enrollmentID,
                                trackedEntityInstance: trackID,
                                program: programid,
                                programStage: programStageId,
                                dataValues: dataValues,
                                eventDate: new Date().toISOString().split('T')[0],
                                dueDate: new Date().toISOString().split('T')[0]
                                // dataValues: dataValues,
                                // // dataElements: dataValues.dataElement,
                                // programStage: "WlWJt4lVSWw"
                            },
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
                                    dueDate: new Date().toISOString().split('T')[0]

                            }
                            };
                            parsedData.push(eventPayload);
                        }
                    }

                    console.log("parsedDataparsedDataparsedData" + parsedData);

                   

                } else {
                    throw new Error('Unsupported file format');
                }

                setFileData({
                    content: parsedData,
                    fileName: file.name,
                    type: file.type,
                    headers: headers,
                    orgUnitID : selectedOrgUnit
                });
    
                setProcessingDhisData({
                    isProcessing: false,
                    totalRows: parsedData.length,
                    processedRows: 0,
                    data: parsedData,
                    error: null
                });
    
                console.log("Generated Parsed Payload:", parsedData);
                let processedCount = 0;
                const totalRows = parsedData.length;

                for (const data of parsedData) {

                    console.log("Generated Individual Data :", data);


                    const programid = "u95entEeZ0q";
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
                          console.log("DOneeeeeee" );


                    } catch (error) {
                        // console.error(`Error processing data for TEI: ${currentTei.trackedEntityInstance}`, error);
                    }

                processedCount++;
                setProgress(Math.round((processedCount / totalRows) * 100));
                }


    
            } catch (error) {
                setProcessingDhisData(prev => ({
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

    const handleCloseTable = () => {
        // Reset the processing state
        setProcessingData({
            isProcessing: false,
            hasStarted: false,
            processedRows: 0,
            totalRows: 0,
            errorCount: 0,
            erroredRows: []
        });
    
        // Optionally clear the file data as well
        setFileData(null);
    
        console.log("Processing table closed successfully.");
    };
    
  
    return (


        <div style={{ padding: 20, maxWidth: 800, margin: 'auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 20 }}>Mortality and Morbidity Data Import Module</h1>
            
            {/* DORIS Import Section */}

            <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20 , position: 'relative'}}>
                <h2>DORIS ICD-11 Underlying Cause of Death </h2>
                <p>Upload a csv file containing mortality data for the generation of Underlying COD.</p>
                <input type="file" accept=".json" ref={fileInputRef} onChange={handleDorisUploadFileSelection} style={{ display: 'none' }} />
                <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10 }}>Select COD FIle</Button>
                {fileData && !processingData.isProcessing && (
                    <Button type="primary" onClick={beginDorisCodProcessing}>Start Import</Button>
                )}
            </div>
  
            {/* Processing Section */}
            {(processingData.isProcessing || processingData.processedRows >= 1)  && (
            <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20 }}>
            <h3>Processing: {fileData?.fileName}</h3>
            <Table columns={columns} dataSource={dataSource} pagination={false} bordered size="small" style={{ maxWidth: '100%' }} />

           {/* Close Button */}
            <Button 
            onClick={handleCloseTable} 
            style={{ position: 'relative', top: 10, right: -1 }}
            danger
            >
            Close
            </Button>

            {processingData.processedRows >= processingData.totalRows && (
            <>
             <div style={{ marginTop: 20, color: 'green' }}>Processing complete!</div>

            {processingData.errorCount > 0 && (
                    <div style={{ marginTop: 10, color: 'red' }}>
                        Errors Encountered: {processingData.errorCount}
                    </div>
            )}
            </>
        )}
        

    </div>
    )}


   
            {/* DHIS Import Section */}
            <div style={{ padding: 20, border: '1px solid #ddd', borderRadius: 10, marginBottom: 20 }}>
                <h2>Mortality Data DHIS Import</h2>
                <p>Upload CSV file into DHIS2.</p>


          {/* Organization Units Dropdown */}
          <div style={{ marginBottom: 20 }}>
                <label htmlFor="orgUnitDropdown">Select Organization Unit:</label>
                <select
                    id="orgUnitDropdown"
                    value={selectedOrgUnit}
                    onChange={handleOrgUnitChange}
                    style={{ width: '100%', padding: 10, borderRadius: 5 }}
                >
                    <option value="">Select an organization unit</option>
                    {orgUnits.map(unit => (
                        <option key={unit.id} value={unit.id}>
                            {unit.displayName}
                        </option>
                    ))}
                </select>
            </div>

            <input type="file" accept=".json" ref={fileInputRef} onChange={handleDorisUploadFileSelection} style={{ display: 'none' }} />
                <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10 }}>Select COD FIle</Button>
                {fileData && !processingData.isProcessing && (
                    <Button type="primary" onClick={beginDorisCodProcessing}>Start Import</Button>
                )}


                        {/* Upload button for DHIS2 Import Section */}


                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>Upload CSV</Button>
                </Upload>



            </div>
            


            {/* Error Message */}
            {processingData.error && (
                <div style={{ color: 'red', marginBottom: 10 }}>Error: {processingData.error}</div>
            )}
            
            {/* Save Button */}
            <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Button
                    type="primary"
                    style={{ width: '110px' }}
                    loading={loading}
                    onClick={async () => {
                        if (!fileData || !fileData.content) {
                            message.error("No file data to save!");
                            return;
                        }
                        setLoading(true);
                        const { currentEvents } = generateDhis2Payload(fileData, processingData);
                        await dataApi.pushEvents({ events: currentEvents });
                        mutateEvent(currentEvents[0].event, "isDirty", false);
                        setLoading(false);
                        message.success("Saved Successfully!");
                    }}
                >
                    Save
                </Button>
            </div>

            
        </div>
    );
    
};

const mapStateToProps = (state) => {
    return {
      metadata: state.metadata,
      data: state.data
    };
  };

export default connect(mapStateToProps)(ImportData);