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
  // const processMapping = () => {
  //   if (!mappingData.length || !importData.length) {
  //     setError('Please upload both mapping and import files first');
  //     return;
  //   }

  //   setIsProcessing(true);

  //   try {
  //     // Create a lookup map for faster access
  //     const icd10ToIcd11Map = {};
  //     mappingData.forEach(item => {
  //       if (item.icd10Code) {
  //         icd10ToIcd11Map[item.icd10Code] = {
  //           icd11Code: item.icd11Code,
  //           icd10Title: item.icd10Title,
  //           icd11Title: item.icd11Title
  //         };
  //       }
  //     });

  //     // Process each record in the import data
  //     const result = importData.map(record => {
  //       const mappedRecord = { ...record };

  //       // Check and map ICD-10 codes in relevant columns
  //       icdColumns.forEach(column => {
  //         const icd10Code = record[column];

  //         // Handle null/NULL/NUL values
  //         if (!icd10Code || icd10Code === 'NULL' || icd10Code === 'NUL') {
  //           mappedRecord[`${column}_icd11`] = 'NIL';
  //           mappedRecord[`${column}_icd11_title`] = 'NIL';
  //         } else {
  //           const mapping = icd10ToIcd11Map[icd10Code];

  //           if (mapping) {
  //             mappedRecord[`${column}_icd11`] = mapping.icd11Code;
  //             mappedRecord[`${column}_icd11_title`] = mapping.icd11Title;
  //           } else {
  //             mappedRecord[`${column}_icd11`] = 'Not Found';
  //             mappedRecord[`${column}_icd11_title`] = 'Not Found';
  //           }
  //         }
  //       });

  //       return mappedRecord;
  //     });

  //     setMappedData(result);
  //     setError('');
  //   } catch (err) {
  //     setError('Error during mapping process: ' + err.message);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // };

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
              mappedRecord[`${column}_icd11_title`] = mapping.icd11Title;
            } else {
              mappedRecord[`${column}_icd11`] = "Not Found";
              mappedRecord[`${column}_icd11_title`] = "Not Found";
            }
          }
        });

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

    // Generate CSV content with the new column order
    const csvContent = [
      newHeaders.map((header) => `"${header}"`).join(","),
      ...mappedData.map((row) => {
        return newHeaders
          .map((header) => {
            const value = row[header] || "";
            return `"${value}"`;
          })
          .join(",");
      }),
    ].join("\n");

    return csvContent;
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
      <h1 className="text-2xl font-bold mb-6 text-center pt-4">
        ICD-10 to ICD-11 Code Mapper
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 div-container">
        <div className="border p-4 rounded-md upload-mapping-div">
          <h4 className="text-lg font-semibold mb-2">
            Step 1: Upload Mapping File (TXT)
          </h4>
          <input
            type="file"
            accept=".txt"
            onChange={handleMappingFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {mappingFile && (
            <p className="mt-2 text-sm text-gray-600">
              File: {mappingFile.name} ({mappingData.length} mappings loaded)
            </p>
          )}
        </div>

        <div className="border p-4 rounded-md upload-mapping-div">
          <h4 className="text-lg font-semibold mb-2">
            Step 2: Upload Import File (CSV)
          </h4>
          <input
            type="file"
            accept=".csv"
            onChange={handleImportFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {importFile && (
            <p className="mt-2 text-sm text-gray-600">
              File: {importFile.name} ({importData.length} records loaded)
            </p>
          )}
        </div>
        <div className="flex justify-center mb-8 btn-container">
          <button
            onClick={processMapping}
            disabled={!mappingData.length || !importData.length || isProcessing}
            className="icd-mapping-btn btn"
          >
            {isProcessing ? "Processing..." : "Map ICD-10 to ICD-11 Codes"}
          </button>
        </div>
      </div>

      {mappedData.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              Results: {mappedData.length} Records Mapped
            </h2>
            <button onClick={downloadCSV} className="btn">
              Download CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Record ID
                  </th>
                  {icdColumns.map((column, index) => (
                    <React.Fragment key={index}>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {column.replace("co_", "")}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-100">
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
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      Showing 5 of {mappedData.length} records. Download CSV for
                      complete data.
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
