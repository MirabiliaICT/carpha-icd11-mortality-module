import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";
import "./index.css";
import { Hooks } from "tracker-capture-app-core";

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
 {/* const handleMappingFileUpload = (event) => {
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
*/}

const handleMappingFileUpload = (eventOrFiles) => {
  let file;

  // Check if argument is an event (from <input>) or FileList (from drag-drop)
  if (eventOrFiles && eventOrFiles.target && eventOrFiles.target.files) {
    // From input event
    file = eventOrFiles.target.files[0];
  } else if (eventOrFiles && eventOrFiles.length) {
    // From drag and drop FileList or array
    file = eventOrFiles[0];
  }

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
          icd10Code: columns[2],   // icd10Code column
          icd11Code: columns[9],   // icd11Code column
          icd10Title: columns[4],  // icd10Title column
          icd11Title: columns[11], // icd11Title column
          icd11Chapter: columns[10],   // icd11Code column
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

  const handleImportFileUpload = (eventOrFiles) => {
    let file;

    if (eventOrFiles && eventOrFiles.target && eventOrFiles.target.files) {
      // Called from <input type="file" onChange=...>
      file = eventOrFiles.target.files[0];
    } else if (eventOrFiles && eventOrFiles.length) {
      // Called from drag-and-drop, eventOrFiles is FileList or array
      file = eventOrFiles[0];
    }

    if (!file) return;

    setImportFile(file);

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split("\n").filter((line) => line.trim());

        // Parse CSV header (assuming parseCSVLine is your CSV parsing helper)
        const header = parseCSVLine(lines[0]);
        setOriginalHeaders(header);

        // Parse data rows
        const data = lines.slice(1).map((line) => {
          const values = parseCSVLine(line);
          const record = {};
          header.forEach((col, idx) => {
            record[col] = values[idx] || "";
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

 {/* const handleImportFileUpload = (event) => {
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
  };*/}

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
            icd11Chapter: item.icd11Chapter,
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
          if (!icd10Code || icd10Code === "NULL" || icd10Code === "NUL" || icd10Code === "NIL") {
            mappedRecord[`${column}_icd11`] = "";
            mappedRecord[`${column}_icd11_title`] = "";
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
              mappedRecord[`${column}_icd11_chapter`] = mapping.icd11Chapter ? mapping.icd11Chapter.replace(/,/g, '.') : ''; ;

            } else {
              mappedRecord[`${column}_icd11`] = "Not Found";
              mappedRecord[`${column}_icd11_title`] = "Not Found";
              mappedRecord[`${column}_icd11_chapter`] = "Not Found";
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
          `${column}_icd11_chapter`
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
      const publicUrl = '\ICD10to11conversionTable.txt';

      // Create download link
      const link = document.createElement('a');
      link.href = publicUrl;
      link.download = 'ICD10to11conversionTable.txt';
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


  function NativeDragDrop({ handleMappingFileUpload }) {
  function handleDrop(event) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    // Filter files to only accept .txt files
    const txtFiles = Array.from(files).filter(
      (file) => file.type === "text/plain" || file.name.endsWith(".txt")
    );

    if (txtFiles.length === 0) {
      alert("Only .txt files are allowed");
      return;
    }
    handleMappingFileUpload(txtFiles);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

    return (
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        type="file"
        accept=".txt"
        className="drag-and-drop-files"
      >
        <img src="/upload.jpg" alt="upload icon" />
        <h4 className="drag-name">Drag and drop files here</h4>
      </div>
    );
  }

    function NewNativeDragDrop({ handleImportFileUpload }) {
     function handleDrop(event) {
       event.preventDefault();
       const files = event.dataTransfer.files;

       // Filter files to only accept .csv files
       const csvFiles = Array.from(files).filter(
         (file) => file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv")
       );

       if (csvFiles.length === 0) {
         alert("Only .csv files are allowed");
         return;
       }
       handleImportFileUpload(csvFiles);
     }

     function handleDragOver(event) {
       event.preventDefault();
     }


      return (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          type="file"
          accept=".csv"
          className="drag-and-drop-files"
        >
          <img src="/upload.jpg" alt="upload icon" />
          <h4 className="drag-name">Drag and drop files here</h4>
        </div>
      );
    }



  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md overall-container">
      <h1 className="header-style">
        ICD-10 to ICD-11 Code Mapper
      </h1>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p>{error}</p>
        </div>
      )}

    {/* STEP CARDS ROW */}
    <div className="icd-mapper-row">
      {/* Step 1 */}
      <div className="icd-mapper-col">
        <div className="step-label-outside">Step 1</div>
        <div className="rounded-md flex-container">
          <div className="upload-div">
            <h4 className="upload-styles">Upload Mapping File (TXT)</h4>
            <div className="instruction-block">
              <div className="instruction-a">
                <span>(a) Download ICD-10 to 11 Conversion Table. </span>
                <span
                  className="download-template-link"
                  onClick={downloadFile}
                  style={{ color: '#12588C', cursor: 'pointer', textDecoration: 'underline', marginLeft: 8 }}
                >
                  Click to Download
                </span>
              </div>
              <div className="instruction-b">(b) Upload mapping file. (.txt file)</div>
            </div>
            <div className="flex-spacer" />
            <div className="file-container">
              <NativeDragDrop handleMappingFileUpload={handleMappingFileUpload} />
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
              <p className="file-name">
                File: {mappingFile.name} ({mappingData.length} mappings loaded)
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Step 2 */}
      <div className="icd-mapper-col">
        <div className="step-label-outside">Step 2</div>
        <div className="rounded-md flex-container">
          <div className="upload-div">
            <h4 className="upload-styles">Upload Import File (CSV)</h4>
            <div className="instruction-block">
              <div className="instruction-csv">Files must be in CSV format</div>
            </div>
            <div className="flex-spacer" />
            <div className="file-container">
              <NewNativeDragDrop handleImportFileUpload={handleImportFileUpload} />
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
              <p className="file-name">
                File: {importFile.name} ({importData.length} records loaded)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

      {/* BUTTON */}
        <div className="mapping-btn-container">
          <button
            onClick={processMapping}
            disabled={!mappingData.length || !importData.length || isProcessing}
            className="mapping-btn"
          >
            {isProcessing ? "Processing..." : "Map ICD-10 to ICD-11 Codes"}
          </button>
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

          <div className="table-div">
            <table className="main-table">
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
                    <td className="table-border">
                      {record.co_seq_mortality || index + 1}
                    </td>

                    {icdColumns.map((column, colIndex) => (
                      <React.Fragment key={colIndex}>
                        {/* ICD-10 Code */}
                        <td className="table-border">
                          {record[column] || ""}
                        </td>

                        {/* ICD-11 Code */}
                        <td className="table-border">
                          {record[`${column}_icd11`] || ""}
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                ))}
                 </tbody>
               </table>
                </div>

                {mappedData.length > 5 && (
                  <div
                      colSpan={1 + icdColumns.length * 2}
                      className="record-display"
                    >
                      Showing 5 of {mappedData.length} records.
                  </div>
                )}
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
