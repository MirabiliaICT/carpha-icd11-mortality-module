import React, { useState, useEffect } from "react";
import { CustomDataProvider, Provider } from "@dhis2/app-runtime";
import { OrganisationUnitTree } from "@dhis2/ui";
import LoadingMask from "../LoadingMask/LoadingMask.component.jsx";
import useApi from "../../hooks/useApi";

const OrgUnitSelector = ({ selectedOrgUnit, handleSelectOrgUnit, filter }) => {
  const { metadataApi } = useApi();
  const [orgUnitData, setOrgUnitData] = useState(null);
  const [key, setKey] = useState("");

  const cutString = (str, start) =>
    str.includes(start) ? str.substring(str.indexOf(start)) : "";

  useEffect(() => {
    //metadataApi.getOrgUnitSelectorData(filter).then((json) => {
    metadataApi.getOrgUnitSelectorData().then((json) => {
      Object.entries(json.tree).forEach(([key, value]) => {
        const foundRoot = json.roots.find((root) => value.path.includes(root));
        if (foundRoot) {
          value.path = cutString(value.path, `/${foundRoot}`);
        }
      });
      setOrgUnitData(json);
      if (filter.length > 0) {
        const newKey = filter.join("") + new Date().getTime();
        if (key !== newKey) {
          setKey(newKey);
        }
      } else if (key !== "default") {
        setKey("default");
      }
      //setKey(filter.join("") + new Date().getTime());
    });
  }, [filter]);

  const foundSelectedOrgUnit = orgUnitData
    ? orgUnitData.tree[
        `organisationUnits/${
          selectedOrgUnit ? selectedOrgUnit.id : selectedOrgUnit
        }`
      ]
    : "";
  let transformedSelectedOrgUnit = null;
  if (foundSelectedOrgUnit) {
    if (orgUnitData.roots.includes(selectedOrgUnit?.id)) {
      transformedSelectedOrgUnit = ["/" + foundSelectedOrgUnit.id];
    } else {
      transformedSelectedOrgUnit = [foundSelectedOrgUnit.path];
    }
  }

  const returnFilterWithOuRoots = () => {
    if (orgUnitData && filter.length > 0) {
      let newFilter = [];
      filter.forEach((f) => {
        const foundRoot = orgUnitData.roots.find((root) => f.includes(root));
        if (foundRoot) {
          f = cutString(f, `/${foundRoot}`);
          newFilter.push(f);
        }
      });
      return newFilter;
    } else return [];
  };

  const returnOrgUnitTree = () => {
    if (filter.length > 0) {
      return (
        <OrganisationUnitTree
          initiallyExpanded={
            filter && filter.length > 0
              ? returnFilterWithOuRoots()
              : orgUnitData.roots
          }
          highlighted={
            filter && filter.length > 0 ? returnFilterWithOuRoots() : []
          }
          key={key}
          roots={orgUnitData.roots}
          selected={
            transformedSelectedOrgUnit ? transformedSelectedOrgUnit : []
          }
          onChange={(selected) => {
            handleSelectOrgUnit(selected);
          }}
          filter={returnFilterWithOuRoots()}
        />
      );
    } else {
      return (
        <OrganisationUnitTree
          initiallyExpanded={
            transformedSelectedOrgUnit
              ? transformedSelectedOrgUnit
              : orgUnitData.roots
          }
          key={key}
          roots={orgUnitData.roots}
          selected={
            transformedSelectedOrgUnit ? transformedSelectedOrgUnit : []
          }
          onChange={(selected) => {
            handleSelectOrgUnit(selected);
          }}
        />
      );
    }
  };

  return orgUnitData ? (
    <Provider
      config={{ apiVersion: "", baseUrl: process.env.REACT_APP_BASE_URL }}
    >
      {key ? returnOrgUnitTree() : ""}
    </Provider>
  ) : (
    <LoadingMask />
  );
};

export default OrgUnitSelector;
