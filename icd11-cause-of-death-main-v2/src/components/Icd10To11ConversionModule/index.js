import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./index.css";

import { useTranslation } from "react-i18next";
import moment from "moment";
import { Button, Table, message, Upload, Progress } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import {
  generateDhis2Payload,
  generateDhis2Payloadx,
  generateBulkDhis2Payload,
} from "../../utils";
import { Hooks } from "tracker-capture-app-core";
import { generateCode } from "../../utils";

import { getToken } from "../../utils/icd11";

// import { UploadOutlined } from '@ant-design/icons';
import {
  mutateTei,
  mutateAttribute,
  mutateEnrollment,
  mutateEvent,
} from "../../redux/actions/data";

const { useApi } = Hooks;

function ICDCodeMapper() {
  const [mappingFile, setMappingFile] = useState(null);
  const [importFile, setImportFile] = useState(null);
  const [mappingData, setMappingData] = useState([]);
  const [importData, setImportData] = useState([]);
  const [mappedData, setMappedData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [originalHeaders, setOriginalHeaders] = useState([]);

  // Define the relevant ICD code columns
  const icdColumns = [
    "co_underlying_cause",
    "co_associated_cause_a",
    "co_associated_cause_b",
    "co_associated_cause_c",
    "co_associated_cause_d",
  ];

  // Parse the mapping file (txt)
  const handleMappingFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setMappingFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split("\n").filter((line) => line.trim());

        // Skip header line
        const data = lines.slice(1).map((line) => {
          const columns = line.split("\t");
          return {
            icd10Code: columns[2], // icd10Code column
            icd11Code: columns[9], // icd11Code column
            icd10Title: columns[4], // icd10Title column
            icd11Title: columns[11], // icd11Title column
          };
        });

        setMappingData(data);
        setError("");
      } catch (err) {
        setError("Error parsing mapping file: " + err.message);
      }
    };

    reader.readAsText(file);
  };



  // Parse the import file (CSV)
  const handleImportFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportFile(file);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split("\n").filter((line) => line.trim());

        // Parse CSV header
        const header = parseCSVLine(lines[0]);
        setOriginalHeaders(header);

        // Parse the data rows
        const data = lines.slice(1).map((line) => {
          const values = parseCSVLine(line);
          const record = {};

          header.forEach((column, index) => {
            record[column] = values[index] || "";
          });

          return record;
        });

        setImportData(data);
        setError("");
      } catch (err) {
        setError("Error parsing import file: " + err.message);
      }
    };

    reader.readAsText(file);
  };

  // Better CSV parser to handle quoted values
  const parseCSVLine = (line) => {
    const result = [];
    let insideQuotes = false;
    let currentValue = "";

    for (let i = 0; i < line.length; i++) {
      const char = line.charAt(i);

      if (char === '"') {
        if (insideQuotes && line.charAt(i + 1) === '"') {
          // Handle escaped quotes (double quotes)
          currentValue += '"';
          i++;
        } else {
          // Toggle quote state
          insideQuotes = !insideQuotes;
        }
      } else if (char === "," && !insideQuotes) {
        // End of field
        result.push(currentValue);
        currentValue = "";
      } else {
        // Add character to current field
        currentValue += char;
      }
    }

    // Add the last field
    result.push(currentValue);
    return result;
  };

  // Map ICD-10 codes to ICD-11 codes
 
  const processMapping = () => {
    if (!mappingData.length || !importData.length) {
      setError("Please upload both mapping and import files first");
      return;
    }

    setIsProcessing(true);

    try {
      // Create a lookup map for faster access
      const icd10ToIcd11Map = {};
      mappingData.forEach((item) => {
        if (item.icd10Code) {
          icd10ToIcd11Map[item.icd10Code] = {
            icd11Code: item.icd11Code,
            icd10Title: item.icd10Title,
            icd11Title: item.icd11Title,
          };
        }
      });

      // This should handle the Processing of  each record in the imported data
      const result = importData.map((record) => {
        const mappedRecord = { ...record };

        // Check and map ICD-10 codes in relevant columns
        icdColumns.forEach((column) => {
          const icd10Code = record[column];

          // 4 handling null/NULL/NUL values
          if (!icd10Code || icd10Code === "NULL" || icd10Code === "NUL") {
            mappedRecord[`${column}_icd11`] = "NIL";
            mappedRecord[`${column}_icd11_title`] = "NIL";
          } else {
            let mapping = icd10ToIcd11Map[icd10Code];

            // Try +'ing a period after the 3rd character for 4-character codes if the icd 11 equivqlent of that
            // code is not found
            if (!mapping && icd10Code.length === 4) {
              const modifiedCode =
                icd10Code.slice(0, 3) + "." + icd10Code.slice(3);
              mapping = icd10ToIcd11Map[modifiedCode];

              // If we do nt still find the corresponding code, the, try using just the first 3 characters
              if (!mapping) {
                const shortenedCode = icd10Code.slice(0, 3);
                mapping = icd10ToIcd11Map[shortenedCode];
              }
            }

            if (mapping) {
              mappedRecord[`${column}_icd11`] = mapping.icd11Code;
              mappedRecord[`${column}_icd11_title`] = mapping.icd11Title ? mapping.icd11Title.replace(/,/g, '.') : ''; ;
            } else {
              mappedRecord[`${column}_icd11`] = "Not Found";
              mappedRecord[`${column}_icd11_title`] = "Not Found";
            }
          }
        });

      //cod*_underlying logic here
      const underlying = mappedRecord["co_underlying_cause_icd11"] || "";

      mappedRecord["codA_underlying"] = underlying && underlying === mappedRecord["co_associated_cause_a_icd11"]
          ? "TRUE"
          : "";

      mappedRecord["codB_underlying"] =
        underlying && underlying === mappedRecord["co_associated_cause_b_icd11"]
          ? "TRUE"
          : "";

      mappedRecord["codC_underlying"] =
        underlying && underlying === mappedRecord["co_associated_cause_c_icd11"]
          ? "TRUE"
          : "";

      mappedRecord["codD_underlying"] =
        underlying && underlying === mappedRecord["co_associated_cause_d_icd11"]
          ? "TRUE"
          : "";


          //Very Optional but we need date of birth 

          const deathYearRaw = record["nu_death_year"];
const ageRaw = record["nu_age"];

const deathYear = parseInt(deathYearRaw, 10);
const age = parseInt(ageRaw, 10);

if (
  !isNaN(deathYear) &&
  !isNaN(age) &&
  deathYearRaw !== "" &&
  ageRaw !== "" &&
  deathYearRaw !== null &&
  ageRaw !== null
) {
  const birthYear = deathYear - age;
  mappedRecord["dob"] = `${birthYear}-01-01`;
} else {
  mappedRecord["dob"] = "";
}


        return mappedRecord;
      });

      setMappedData(result);
      setError("");
    } catch (err) {
      setError("Error during mapping process: " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const sanitizeCSVValue = (value) => {
 if (value == null) return "";

  let str = String(value);

  // Remove carriage returns (can keep newlines if needed)
  str = str.replace(/\r/g, "").replace(/\n/g, " ");

  // Escape quotes by doubling them
  str = str.replace(/"/g, '""');

  // Wrap in quotes if value contains comma, quote, or newline
  return /[",]/.test(str) ? `"${str}"` : str;
};


  // Generate CSV content for download with proper column ordering
  const generateCSV = () => {
    if (!mappedData.length || !originalHeaders.length) return "";

    // Create new headers array with ICD-11 columns placed right after their ICD-10 counterparts
    const newHeaders = [...originalHeaders];

    // For each ICD column, add its corresponding ICD-11 columns immediately after it
    icdColumns.forEach((column) => {
      const columnIndex = newHeaders.indexOf(column);
      if (columnIndex !== -1) {
        // Insert the ICD-11 columns right after the original column
        newHeaders.splice(
          columnIndex + 1,
          0,
          `${column}_icd11`,
          `${column}_icd11_title`
        );
      }
    });

     newHeaders.push(
    "codA_underlying",
    "codB_underlying",
    "codC_underlying",
    "codD_underlying"
  );

  if (!newHeaders.includes("dob")) {
  newHeaders.push("dob");
}


    // Defining headers to be rename or duplicate
  const headerTransforms = {
    "co_original_identification": "system_id", // copy the value to a new column
    // Add more if needed: "old_header": "new_header"
  };

  Object.values(headerTransforms).forEach((newHeader) => {
    if (!newHeaders.includes(newHeader)) {
      newHeaders.push(newHeader);
    }
  });




    // Generate CSV content with the new column order
    // const csvContent = [
    //   newHeaders.map((header) => `"${header}"`).join(","),
    //   ...mappedData.map((row) => {
    //     return newHeaders
    //       .map((header) => {
    //           const originalHeader = Object.entries(headerTransforms).find(
    //         ([oldKey, newKey]) => newKey === header
    //       )?.[0];

    //       const value = originalHeader ? row[originalHeader] : row[header];
    //         // const value = row[header] || "";
    //         return `"${value}"`;
    //       })
    //       .join(",");
    //   }),
    // ].join("\n");

    const csvContent = [
  newHeaders.map(sanitizeCSVValue).join(","),
  ...mappedData.map((row) => {
    return newHeaders.map((header) => {
      // Handle transformed headers if needed
      const originalHeader = Object.entries(headerTransforms).find(
        ([oldKey, newKey]) => newKey === header
      )?.[0];

      const value = originalHeader ? row[originalHeader] : row[header];
      return sanitizeCSVValue(value);
    }).join(",");
  }),
].join("\n");

    return csvContent;
  };

  const downloadFile = () => {
    try {
      const publicUrl = 'Replace with the actual public URL of the file';

      // Create download link
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = 'filename.txt';
      link.target = '_blank';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);   
    } catch (error) {     
      alert('Download failed. Please try again.');
    }
  };

  // Download mapped data as CSV
  const downloadCSV = () => {
    if (!mappedData.length) {
      setError("No mapped data to download");
      return;
    }

    const csvContent = generateCSV();
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "mapped_icd_codes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h1 className="header-style">
        ICD-10 to ICD-11 Code Mapper
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

    {/* STEP 1 */}
    <div className="div-container">
      <div className="column-container">
        <div className="border p-4 rounded-md flex-container">
        <div className="steps-div">
            <p className ="steps-style">Step 1</p>
        </div>
        <div className="upload-div">
         <h4 className="upload-styles"> Upload Mapping File (TXT)</h4>

         <div className="file-container">
               {/* Drag and Drop Zone */}
               <div
                 onDrop={handleMappingFileUpload}
                 onDragOver={handleMappingFileUpload}
                 className="drag-and-drop-files"
               >
                 <img src = "/upload.jpg" alt="upload icon"/>
                 <h4 className = "drag-name">Drag and drop files here</h4>
               </div>

               <p className="or">or</p>

        <label className="choose-files">
           Choose file
           <input
             type="file"
             accept=".txt"
             onChange={handleMappingFileUpload}
             hidden
           />
         </label>
          </div>
          {mappingFile && (
                      <p className="mt-2 text-sm text-gray-600">
                        File: {mappingFile.name} ({mappingData.length} mappings loaded)
                      </p>
                    )}
          </div>
        </div>

         {/* STEP 2*/}
        <div className="border p-4 rounded-md flex-container">
        <div className="steps-div">
             <p className ="steps-style">Step 2 </p>
        </div>
         <div className="upload-div">
          <h4 className="upload-styles">Upload Import File (CSV) </h4>

            <div className="file-container">
                         {/* Drag and Drop Zone */}
                         <div
                           onDrop={handleMappingFileUpload}
                           onDragOver={handleMappingFileUpload}
                           className="drag-and-drop-files"
                         >
                           <img src = "/upload.jpg" alt="upload icon"/>
                           <h4 className = "drag-name">Drag and drop files here</h4>
                         </div>

                         <p className="or">or</p>

           <label className="choose-files">
            Choose file
          <input
            type="file"
            accept=".csv"
            onChange={handleImportFileUpload}
            hidden
          />
           </label>
        </div>
        {importFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      File: {importFile.name} ({importData.length} records loaded)
                    </p>
                  )}
        </div>
        </div>

      </div>

      {/* BUTTON */}
        <div className="mapping-btn-container">
          <button            
            onClick={downloadFile}
            style={{ marginRight: '16px' }}
            className="mapping-btn"
          >
            {"Download Mapping File Template"}
          </button>
          <button
            onClick={processMapping}
            disabled={!mappingData.length || !importData.length || isProcessing}
            className="mapping-btn"
          >
            {isProcessing ? "Processing..." : "Map ICD-10 to ICD-11 Codes"}
          </button>
        </div>
      </div>

      {mappedData.length > 0 && (
        <div className="mt-8">
          <div className="results-div">
            <h2 className="results-styling">
              Results: {mappedData.length} Records Mapped
            </h2>
            <button onClick={downloadCSV} className="btn">
             <img src = "/download.png" alt="download icon"/>
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto table-div">
            <table className="min-w-full divide-y divide-gray-200 ">
                  <thead className="table-header tracking-wider uppercase">
                    <tr>
                      <th className="table-header tracking-wider uppercase">
                        Record ID
                      </th>
                      {icdColumns.map((column, index) => (
                        <React.Fragment key={index}>
                          <th className="table-header tracking-wider uppercase">
                            {column.replace("co_", "")}
                          </th>
                          <th className="table-header uppercase tracking-wider">
                            {column.replace("co_", "")} (ICD-11)
                          </th>
                        </React.Fragment>
                      ))}
                    </tr>
                  </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mappedData.slice(0, 5).map((record, index) => (
                  <tr key={index}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.co_seq_mortality || index + 1}
                    </td>

                    {icdColumns.map((column, colIndex) => (
                      <React.Fragment key={colIndex}>
                        {/* ICD-10 Code */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record[column] || "NIL"}
                        </td>

                        {/* ICD-11 Code */}
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 bg-gray-50">
                          {record[`${column}_icd11`] || "NIL"}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
                {mappedData.length > 5 && (
                  <tr>
                    <td
                      colSpan={1 + icdColumns.length * 2}
                      className="record-display"
                    >
                      Showing 5 of {mappedData.length} records.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    metadata: state.metadata,
    data: state.data,
  };
};

export default connect(mapStateToProps)(ICDCodeMapper);
