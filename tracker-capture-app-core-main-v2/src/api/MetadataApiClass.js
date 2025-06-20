import { pull } from "./Fetch";
import BaseApiClass from "./BaseApiClass";
export default class MetadataApiClass extends BaseApiClass {
  getMe() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/me?fields=*,settings,organisationUnits[id,displayName]",
      {
        paging: false
      },
      []
    );
  }

  
  // async getOrgUnitsLevel3() {
  //   return pull(
  //     this.baseUrl,
  //     this.username,
  //     this.password,
  //     "/api/organisationUnits",
  //     {
  //       paging: false
  //     },
  //     ["level=2"]
  //   );
  // }
  

  getPrograms() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/programs",
      {
        paging: false
      },
      []
    );
  }

  async getHeaderBarData() {
    let headerBarData = {};
    const results = await Promise.all([
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/api/me",
        {
          paging: false
        },
        []
      ),
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/api/me/dashboard",
        {
          paging: false
        },
        []
      ),
      pull(
        this.baseUrl,
        this.username,
        this.password,
        "/dhis-web-commons/menu/getModules.action",
        {
          paging: false
        },
        []
      )
    ]);
    headerBarData.me = results[0];
    headerBarData.applicationTitle = "";
    headerBarData.dashboard = results[1];
    headerBarData.modules = results[2].modules.map((module) => {
      if (!module.namespace.includes("/")) {
        module.icon = "../../" + module.icon;
        module.defaultAction = "../../" + module.defaultAction;
      }
      return module;
    });
    return headerBarData;
  }

  async getOrgUnitSelectorData(filter) {
    const orgUnits = await pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnits",
      {
        paging: false
      },
      ["withinUserHierarchy=true", "fields=id,code,displayName,path,children%5Bid,code,displayName,path%5D "]

      // ["withinUserHierarchy=true", "fields=id,code,displayName,path,children[id,code,displayName,path]"]
    );
    const me = await pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/me",
      {
        paging: false
      },
      []
    );
    let data = {};
    data.tree = orgUnits.organisationUnits.reduce((accumulator, currentOu) => {
      // accumulator[`organisationUnits/${currentOu.id}`] = async () => {
      //   const orgUnit = await pull(
      //     this.baseUrl,
      //     this.username,
      //     this.password,
      //     `/api/organisationUnits/${currentOu.id}?fields=id,code,displayName,path,children[id,code,displayName,path]`,
      //     { paging: false },
      //     []
      //   );
      //   orgUnit.children = orgUnit.children.sort(function (a, b) {
      //     var nameA = a.displayName.toUpperCase();
      //     var nameB = b.displayName.toUpperCase();
      //     if (nameA < nameB) {
      //       return -1;
      //     }
      //     if (nameA > nameB) {
      //       return 1;
      //     }
      //     return 0;
      //   });
      //   return orgUnit;
      // };
      if (filter) {
        if (!filter.includes(currentOu.path)) {
          currentOu.children = currentOu.children
            .filter((c) => {
              return !filter.includes(c.path);
            })
            .sort(function (a, b) {
              var nameA = a.displayName.toUpperCase();
              var nameB = b.displayName.toUpperCase();
              if (nameA < nameB) {
                return -1;
              }
              if (nameA > nameB) {
                return 1;
              }
              return 0;
            });
          accumulator[`organisationUnits/${currentOu.id}`] = currentOu;
        }
      } else {
        currentOu.children = currentOu.children.sort(function (a, b) {
          var nameA = a.displayName.toUpperCase();
          var nameB = b.displayName.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });
        accumulator[`organisationUnits/${currentOu.id}`] = currentOu;
      }
      return accumulator;
    }, {});
    data.roots = me.organisationUnits.map((ou) => ou.id);
    return data;
  }

  async getUserOrgUnits() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnits",
      {
        paging: false
      },
      ["withinUserHierarchy=true", "fields=id,path" ,"level=2"]
    );
  }

    async getOrgUnitsLevel3() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnits",
      {
        paging: false
      },
      ["withinUserHierarchy=true","level=2"]
    );
  }

  async getProgramMetadata(program) {
    const p = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/programs/${program}`,
      {
        paging: false
      },
      [
        "fields=id,displayName,sharing,userGroupAccesses,trackedEntityType,organisationUnits[id,displayName,code,path,attributeValues],programRuleVariables[name,programRuleVariableSourceType,dataElement,trackedEntityAttribute],programTrackedEntityAttributes[mandatory,displayInList,searchable,trackedEntityAttribute[id,displayName,displayFormName,displayShortName,valueType,optionSet[id],unique]],programStages[id,displayName,programStageDataElements[displayInReports,sortOrder,compulsory,dataElement[id,displayName,displayFormName,displayShortName,description,valueType,optionSet[id]]"
      ]
    );
    const programRules = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/programRules`,
      {
        paging: false
      },
      [`filter=program.id:eq:${program}`, `fields=*,programRuleActions[*]`]
    );
    const optionSets = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/optionSets`,
      {
        paging: false
      },
      ["fields=id,displayName,options[id,displayName,code,sortOrder]"]
    );
    const programMetadata = {};
    programMetadata.id = p.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.trackedEntityType = p.trackedEntityType.id;
    programMetadata.organisationUnits = p.organisationUnits;
    programMetadata.trackedEntityAttributes = p.programTrackedEntityAttributes.map((ptea) => {
      const tea = {
        compulsory: ptea.mandatory,
        id: ptea.trackedEntityAttribute.id,
        displayName: ptea.trackedEntityAttribute.displayName,
        displayFormName: ptea.trackedEntityAttribute.displayFormName
          ? ptea.trackedEntityAttribute.displayFormName
          : ptea.trackedEntityAttribute.displayShortName,
        valueType: ptea.trackedEntityAttribute.valueType,
        valueSet: null,
        optionSet: ptea.trackedEntityAttribute.optionSet ? ptea.trackedEntityAttribute.optionSet.id : null,
        displayInList: ptea.displayInList,
        searchable: ptea.searchable,
        unique: ptea.trackedEntityAttribute.unique
      };
      if (ptea.trackedEntityAttribute.optionSet) {
        tea.valueSet = optionSets.optionSets
          .find((os) => os.id === ptea.trackedEntityAttribute.optionSet.id)
          .options.map((o) => {
            return {
              value: o.code,
              label: o.displayName
            };
          });
      }
      return tea;
    });
    programMetadata.programStages = p.programStages.map((ps) => {
      const programStage = {
        id: ps.id,
        displayName: ps.displayName,
        dataElements: ps.programStageDataElements.map((psde) => {
          const dataElement = {
            displayInReports: psde.displayInReports,
            sortOrder: psde.sortOrder,
            compulsory: psde.compulsory,
            id: psde.dataElement.id,
            displayName: psde.dataElement.displayName,
            displayFormName: psde.dataElement.displayFormName
              ? psde.dataElement.displayFormName
              : psde.dataElement.displayShortName,
            description: psde.dataElement.description,
            valueType: psde.dataElement.valueType,
            valueSet: null,
            optionSet: psde.dataElement.optionSet ? psde.dataElement.optionSet.id : null
          };
          if (psde.dataElement.optionSet) {
            console.log(psde.dataElement);
            dataElement.valueSet = optionSets.optionSets
              .find((os) => os.id === psde.dataElement.optionSet.id)
              .options.map((o) => {
                return {
                  value: o.code,
                  label: o.displayName
                };
              });
          }
          return dataElement;
        })
      };
      return programStage;
    });
    programMetadata.programRules = programRules.programRules;
    programMetadata.programRuleVariables = p.programRuleVariables;
    programMetadata.userGroupAccesses = p.userGroupAccesses;
    programMetadata.sharing = p.sharing;
    return programMetadata;
  }

  async getTrackedEntityType(tet) {
    const p = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityTypes/${tet}`,
      {
        paging: false
      },
      [
        "fields=:owner,!created,!lastUpdated,!lastUpdatedBy,!user,!translations,trackedEntityTypeAttributes[mandatory,displayInList,searchable,trackedEntityAttribute[id,displayName,displayFormName,displayShortName,valueType,optionSet[id,options[id,displayName,code,sortOrder]],unique]]"
      ]
    );
    
    const TETMetadata = {};
    TETMetadata.id = p.id;
    TETMetadata.code = p.code;
    TETMetadata.displayName = p.name;
    TETMetadata.description = p.description;
    TETMetadata.trackedEntityAttributes = p.trackedEntityTypeAttributes.map((ptea) => {
      const tea = {
        compulsory: ptea.mandatory,
        id: ptea.trackedEntityAttribute.id,
        displayName: ptea.trackedEntityAttribute.displayName,
        displayFormName: ptea.trackedEntityAttribute.displayFormName ? ptea.trackedEntityAttribute.displayFormName : ptea.trackedEntityAttribute.displayShortName,
        valueType: ptea.trackedEntityAttribute.valueType,
        valueSet: ptea.trackedEntityAttribute.optionSet ? ptea.trackedEntityAttribute.optionSet.options.map(({code,displayName}) => ({value: code, label: displayName})) : null,
        optionSet: ptea.trackedEntityAttribute.optionSet ? ptea.trackedEntityAttribute.optionSet.id : null,
        displayInList: ptea.displayInList,
        searchable: ptea.searchable,
        unique: ptea.trackedEntityAttribute.unique
      };
      return tea;
    });
    return TETMetadata;
  }

  getOrgUnitGroups() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnitGroups",
      {
        paging: false
      },
      ["fields=id,displayName,access,organisationUnits[id,displayName,path]", "filter=access.read:eq:true"]
    );
  }

  getOrgUnitLevels() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/organisationUnitLevels",
      {
        paging: false
      },
      ["fields=id,displayName,level", "filter=access.read:eq:true"]
    );
  }

  async getTrackedEntityAttributes() {
    return pull(this.baseUrl, this.username, this.password, "/api/trackedEntityAttributes", {
      paging: false
    });
  }

  async getTrackerDataElements() {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      "/api/dataElements",
      {
        paging: false
      },
      ["filter=domainType:eq:TRACKER"]
    );
  }

  async getUsers() {
    return pull(this.baseUrl, this.username, this.password, "/api/users", {
      paging: false
    });
  }
}
