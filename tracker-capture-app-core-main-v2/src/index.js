import TrackedEntityInstancesList from "./components/TrackedEntityInstancesList/TrackedEntityInstancesList.component.jsx";
import LoadingMask from "./components/LoadingMask/LoadingMask.component.jsx";
import HeaderBar from "./components/HeaderBar/HeaderBar.component.jsx";
import InputField from "./components/InputField/InputField.component.jsx";
import CascadeTable from "./components/CascadeTable";
// import WorkingList from "./components/WorkingList/WorkingList.component";
import OrgUnitSelector from "./components/OrgUnitSelector/OrgUnitSelector.component.jsx";
import MultipleOrgUnitSelector from "./components/MultipleOrgUnitSelector/MultipleOrgUnitSelector.component.jsx";
import PopoverOrgUnitSelector from "./components/PopoverOrgUnitSelector/PopoverOrgUnitSelector.component.jsx";
import HierachySelector from "./components/HierachySelector/HierachySelector.component.jsx";
import DashboardWidgets from "./components/DashboardWidgets/index";
// import initApi from "./api";
// const Components = { TrackedEntityInstancesList, LoadingMask, HeaderBar, WorkingList, OrgUnitSelector };
import useApi from "./hooks/useApi";
import useProfile from "./hooks/useProfile";
import useEvent from "./hooks/useEvent";
import useForm from "./hooks/useForm";
import useRuleEngine from "./hooks/useRuleEngine/useRuleEngine";

import Utils from "./utils";
const Components = {
  HeaderBar,
  LoadingMask,
  PopoverOrgUnitSelector,
  InputField,
  TrackedEntityInstancesList,
  CascadeTable,
  HierachySelector,
  OrgUnitSelector,
  MultipleOrgUnitSelector,
  DashboardWidgets
};
const Hooks = { useApi, useProfile, useEvent, useForm, useRuleEngine };

export { Components, Hooks, Utils };
