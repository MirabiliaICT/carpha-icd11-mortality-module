import React, { FC } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Select from "react-select";
//interface
import { IPropTypes, IProgramStatus } from "./WorkingList.types";
import _ from "lodash";
import "./WorkingList.styles.css";
const programStatusOptions: Array<IProgramStatus> = [
  { programStatus: "NORMAL", position: 1, icon: "list-ul", show: true },
  { programStatus: "ACTIVE", position: 2, icon: "check", show: true },
  { programStatus: "COMPLETED", position: 3, icon: "times", show: true }
];
const preWorkingListOptions = [
  { value: "", label: "Unknown" },
  { value: "ocean", label: "Ocean" },
  { value: "blue", label: "Blue" },
  { value: "purple", label: "Purple" },
  { value: "red", label: "Red" },
  { value: "orange", label: "Orange" },
  { value: "yellow", label: "Yellow" },
  { value: "green", label: "Green" },
  { value: "forest", label: "Forest" },
  { value: "slate", label: "Slate" },
  { value: "silver", label: "Silver" }
];
const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  root: {
    height: "39px"
  },
  btnButtonGroup: {
    display: "block"
  },
  preWorkingList: { minWidth: "269px", paddingLeft: "10px" },
  workingList: {
    minWidth: "167px",
    paddingLeft: "10px"
  }
}));
const colourStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: "white"
  }),
  option: (styles: any) => {
    return {
      ...styles
    };
  }
};
const defaultProps = {
  bgcolor: "background.paper",
  m: 1
};

const WorkingList: FC<IPropTypes> = ({ data }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <h1>{data.title}</h1>
      <Grid container direction="row" justify="flex-start" alignItems="center">
        <Grid item>
          <Box borderColor="text.primary" {...defaultProps}>
            <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btnButtonGroup}>
              {_.chain(programStatusOptions)
                .filter({ show: true })
                .map((ite: IProgramStatus, position: number) => {
                  const { icon, programStatus } = ite;
                  return (
                    <Button color="danger">Danger!</Button>
                    <Button
                      variant={"outlined"}
                      key={position}
                      onClick={() => {
                        console.log("programStatus:", programStatus);
                      }}
                    >
                      <FontAwesomeIcon icon={icon} style={{ fontSize: 30 }} />
                    </Button>
                  );
                })
                .value()}
            </ButtonGroup>
          </Box>
        </Grid>
        <Grid className={classes.preWorkingList}>
          <Box borderColor="text.primary" {...defaultProps}>
            <ButtonGroup color="primary" aria-label="outlined primary button group" className={classes.btnButtonGroup}>
              <Select
                placeholder="Select PreWorkinglist..."
                name="color"
                options={preWorkingListOptions}
                styles={colourStyles}
                onChange={(option) => {
                  console.log("option:", option);
                }}
              />
            </ButtonGroup>
          </Box>
        </Grid>
        {/* <Grid className={classes.workingList}>
          
        </Grid> */}
      </Grid>
    </div>
  );
};

export default WorkingList;
