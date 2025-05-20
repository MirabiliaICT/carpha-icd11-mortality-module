import React, { FC, useState, useEffect } from "react";
import {
  FormGroup,
  FormLabel,
  TextField,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import MUIDataTable, { MUIDataTableOptions } from "mui-datatables";
import "./TrackedEntityInstancesList.style.css";
import { withStyles } from "@material-ui/core/styles";
import { CircularProgress } from "@material-ui/core";
import moment from "moment";

const StyledTable = withStyles((style) => ({
  fixedHeaderCommon: {
    zIndex: 0,
  },
  paper: {
    height: "100%",
  },
  responsiveScrollMaxHeight: {
    maxHeight: "none !important",
    height: "calc(100% - 117px)",
  },
}))(MUIDataTable);

const TrackedEntityInstancesList = (props) => {
  const [tableData, setTableData] = useState([]);
  const [tableColumn, setTableColumn] = useState([]);
  const [tableOption, setTableOption] = useState({});
  const [serverSideFilterList, setServerSideFilterList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [order, setOrder] = useState("");
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    loadInitialData();
  }, [props.teis]);

  const loadInitialData = () => {
    generateTableColumn();
  };

  const findHeaderIndex = (headers, name) => {
    const found = headers.findIndex((header) => header.name === name);
    return found;
  };

  const generateTableColumn = () => {
    let find = props.trackedEntityAttributes.filter(
      (e) => e.displayInList === true
    );
    let temp = [];
    if (props.buttons !== undefined && props.buttons.length > 0) {
      let buttonObject = {
        label: props.actionHeaderColumnName
          ? props.actionHeaderColumnName
          : "Action",
        name: "action",
        options: {
          filter: false,
          sort: false,
          viewColumns: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            return (
              <div>
                {props.buttons.map((button) => {
                  if (button.label !== "") {
                    return (
                      <Button
                        variant="contained"
                        color={button.color}
                        startIcon={button.icon}
                        size="small"
                        className={button.className ? button.className : {}}
                        onClick={() => {
                          let teiUID =
                            props.teis.rows[tableMeta.rowIndex][
                              findHeaderIndex(props.teis.headers, "instance")
                            ];
                          button.action(teiUID);
                        }}
                      >
                        {button.label}
                      </Button>
                    );
                  } else {
                    return (
                      <Tooltip title={button.tooltipLabel} placement="bottom">
                        <IconButton
                          color={button.color}
                          className={button.className ? button.className : {}}
                          onClick={() => {
                            let teiUID =
                              props.teis.rows[tableMeta.rowIndex][
                                findHeaderIndex(props.teis.headers, "instance")
                              ];
                            button.action(teiUID);
                          }}
                        >
                          {button.icon}
                        </IconButton>
                      </Tooltip>
                    );
                  }
                })}
              </div>
            );
          },
        },
      };
      temp.push(buttonObject);
    }
    temp.push({
      label: props.lastUpdatedHeaderColumnName
        ? props.lastUpdatedHeaderColumnName
        : "Last Updated",
      name: "lastupdated",
      options: { filter: false, sort: true },
    });
    find.forEach((tei) => {
      let findIgnoreFilter = props.ignoreFilter.findIndex((e) => e === tei.id);
      let object = {
        label: tei.displayName,
        name: tei.id,
        valueType: tei.valueType,
        optionSet: tei.valueSet ? tei.valueSet : undefined,
        options:
          findIgnoreFilter !== -1
            ? { filter: false, sort: true }
            : generateFilterByValueType(tei.valueType, tei.displayName),
      };
      temp.push(object);
    });
    setTableColumn(temp);
    generateTableData(temp);
  };

  const generateTableData = (column) => {
    let temp = [];
    if (props.teis !== undefined && props.teis.status !== "ERROR") {
      props.teis.rows.forEach((row) => {
        let array = [];
        column.forEach((col) => {
          let result;
          let value = row[findHeaderIndex(props.teis.headers, col.name)];
          if (col.name === "lastupdated") {
            value = moment(value).format("YYYY-MM-DD");
          }
          if (col.optionSet) {
            col.optionSet.forEach((option) => {
              if (option.value === value) {
                result = option.label;
              }
            });
          } else {
            if (col.valueType === "BOOLEAN") {
              result = value === "true" ? "Yes" : value === "false" ? "No" : "";
            } else {
              result = value;
            }
          }
          array.push(result);
        });
        temp.push(array);
      });
    }
    setTableData([...temp]);
    generateTableOption();
    props.setLoading(false);
  };

  const handleChangeFilter = (filterList) => {
    let getAllColumn = props.trackedEntityAttributes.filter(
      (e) => e.displayInList === true
    );
    let filterString = "";
    getAllColumn.forEach((tei, index) => {
      if (props.buttons !== undefined && props.buttons.length > 0) {
        index = index + 2;
      } else {
        index = index + 1;
      }
      if (tei.valueType === "NUMBER") {
        if (filterList[index].length > 1) {
          let fromNumber =
            filterList[index][0] === "" || filterList[index][0] === undefined
              ? 0
              : filterList[index][0];
          let toNumber =
            filterList[index][1] === "" || filterList[index][1] === undefined
              ? 0
              : filterList[index][1];
          filterString += `&attribute=${tei.id}:GE:${
            fromNumber <= toNumber ? toNumber : fromNumber
          }:LE:${fromNumber <= toNumber ? fromNumber : toNumber}`;
        } else {
          if (filterList[index][0]) {
            filterString += `&attribute=${tei.id}:GE:${filterList[index][0]}`;
          }
        }
      } else {
        if (filterList[index][0]) {
          filterString += `&attribute=${tei.id}:LIKE:${filterList[index][0]}`;
        }
      }
    });
    setFilterString(filterString);
    props.onFilter(filterString, order);
  };

  const generateTableOption = () => {
    setTableOption({
      textLabels: {
        body: {
          noMatch: props.noMatchFilter ? props.noMatchFilter : "No recorded",
          toolTip: "Sort",
          columnHeaderTooltip: (column) =>
            `${props.sortFor ? props.sortFor : "Sort for"} ${column.label}`,
        },
        pagination: {
          rowsPerPage: props.rowsPerPage ? props.rowsPerPage : "Rows per page:",
        },
        toolbar: {
          viewColumns: props.viewColumns ? props.viewColumns : "View Columns",
          filterTable: props.filterTable ? props.filterTable : "Filter Table",
          downloadCsv: props.downloadCsv ? props.downloadCsv : "Download CSV",
        },
        filter: {
          title: props.titleFilter ? props.titleFilter : "FILTERS",
          reset: props.resetFilter ? props.resetFilter : "RESET",
        },
        viewColumns: {
          title: props.titleShowColumn ? props.titleShowColumn : "Show Columns",
        },
      },
      filterType: "textField",
      selectableRows: "none",
      selectableRowsOnClick: false,
      serverSide: true,
      downloadOptions: { 
        filename: 'eventTable.csv'
      },
      print: false,
      download: true,
      search: false,
      filter: true,
      sort: true,
      tableBodyHeight: "calc(100% - 117px)",
      count:
        props.teis !== undefined && props.teis.status !== "ERROR"
          ? props.teis.metaData.pager.total
          : 1, //set total row in table.
      page:
        props.teis !== undefined && props.teis.status !== "ERROR"
          ? props.teis.metaData.pager.page - 1
          : 0, //set the page will show on table.
      onCellClick: onRowClick,
      onChangeRowsPerPage: (numberOfRows) => {
        props.onChangeRowPerPage(numberOfRows, filterString, order);
      },
      onChangePage: (currentPage) => {
        props.onChangePage(currentPage, filterString, order);
      },
      onDownload: (buildHead, buildBody, columns, data) => {
        props.onDownloadClick(columns);
        return false
      }, 
      serverSideFilterList: serverSideFilterList,
      onTableChange: (action, tableState) => {
        if (action === "sort") {
          let orderString = `order=${tableState.sortOrder.name}:${tableState.sortOrder.direction}`;
          setOrder(orderString);
          props.onSort(
            props.teis !== undefined && props.teis.status !== "ERROR"
              ? props.teis.metaData.pager.pageSize
              : 1,
            props.teis !== undefined && props.teis.status !== "ERROR"
              ? props.teis.metaData.pager.page - 1
              : 0,
            filterString,
            orderString
          );
        }
      },
      customSearch: (searchQuery, currentRow) => {
        let result = false;
        currentRow.forEach((row) => {
          if (row !== undefined) {
            if (
              removeAccents(row)
                .toLowerCase()
                .includes(removeAccents(searchQuery).toLowerCase()) === true
            ) {
              result = true;
            }
          }
        });
        return result;
      },
      customFilterDialogFooter: (filterList) => {
        return (
          <div style={{ marginTop: "40px" }}>
            <Button
              variant="contained"
              onClick={() => {
                handleChangeFilter(filterList);
              }}
            >
              {props.applyFilter ? props.applyFilter : "Apply Filter"}
            </Button>
          </div>
        );
      },
    });
  };

  const generateFilterByValueType = (type, name) => {
    let value;
    switch (type) {
      case "NUMBER":
        value = {
          sort: true,
          filter: true,
          filterType: "custom",
          filterOptions: {
            logic(age, filters) {
              if (filters[0] && filters[1]) {
                return age < filters[0] || age > filters[1];
              } else if (filters[0]) {
                return age < filters[0];
              } else if (filters[1]) {
                return age > filters[1];
              }
              return false;
            },
            display: (filterList, onChange, index, column) => (
              <div>
                <FormLabel>{name}</FormLabel>
                <FormGroup row>
                  <TextField
                    label="min"
                    value={filterList[index][0] || ""}
                    onChange={(event) => {
                      filterList[index][0] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: "45%", marginRight: "5%" }}
                  />
                  <TextField
                    label="max"
                    value={filterList[index][1] || ""}
                    onChange={(event) => {
                      filterList[index][1] = event.target.value;
                      onChange(filterList[index], index, column);
                    }}
                    style={{ width: "45%" }}
                  />
                </FormGroup>
              </div>
            ),
          },
        };
        break;
      default:
        value = { filter: true, sort: true };
    }
    return value;
  };

  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  const onRowClick = (rowData, rowMeta) => {
    if (props.buttons && props.buttons.length > 0 && rowMeta.colIndex === 0) {
    } else {
      let object = {
        teiUID:
          props.teis.rows[rowMeta.dataIndex][
            findHeaderIndex(props.teis.headers, "instance")
          ],
        data: rowData,
      };
      props.onRowClick(object);
    }
  };

  const loadingComponent = (
    <div
      style={{
        position: "absolute",
        zIndex: 110,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "rgba(255,255,255,0.8)",
      }}
    >
      <CircularProgress size={60} />
    </div>
  );

  return (
    <div
      style={{ position: "relative" }}
      className="Tracked-Entity-Instance-List-Body"
    >
      {props.loading && loadingComponent}
      <StyledTable
        title={props.title}
        data={tableData}
        columns={tableColumn}
        options={tableOption}
      />
    </div>
  );
};

export default TrackedEntityInstancesList;
