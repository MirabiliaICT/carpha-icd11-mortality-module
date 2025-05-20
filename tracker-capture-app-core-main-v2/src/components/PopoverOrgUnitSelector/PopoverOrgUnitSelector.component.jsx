import React, { useState, useEffect } from "react";
import "./PopoverOrgUnitSelector.styles.css";
import propTypes from "./PopoverOrgUnitSelector.types";
import { Button, Popover } from "@material-ui/core";
import { CustomDataProvider } from "@dhis2/app-runtime";
import { OrganisationUnitTree } from "@dhis2/ui";
import {
  Fade,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText
} from "@material-ui/core";
import useApi from "../../hooks/useApi";

const PopoverOrgUnitSelector = ({
  label,
  handleSelectOrgUnit,
  selectedOrgUnit,
  onChange,
  filter,
  uiLocale
}) => {
  const { metadataApi } = useApi();
  const [anchorEl, setAnchorEl] = useState(null);
  const [orgUnitData, setOrgUnitData] = useState(null);
  const [selectedOU, setSelectedOU] = useState(selectedOrgUnit);
  const handleClose = () => {
    setAnchorEl(null);
    handleSelectOrgUnit(selectedOU);
  };

  useEffect(() => {
    metadataApi.getOrgUnitSelectorData(filter).then((json) => {
      setOrgUnitData(json);
    });
  }, []);

  return (
    <div className="popover-ou-selector-container">
      <Button
        variant="outlined"
        color="primary"
        onClick={(event) => {
          setAnchorEl(event.target);
        }}
      >
        {selectedOrgUnit ? selectedOrgUnit.displayName : label}
      </Button>
      <Dialog
        maxWidth={"lg"}
        TransitionComponent={Fade}
        scroll={"paper"}
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <DialogTitle>{uiLocale.selectOrganisationUnit}</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText>
            <div className="ou-selector-container">
              {orgUnitData && (
                <CustomDataProvider data={orgUnitData.tree}>
                  <OrganisationUnitTree
                    // initiallyExpanded={
                    //   selectedOU ? [selectedOU.path] : orgUnitData.roots
                    // }
                    roots={orgUnitData.roots}
                    selected={selectedOU ? [selectedOU.path] : []}
                    onChange={(selected) => {
                      setSelectedOU(selected);
                    }}
                  />
                </CustomDataProvider>
              )}
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {uiLocale.hide}
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              onChange(selectedOU);
              handleClose();
            }}
            color="primary"
          >
            {uiLocale.update}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

PopoverOrgUnitSelector.propTypes = propTypes;
export default PopoverOrgUnitSelector;
