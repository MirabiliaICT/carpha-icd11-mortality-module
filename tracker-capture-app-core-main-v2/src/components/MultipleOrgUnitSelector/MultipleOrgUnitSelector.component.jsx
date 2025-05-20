import React, { useState, useEffect } from "react";
import { CustomDataProvider, Provider, SwitchableProvider } from "@dhis2/app-runtime";
import { OrganisationUnitTree } from "@dhis2/ui";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import useApi from "../../hooks/useApi";

const MultipleOrgUnitSelector = ({
  selectedOrgUnits,
  handleSelectOrgUnits,
  filter
}) => {
  const { metadataApi } = useApi();
  const [orgUnitData, setOrgUnitData] = useState(null);
  const [selectedOU, setSelectedOU] = useState(selectedOrgUnits);

  const handleClose = () => {
    handleSelectOrgUnits(selectedOU);
  };

  useEffect(() => {
    metadataApi.getOrgUnitSelectorData(filter).then((json) => {
      setOrgUnitData(json);
    });
  }, []);

  return orgUnitData ? (
    // <CustomDataProvider data={orgUnitData.tree}>
    <Provider config={{ apiVersion: "", baseUrl: process.env.REACT_APP_BASE_URL }}>
      <OrganisationUnitTree
        initiallyExpanded={
          selectedOrgUnits ? selectedOrgUnits : orgUnitData.roots
        }
        roots={orgUnitData.roots}
        selected={selectedOrgUnits ? selectedOrgUnits : []}
        onChange={(selected) => {
          handleSelectOrgUnits(selected);
        }}
      />
    </Provider>
    // </CustomDataProvider>
  ) : (
    <LoadingMask />
  );
};

export default MultipleOrgUnitSelector;
