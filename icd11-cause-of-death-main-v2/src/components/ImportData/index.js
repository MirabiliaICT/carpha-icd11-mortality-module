import { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./index.css";
import colorImage from '../../asset/chevron-left.png';

import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Button, Table, message, Upload, List, Typography, Progress } from "antd";
import { UploadOutlined, CheckCircleTwoTone } from '@ant-design/icons';


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



const ImportData = ({ metadata, icdApi_clientToken }) => {
    const { t } = useTranslation();
    const fileInputRef = useRef(null);
    const [orgUnits, setOrgUnits] = useState([]);
     const [userDetails, setUserDetails] = useState([]);

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

    // const [fileData, setFileData] = useState(null);
    const [loading, setLoading] = useState(false);
    // const [processingData, setProcessingData] = useState({
    //     isProcessing: false,
    //     hasStarted: false,
    //     totalRows: 0,
    //     processedRows: 0,
    //     data: [],
    //     error: null,
    //     errorCount: 0,
    //     erroredRows: []
    // });

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
                    error: null,
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
                'Accept-Encoding': 'gzip, deflate, br',
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

                    apiResponsesProcessedList.push(apiResponse);


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


        const now = new Date();
        const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
        const filename = `Doris_Processed_COD_${timestamp}.csv`;

        writeCsv(apiResponsesProcessedList, filename, headers, deathCertificates);
        // if (erroredRows.length > 0) {
        //     downloadErrorCsv(erroredRows, `sample_Errors${Math.random()}.csv`, headers, deathCertificates);; // Automatically download errors CSV if errors exist
        // }

        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input
        }

        setDorisFileData(null); // Clear the file data


    };

    const writeCsv = (responses, filePath, originalHeadersx, originalData) => {
        // Combine the original headers with the report headers
        const header = [...originalHeadersx, "stemCode", "stemURI", "code", "uri", "report", "reject", "error", "warning", "system_id"].map(header => header.trim());

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

        // Escape special characters in the error field
        const escapeError = (error) => {
            if (!error) return '';
            error = error.replace(/\n/g, "\\n"); // Replace newlines with a placeholder
            return `"${error}"`; // Wrap the report in double quotes to handle commas
        };

        // Function to transform Sex column values
    const transformSexValue = (value) => {
        if (value === 1 || value === '1') {return 'Male';}
        else if (value === 2 || value === '2') {return 'Female';}
        else {return 'Unknown';}
    };

    const csvContent = [
    header.join(","), // Header row
    ...responses.map((response, index) => {
        const originalRow = originalData[index];
        const transformedRow = originalHeadersx.map(header => {
            const value = originalRow[header];
            // Check if this is the Sex column and transform the value
            if (header.trim().toLowerCase() === 'sex') {
                return transformSexValue(value);
            }
            return value;
        });
        
        // Get the first column value for system_id
        const firstColumnValue = transformedRow[0];
        
        return [
            ...transformedRow, // Original row values with Sex transformation
            response.stemCode,
            response.stemURI,
            response.code,
            response.uri,
            escapeReport(response.report), // Escaped report field
            response.reject,
            escapeError(response.error),
            escapeWarning(response.warning),
            firstColumnValue // Add first column value as system_id
        ].join(","); // Join the row with commas
    })
].join("\n");

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

        const fetctUserDetails = async () => {
        try {
            const userDetails = await metadataApi.getUsersFullDetails();
            console.error('ExpecteduserDetailsy' + userDetails);
            console.error('Expected an arrayxxxxuserDetails' + userDetails.id);
            return userDetails;
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

               const loadUserDetails = async () => {
            const userDetail = await fetctUserDetails();
            console.log('API Response--userDetail:', userDetail.id); // Log the response

            console.log('API ResponseuserDetail:', userDetail.surname); // Log the response
                        console.log('API ResponseuserDetail:', userDetail.firstName); // Log the response


            if (Array.isArray(userDetail)) {
                setUserDetails(userDetail);
            } else {
                console.error('Expected an array but got:', userDetail);
            }
        };

        loadOrgUnits();

        loadUserDetails();
    }, []);

    const handleOrgUnitChange = (event) => {
        setSelectedOrgUnit(event.target.value);
        console.log('Selected Organization Unit ID:', event.target.value);
    };


    const handleFileUploadToDhis = (file) => {

        const formMapping = require("../../asset/metadata/mapping.json");

        if (!file) return false;

        // if(!selectedOrgUnit){
        //     message.info("Selected an org");
        //     return;
        // }

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

                                console.log(attributeKey + "attributeattribute")
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

                                    console.log("attribute logged " + mappedHeader.id);

                                    console.log("attribute  value logged " + value);

                                }
                            }

                            // Build the payload structure for each row
                            const trackID = generateCode();
                            const enrollmentID = generateCode();
                            const programid = "ogrOUKoSaWA";
                            const programStageId = "WlWJt4lVSWw";
                            const trackedEntityTypeId = 'RQrHOJGKT5H';

                            const dateandTime = new Date().toISOString().split('T')[0];

                            const eventPayload = {

                                enrollment: {
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
                                        uid: userDetails.id,
                                        firstName: userDetails.firstName,
                                        surname: userDetails.surname,
                                        username: userDetails.username
                                    },
                                    createdByUserInfo: {
                                         uid: userDetails.id,
                                        firstName: userDetails.firstName,
                                        surname: userDetails.surname,
                                        username: userDetails.username
                                    },
                                    notes: [
                                    ],
                                    relationships: [
                                    ],
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
                                        uid: userDetails.id,
                                        firstName: userDetails.firstName,
                                        surname: userDetails.surname,
                                        username: userDetails.username
                                    },
                                    createdByUserInfo: {
                                       uid: userDetails.id,
                                        firstName: userDetails.firstName,
                                        surname: userDetails.surname,
                                        username: userDetails.username
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
                                events: {},
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
                    hasStarted: false,
                    totalRows: parsedData.length,
                    processedRows: 0,
                    data: parsedData,
                    error: null,
                    rrorCount: 0,
                    erroredRows: []
                });

                console.log("Generated Parsed Payload:", parsedData);

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

    const writeDhisCsv = (processedData, filePath, originalHeaders, originalData, erroredRows) => {
        // Combine the original headers with the DHIS result headers
        const header = [...originalHeaders, "stemCode", "stemURI", "code", "trackedEntityInstance", "uri", "report", "reject", "error", "warning"].map(header => header.trim());

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
            ...processedData.map((result, index) => {
                const originalRow = originalData[index];
                return [
                    ...originalHeaders.map(header => originalRow[header] || ''), // Original row values
                    result.stemCode,
                    result.stemURI,
                    result.code,
                    result.trackedEntityInstance || '',
                    result.uri,
                    escapeReport(result.report),
                    result.reject || '',
                    result.error || '',
                    escapeWarning(result.warning)
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

    const downloadDhisErrorCsv = (erroredRows, filePath, originalHeaders, originalData) => {
        const header = [...originalHeaders, "stemCode", "stemURI", "code", "trackedEntityInstance", "uri", "report", "reject", "error", "warning"].map(header => header.trim());

        const escapeReport = (report) => {
            if (!report) return '';
            report = report.replace(/\n/g, "\\n");
            return `"${report}"`;
        };

        const csvContent = [
            header.join(","),
            ...erroredRows.map((errorItem, index) => {
                // Find the original row data that corresponds to this error
                const originalRowIndex = originalData.findIndex(row =>
                    JSON.stringify(row) === JSON.stringify(errorItem.data?.originalRow)
                );
                const originalRow = originalRowIndex >= 0 ? originalData[originalRowIndex] : {};

                return [
                    ...originalHeaders.map(header => originalRow[header] || ''),
                    errorItem.stemCode,
                    errorItem.stemURI,
                    errorItem.code,
                    errorItem.trackedEntityInstance || '',
                    errorItem.uri,
                    escapeReport(errorItem.report), // Escaped report field
                    errorItem.reject,
                    errorItem.error,
                    errorItem.warning
                ].join(",");
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

    // Updated beginDhisCodProcessing function
    const beginDhisCodProcessing = async () => {
        if (!dhisFileData || !dhisFileData.content) {
            console.log("There is no data in the file ---------Error!!!");
            return;
        }

        const { content, headers } = dhisFileData;

        setDhisProcessingData(prev => ({
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

        const processedData = [];
        const erroredRows = [];

        try {
            let processedCount = 0;
            const totalRows = content.length;

            for (const data of content) {
                console.log("Generated Individual Data :", data);

                const programid = "ogrOUKoSaWA";
                let programMetadata;

                try {
                    programMetadata = await metadataApi.getProgramMetadata(programid);
                    console.log("Program Metadata API call successful:", programMetadata);
                } catch (apiError) {
                    console.error("Failed to fetch program metadata from API:", apiError);
                    console.log("Using fallback program metadata structure");

                    programMetadata = {
                        id: programid,
                        trackedEntityAttributes: [],
                        programStages: []
                    };
                }

                try {
                    if (!programMetadata) {
                        throw new Error('Program metadata not found');
                    }

                    console.log("Program Metadata received:", programMetadata);
                    console.log("Program Metadata keys:", Object.keys(programMetadata));

                    const safeProgramMetadata = {
                        id: programMetadata.id || programid,
                        trackedEntityAttributes: programMetadata.trackedEntityAttributes || [],
                        programStages: programMetadata.programStages || []
                    };

                    if (!safeProgramMetadata.trackedEntityAttributes || safeProgramMetadata.trackedEntityAttributes.length === 0) {
                        console.warn("No trackedEntityAttributes found, using empty array");
                    }

                    if (!safeProgramMetadata.programStages || safeProgramMetadata.programStages.length === 0) {
                        console.warn("No programStages found, using empty array");
                    }

                    const { trackedEntityInstance, enrollment, events } = generateDhis2Payloadx(data, safeProgramMetadata);

                    console.log("currentEventscurrentEvents" + trackedEntityInstance);
                    console.log("enrollmentenrollment" + enrollment);
                    console.log("eventevent" + events);

                    await dataApi.pushTrackedEntityInstance(
                        data.trackedEntityInstance,
                        safeProgramMetadata.id
                    );

                    await dataApi.pushEnrollment(
                        data.enrollment,
                        safeProgramMetadata.id
                    );

                    await dataApi.pushEvents({ events: [data.event] });
                    console.log("DHIS: Successfully processed row");

                    // Add to processed data for CSV
                    processedData.push({
                        status: 'Success',
                        message: 'Successfully processed',
                        trackedEntityInstance: data.trackedEntityInstance?.trackedEntityInstance || '',
                        enrollment: data.enrollment?.enrollment || '',
                        event: data.event?.event || '',
                        originalRow: content[processedCount] // Keep reference to original data
                    });

                } catch (error) {
                    console.error(`DHIS Error processing data for TEI: ${data.trackedEntityInstance}`, error);
                    console.error("Full error details:", error);

                    // Add to errored rows
                    erroredRows.push({
                        data: {
                            ...data,
                            originalRow: content[processedCount]
                        },
                        error: error.message,
                        timestamp: new Date().toISOString()
                    });

                    setDhisProcessingData(prev => ({
                        ...prev,
                        errorCount: prev.errorCount + 1,
                        erroredRows: [...prev.erroredRows, {
                            data: data,
                            error: error.message,
                            timestamp: new Date().toISOString()
                        }]
                    }));
                }

                processedCount++;
                setProgress(Math.round((processedCount / totalRows) * 100));

                setDhisProcessingData(prev => ({
                    ...prev,
                    processedRows: processedCount
                }));
            }

            // Generate CSV files after processing is complete
            console.log("writeDhisCsv----", headers);
            console.log("writeDhisCsv----", content);

            // Download successful results
            if (processedData.length > 0) {
                writeDhisCsv(processedData, `dhis_import_results_${Math.random().toString(36).substr(2, 9)}.csv`, headers, content, erroredRows);
            }

            // Download errors if any
            if (erroredRows.length > 0) {
                downloadDhisErrorCsv(erroredRows, `dhis_import_errors_${Math.random().toString(36).substr(2, 9)}.csv`, headers, content);
            }

            // Clear file input and data
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            setDhisFileData(null);

        } catch (error) {
            setDhisProcessingData(prev => ({
                ...prev,
                error: error.message
            }));
        } finally {
            setDhisProcessingData(prev => ({
                ...prev,
                isProcessing: false
            }));
        }
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

    const downloadFile = () => {
        try {
            const publicUrl = '\ICD11DorisTemplate.csv';

            // Create download link
            const link = document.createElement('a');
            link.href = publicUrl;
            link.download = 'ICD11DorisTemplate.csv';
            link.target = '_blank';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Download failed. Please try again.');
        }
    };


    return (


        <div className="import-module-main-div">
            <h1 className="import-module-header">Mortality and Morbidity Data Import Module</h1>

            {/* Import General Section*/}
            <div className="general-wrapper" style={{}}>
                {/* DORIS Import Section */}
                <div className="doris-import-wrapper" style={{}}>


                    <div className="doris-content-div" style={{}}>
                        <h2 style={{ fontSize: '28px' }}>DORIS ICD-11 Tool </h2>

                        <p style={{ color: '#6E6E6E' }}>(a). Download template to generate the Underlying COD.

                            <a onClick={downloadFile} style={{ color: '#12588C', cursor: 'pointer', textDecoration: 'underline', marginLeft: 8, fontWeight: 500 }}>Download Import Template</a>

                        </p>


                        <p style={{ color: '#6E6E6E' }}>(b). Upload a csv file containing mortality data to generate the Underlying COD.</p>
                        <input type="file" accept=".csv,.json" ref={fileInputRef} onChange={handleDorisUploadFileSelection} style={{ display: 'none' }} />



                        <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10, color: '#6E6E6E', borderRadius: 5 }}>Select COD FIle</Button>
                        {dorisFileData && !dorisProcessingData.isProcessing && (
                            <Button style={{ backgroundColor: '#125887', borderRadius: 5 }} type="primary" onClick={beginDorisCodProcessing}>Start Data Import</Button>
                        )}
                    </div>


                    {/* Processing Section */}
                    {(dorisProcessingData.isProcessing || dorisProcessingData.hasStarted || dorisProcessingData.processedRows >= 1) && (
                        <div className="doris-process" style={{}}>

                            {/* Header */}
                            <div className="process-header" style={{}}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal' }}>Processing: {dorisFileData?.fileName}</h3>
                                <span style={{ marginLeft: 'auto', fontSize: '18px' }}><img src={colorImage}></img></span>

                            </div>

                            {/* Metrics and value header */}
                            <div className="metrics-value-wrapper" style={{}}>
                                <h3 className="metrics-title" style={{}}>Metrics</h3>
                                <span className="value-title" style={{}}>Value</span>

                            </div>
                            <div style={{ padding: '20px' }}>
                                {/* Total row div */}
                                <div className="total-row-div" style={{}}>
                                    <div className="total-dotted-wrapper" style={{}}>
                                        <div className="total-title" style={{}}>Total Rows</div>
                                        <div className="total-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{dorisProcessingData.totalRows}</span>
                                </div>

                                {/* process row div*/}
                                <div className="process-row-div" style={{}}>
                                    <div className="process-dotted-wrapper" style={{}}>
                                        <div className="process-title" style={{}}>Processed Rows</div>
                                        <div className="process-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{dorisProcessingData.processedRows}</span>
                                </div>

                                {/* error row div*/}
                                <div className="error-row-div" style={{}}>
                                    <div className="error-dotted-wrapper" style={{}}>
                                        <div className="error-title" style={{}}>Errors</div>
                                        <div className="error-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold', color: dorisProcessingData.errorCount > 0 ? '#ff4d4f' : 'inherit' }}>
                                        {dorisProcessingData.errorCount}
                                    </span>
                                </div>

                                {/* Progress row div */}
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '14px' }}>
                                        <span style={{ color: '#666' }}>Progress</span>
                                        {/* Progress Bar */}
                                        <span style={{
                                            width: '78%',
                                            height: '8px',
                                            backgroundColor: '#f0f0f0',
                                            borderRadius: '4px',
                                            // border : '1px solid #0cb079',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${dorisProcessingData.totalRows > 0 ? (dorisProcessingData.processedRows / dorisProcessingData.totalRows) * 100 : 0}%`,
                                                height: '100%',
                                                backgroundColor: '#0cb079',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {dorisProcessingData.totalRows > 0
                                                ? `${((dorisProcessingData.processedRows / dorisProcessingData.totalRows) * 100).toFixed(0)}%`
                                                : '0%'
                                            }
                                        </span>
                                    </div>


                                </div>
                            </div>
                            {dorisProcessingData.processedRows >= dorisProcessingData.totalRows && (
                                <>
                                    <div style={{ paddingLeft: 20, color: '#0cb079' }}>Processing complete!</div>

                                    {dorisProcessingData.errorCount > 0 && (
                                        <div style={{ padding: '10px 20px', color: 'red' }}>
                                            Errors Encountered: {dorisProcessingData.errorCount}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Close Button - Hidden for now to match the design */}
                            <Button
                                onClick={handleCloseDorisTable}
                                style={{ margin: 20 }}
                                danger
                            >
                                Close
                            </Button>
                        </div>
                    )}
                </div>


                {/* DHIS and its Process Table */}
                <div className="dhis-wrapper" style={{}} >

                    {/* DHIS Import Section */}
                    <div className="dhis-content-div" style={{}}>
                        <h2 style={{ fontSize: '28px' }}>Mortality Data DHIS Import</h2>
                        <p style={{ color: '#6E6E6E' }}>Upload CSV file into DHIS2.</p>


                        {/* Organization Units Dropdown */}
                        <div style={{ marginBottom: 20 }}>
                            {/* <label htmlFor="orgUnitDropdown">Select Organization Unit:</label> */}
                            <select
                                id="orgUnitDropdown"
                                value={selectedOrgUnit}
                                onChange={handleOrgUnitChange}
                                style={{ width: '100%', padding: 10, borderRadius: 5, color: '#6E6E6E', backgroundColor: '#F8F8F8' }}
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

                        {selectedOrgUnit ? (
                            <Upload {...uploadProps}>
                                <Button style={{ borderRadius: 5 }} icon={<UploadOutlined />}>Upload CSV</Button>
                            </Upload>
                        ) : (
                            <div style={{ color: '#888', marginBottom: 10 }}>
                                Please select an organization unit to enable file upload.
                            </div>
                        )}
                        {/* <Button onClick={() => fileInputRef.current.click()} style={{ marginRight: 10 }}>Select COD FIle</Button> */}
                        {dhisFileData && !dhisProcessingData.isProcessing && (
                            <Button style={{ marginLeft: '10px', backgroundColor: '#125887', borderRadius: 5 }} type="primary" onClick={beginDhisCodProcessing}>Start Data Import</Button>
                        )}


                    </div>

                    {/* Error Message */}
                    {dhisProcessingData.error && (
                        <div style={{ color: 'red', marginBottom: 10 }}>Error: {dhisProcessingData.error}</div>
                    )}

                    {(dhisProcessingData.isProcessing || dhisProcessingData.hasStarted || dhisProcessingData.processedRows >= 1) && (
                        <div className="doris-process" style={{ border: '1px solid #ddd', borderRadius: 10, marginBottom: 20, maxWidth: '553px', width: '100%', margin: 'auto' }}>

                            {/* Header */}
                            <div className="process-header" style={{}}>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'normal' }}>Processing: {dhisFileData?.fileName}</h3>
                                <span style={{ marginLeft: 'auto', fontSize: '18px' }}><img src={colorImage}></img></span>

                            </div>

                            {/* Metrics and value header */}
                            <div className="metrics-value-wrapper" style={{}}>
                                <h3 className="metrics-title" style={{}}>Metrics</h3>
                                <span className="value-title" style={{}}>Value</span>

                            </div>
                            <div style={{ padding: '20px' }}>
                                {/* Total row div */}
                                <div className="total-row-div" style={{}}>
                                    <div className="total-dotted-wrapper" style={{}}>
                                        <div className="total-title" style={{}}>Total Rows</div>
                                        <div className="total-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{dhisProcessingData.totalRows}</span>
                                </div>

                                {/* process row div*/}
                                <div className="process-row-div" style={{}}>
                                    <div className="process-dotted-wrapper" style={{}}>
                                        <div className="process-title" style={{ color: '#666' }}>Processed Rows</div>
                                        <div className="process-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold' }}>{dhisProcessingData.processedRows}</span>
                                </div>

                                {/* error row div*/}
                                <div className="error-row-div" style={{}}>
                                    <div className="error-dotted-wrapper" style={{}}>
                                        <div className="error-title" style={{}}>Errors</div>
                                        <div className="error-dotted-div" style={{}}> </div>
                                    </div>
                                    <span style={{ fontWeight: 'bold', color: dhisProcessingData.errorCount > 0 ? '#ff4d4f' : 'inherit' }}>
                                        {dhisProcessingData.errorCount}
                                    </span>
                                </div>

                                {/* Progress row div */}
                                <div style={{ marginBottom: 12 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, fontSize: '14px' }}>
                                        <span style={{ color: '#666' }}>Progress</span>
                                        {/* Progress Bar */}
                                        <span style={{
                                            width: '70%',
                                            height: '8px',
                                            backgroundColor: '#0cb079',
                                            borderRadius: '4px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${dhisProcessingData.totalRows > 0 ? (dhisProcessingData.processedRows / dhisProcessingData.totalRows) * 100 : 0}%`,
                                                height: '100%',
                                                backgroundColor: '#52c41a',
                                                transition: 'width 0.3s ease'
                                            }}></div>
                                        </span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {dhisProcessingData.totalRows > 0
                                                ? `${((dhisProcessingData.processedRows / dhisProcessingData.totalRows) * 100).toFixed(0)}%`
                                                : '0%'
                                            }
                                        </span>
                                    </div>


                                </div>
                            </div>
                            {dhisProcessingData.processedRows >= dhisProcessingData.totalRows && (
                                <>
                                    <div style={{ paddingLeft: 20, color: 'green' }}>Processing complete!</div>

                                    {dhisProcessingData.errorCount > 0 && (
                                        <div style={{ padding: '10px 20px', color: 'red' }}>
                                            Errors Encountered: {dhisProcessingData.errorCount}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Close Button */}
                            <Button
                                onClick={handleCloseDhisTable}
                                style={{ margin: 20 }}
                                danger
                            >
                                Close
                            </Button>
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