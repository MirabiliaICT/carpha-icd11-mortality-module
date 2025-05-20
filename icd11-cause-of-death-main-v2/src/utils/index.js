import moment from "moment";
import InputField from "../components/InputField";
import { Select, Input, DatePicker } from "antd";
import i18n from "i18next";
const { Option } = Select;
const { Search } = Input;

const sample = (d, fn = Math.random) => {
  if (d.length === 0) {
    return;
  }
  return d[Math.round(fn() * (d.length - 1))];
};

export const generateCode = (limit = 11, fn = Math.random) => {
  const allowedLetters = ["abcdefghijklmnopqrstuvwxyz", "ABCDEFGHIJKLMNOPQRSTUVWXYZ"].join("");
  const allowedChars = ["0123456789", allowedLetters].join("");
  const arr = [sample(allowedLetters, fn)]; // sample 1 to make sure it starts with a letter
  for (let i = 0; i < limit - 1; i++) {
    arr.push(sample(allowedChars, fn));
  }
  return arr.join("");
};

export const convertValue = (valueType, value) => {
  switch (valueType) {
    case "TEXT":
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
    case "EMAIL":
    case "LONG_TEXT":
      return value;
    case "DATE":
      return moment(value).format("YYYY-MM-DD");
    case "DATETIME":
      return moment(value);
    case "TIME":
      return moment(value);
    case "BOOLEAN":
      return value;
    case "TRUE_ONLY":
      return value;
    case "AGE":
      return moment(value);
    default:
      return <span>UNSUPPORTED VALUE TYPE</span>;
  }
};

export const convertValueBack = (valueType, value) => {
  switch (valueType) {
    case "TEXT":
    case "INTEGER_POSITIVE":
    case "INTEGER_NEGATIVE":
    case "INTEGER_ZERO_OR_POSITIVE":
    case "PERCENTAGE":
    case "NUMBER":
    case "INTEGER":
    case "PHONE_NUMBER":
    case "EMAIL":
    case "LONG_TEXT":
      return value;
    case "DATE":
      return moment(value).format("YYYY-MM-DD");
    case "DATETIME":
      return moment(value);
    case "TIME":
      return moment(value);
    case "BOOLEAN":
      return value + "";
    case "TRUE_ONLY":
      return value ? value + "" : "";
    case "AGE":
      return moment(value).format("YYYY-MM-DD");
    default:
      return <span>UNSUPPORTED VALUE TYPE</span>;
  }
};

// export const generateBulkDhis2Payload = (data, programMetadata) => {
//   console.log("Data:", data, "Program Metadata:", programMetadata);

//   // Ensure data is an array
//   if (!Array.isArray(data)) {
//     throw new Error("Expected data to be an array.");
//   }

//   // Process each row individually
//   const payloads = data.map((row) => {
//     const newData = JSON.parse(JSON.stringify(row));

//     console.log("newDatanewData", newData);

//     // Ensure the row has the expected structure
//     if (!newData.currentTei || !newData.currentEnrollment || !newData.currentEvents) {
//       throw new Error("Row data is missing required fields: currentTei, currentEnrollment, or currentEvents.");
//     }

//     let { currentTei, currentEnrollment, currentEvents } = newData;

//     // Process currentTei
//     currentTei.attributes = Object.keys(currentTei.attributes)
//       .filter((attribute) =>
//         programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute)
//       )
//       .map((attribute) => {
//         const attributeMetadata = programMetadata.trackedEntityAttributes.find(
//           (attr) => attr.id === attribute
//         );
//         return {
//           attribute,
//           value: convertValueBack(attributeMetadata.valueType, currentTei.attributes[attribute]),
//         };
//       });

//     // Process currentEnrollment
//     currentEnrollment.enrollmentDate = moment(currentEnrollment.enrollmentDate).format("YYYY-MM-DD");
//     currentEnrollment.incidentDate = moment(currentEnrollment.incidentDate).format("YYYY-MM-DD");

//     // Process currentEvents
//     currentEvents = currentEvents.map((event) => {
//       const programStage = programMetadata.programStages.find(
//         (ps) => ps.id === event.programStage
//       );
//       event.dataValues = Object.keys(event.dataValues).map((dataElement) => {
//         const dataElementMetadata = programStage.dataElements.find(
//           (de) => de.id === dataElement
//         );
//         return {
//           dataElement,
//           value: convertValueBack(dataElementMetadata.valueType, event.dataValues[dataElement]),
//         };
//       });
//       event.eventDate = moment(event.eventDate).format("YYYY-MM-DD");
//       event.dueDate = moment(event.dueDate).format("YYYY-MM-DD");

//       console.log("Event:", event);
//       return event;
//     });

//     console.log("currentTei:", currentTei);
//     console.log("currentEnrollment:", currentEnrollment);
//     console.log("currentEvents:", currentEvents);

//     return { currentTei, currentEnrollment, currentEvents };
//   });

//   return payloads;
// };

export const generateDhis2Payload = (data, programMetadata) => {
  const newData = JSON.parse(JSON.stringify(data));
  let { currentTei, currentEnrollment, currentEvents } = newData;
  currentTei.attributes = Object.keys(currentTei.attributes)
    .filter(attribute => programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute) )
    .map((attribute) => {
    const attributeMetadata = programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute);
    return {
      attribute,
      value: convertValueBack(attributeMetadata.valueType, currentTei.attributes[attribute])
    };
  });
  currentEnrollment.enrollmentDate = moment(currentEnrollment.enrollmentDate).format("YYYY-MM-DD");
  currentEnrollment.incidentDate = moment(currentEnrollment.incidentDate).format("YYYY-MM-DD");

  currentEvents = currentEvents.map((event) => {
    const programStage = programMetadata.programStages.find((ps) => ps.id === event.programStage);
    event.dataValues = Object.keys(event.dataValues).map((dataElement) => {
      const dataElementMetadata = programStage.dataElements.find((de) => de.id === dataElement);
      return {
        dataElement,
        value: convertValueBack(dataElementMetadata.valueType, event.dataValues[dataElement])
      };
    });
    event.eventDate = moment(event.eventDate).format("YYYY-MM-DD");
    event.dueDate = moment(event.dueDate).format("YYYY-MM-DD");
    return event;
  });

  return { currentTei, currentEnrollment, currentEvents };
};



export const generateDhis2Payloadx = (data, programMetadata ) => {

  console.log(data + "-------------------" )
  const newData = JSON.parse(JSON.stringify(data));

  console.log("newDatanewData" + newData);
  let { trackedEntityInstance, enrollment, events} = newData;

    console.log(events + "--newDatanewData" + newData);

  //   trackedEntityInstance.attributes = Object.keys(trackedEntityInstance.attributes)
  //   .filter(attribute => programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute) )
  //   .map((attribute) => {
  //   const attributeMetadata = programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute);
  //   return {
  //     attribute,
  //     value: convertValueBack(attributeMetadata.valueType, trackedEntityInstance.attributes[attribute])
  //   };
  // });

  trackedEntityInstance.attributes = trackedEntityInstance.attributes 
  ? Object.keys(trackedEntityInstance.attributes)
      .filter(attribute => programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute))
      .map((attribute) => {
        const attributeMetadata = programMetadata.trackedEntityAttributes.find((attr) => attr.id === attribute);
        return {
          attribute,
          value: convertValueBack(attributeMetadata?.valueType, trackedEntityInstance.attributes[attribute])
        };
      })
  : []; // Fallback to an empty array if attributes are undefined

  console.log("newDatanewData------" + newData);


  enrollment.enrollmentDate = moment(enrollment.enrollmentDate).format("YYYY-MM-DD");
  enrollment.incidentDate = moment(enrollment.incidentDate).format("YYYY-MM-DD");

  // events = [events]
  // events = events.map((event) => {
  //   const programStage = programMetadata.programStages.find((ps) => ps.id === event.programStage);
  //   event.dataValues = Object.keys(event.dataValues).map((dataElement) => {
  //     const dataElementMetadata = programStage.dataElements.find((de) => de.id === dataElement);
  //     return {
  //       dataElement,
  //       value: convertValueBack(dataElementMetadata.valueType, event.dataValues[dataElement])
  //     };
  //   });
  //   event.eventDate = moment(event.eventDate).format("YYYY-MM-DD");
  //   event.dueDate = moment(event.dueDate).format("YYYY-MM-DD");

  //   console.log("Eventttttttt" + event);

  //   return event;
  // });

  events = Array.isArray(events) ? events : [events]; // Ensure it's an array

events = events.map((event) => {
  const programStage = programMetadata.programStages.find((ps) => ps.id === event.programStage);

  if (!programStage) {
    console.error("Program stage not found for ID:", event.programStage);
    return event; // Skip processing this event
  }

  if (!programStage.dataElements) {
    console.error("No dataElements found for programStage:", programStage);
    return event; // Skip processing this event
  }

  event.dataValues = Object.keys(event.dataValues).map((dataElement) => {
    const dataElementMetadata = programStage.dataElements.find((de) => de.id === dataElement);

    if (!dataElementMetadata) {
      console.warn("Data element metadata not found for:", dataElement);
      return {
        dataElement,
        value: event.dataValues[dataElement] // Fallback without conversion
      };
    }

    return {
      dataElement,
      value: convertValueBack(dataElementMetadata.valueType, event.dataValues[dataElement])
    };
  });

  event.eventDate = moment(event.eventDate).format("YYYY-MM-DD");
  event.dueDate = moment(event.dueDate).format("YYYY-MM-DD");

  console.log("Processed Event:", event);
  return event;
});




  // event = event.map((eventx) => {
  //   const programStage = programMetadata.programStages.find((ps) => ps.id === eventx.programStage);
    
  //   eventx.dataValues = eventx.dataValues 
  //     ? Object.keys(eventx.dataValues).map((dataElement) => {
  //         const dataElementMetadata = programStage?.dataElements.find((de) => de.id === dataElement);
  //         return {
  //           dataElement,
  //           value: convertValueBack(dataElementMetadata?.valueType, eventx.dataValues[dataElement])
  //         };
  //       })
  //     : []; // Fallback to an empty array
  
  //   eventx.eventDate = moment(eventx.eventDate).isValid() 
  //     ? moment(eventx.eventDate).format("YYYY-MM-DD") 
  //     : ""; 
  
  //   eventx.dueDate = moment(eventx.dueDate).isValid() 
  //     ? moment(eventx.dueDate).format("YYYY-MM-DD") 
  //     : "";
  
  //   return eventx;
  // });
  

  // console.log("currentTei" + trackedEntityInstance);
  // console.log("currentEnrollment" + enrollment);
  // console.log("currentEvents" + event);




  return { trackedEntityInstance, enrollment, events};
};

export const generateTableColumns = (metadata, external) => {
  let render = null;
  if (external) {
    switch (external.type) {
      case "DATE":
        render = (value) => {
          return value ? moment(value).format("YYYY-MM-DD") : "";
        };
        break;
      default:
        render = (value) => {
          return value ? value : "";
        };
        break;
    }
  } else {
    if (metadata.valueSet) {
      render = (value) => {
        let find = metadata.valueSet.find((e) => {
          return e.value === value;
        });
        if (find) {
          value = find.label;
        }
        return value;
      };
    } else {
      switch (metadata.valueType) {
        case "TRUE_ONLY":
        case "BOOLEAN":
          render = (value) => {
            if (value == true || value == "true") {
              value = "Yes";
            }
            if (value == false || value == "false") {
              value = "No";
            }
            return value ? value : "";
          };
          break;
        case "DATE":
          render = (value) => {
            return value ? moment(value).format("YYYY-MM-DD") : "";
          };
          break;
        default:
          render = (value) => {
            return value ? value : "";
          };
          break;
      }
    }
  }
  return render;
};

export const generateTableFilter = (metadata, onFilter, external) => {
  let render = null;
  if (external) {
    switch (external.type) {
      case "DATE":
        render = (
          <div style={{ padding: "20px" }}>
            <DatePicker
              id={external.name}
              style={{ width: 250 }}
              onChange={(value) => {
                onFilter(value ? moment(value).format("YYYY-MM-DD") : value, external.name);
              }}
            />
          </div>
        );
        break;
      default:
        render = (value) => {
          return value ? value : "";
        };
        break;
    }
  } else {
    if (metadata.valueSet) {
      render = (
        <div style={{ padding: "20px" }}>
          <Select
            style={{ width: 250 }}
            allowClear
            showSearch
            placeholder={`${i18n.t("select")}...`}
            onChange={(value) => {
              onFilter(value, metadata.id, "select");
            }}
          >
            {metadata.valueSet.map((option) => {
              return <Option value={option.value}>{option.label}</Option>;
            })}
          </Select>
        </div>
      );
    } else {
      switch (metadata.valueType) {
        case "TRUE_ONLY":
        case "BOOLEAN":
          <div style={{ padding: "20px" }}>
            <Select
              style={{ width: 250 }}
              allowClear
              placeholder={`${i18n.t("select")}...`}
              onChange={(value) => {
                onFilter(value, metadata.id);
              }}
            >
              <Option value="true">Yes</Option>
              <Option value="false">No</Option>
            </Select>
          </div>;

          break;
        case "DATE":
          render = (
            <div style={{ padding: "20px" }}>
              <DatePicker
                id={metadata.id}
                style={{ width: 250 }}
                onChange={(value) => {
                  onFilter(value ? moment(value).format("YYYY-MM-DD") : value, metadata.id);
                }}
              />
            </div>
          );
          break;
        default:
          // render = (<Input style={{ width: 200 }} placeholder="Text Here..." allowClear onChange={onFilter}/>)
          render = (
            <div style={{ padding: "20px" }}>
              <Search
                id={metadata.id}
                placeholder={i18n.t("inputSearchText")}
                allowClear
                onSearch={(value) => {
                  onFilter(value, metadata.id);
                }}
                style={{ width: 250 }}
              />
            </div>
          );
          break;
      }
    }
  }
  return render;
};

export const generateEditableDataValueCells = (metadata, mutateDataValue) => {
  let render = (value, record) => {
    return (
      <InputField
        value={value}
        valueSet={metadata.valueSet ? metadata.valueSet : null}
        // label={metadata.displayFormName}
        valueType={metadata.valueType}
        change={(value) => {
          mutateDataValue(record.eventId, metadata.id, value);
        }}
      />
    );
  };
  return render;
};
export const numberWithCommas = (number) => {
  return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};
