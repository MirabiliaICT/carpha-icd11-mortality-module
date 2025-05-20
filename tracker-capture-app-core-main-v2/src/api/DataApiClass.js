import { pull, push } from "./Fetch";
import BaseApiClass from "./BaseApiClass";
import moment from "moment";

export default class DataApiClass extends BaseApiClass {
  getTrackedEntityInstanceList(
    orgUnit,
    program,
    pageSize,
    page,
    filter,
    order
  ) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filter,
        order: order,
      },
      [`ou=${orgUnit}`, `ouMode=SELECTED`, `program=${program}`]
      // [`ou=${orgUnit}`, `ouMode=SELECTED`, `order=created:desc`, `program=${program}`]
    );
  }

  getTrackedEntityInstanceListByQuery(
    orgUnit,
    program,
    pageSize,
    page,
    filter,
    order,
    programStatus
  ) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filter,
        order: order,
      },
      [
        `ou=${orgUnit}`,
        `ouMode=SELECTED`,
        `program=${program}`,
        programStatus ? `programStatus=${programStatus}` : "",
      ]
    );
  }

  getEventsFiltersList(program, trackedEntityInstance, startDate, endDate) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/events`,
      {
        paging: false,
      },
      [
        `fields=:all`,
        `program=${program}`,
        `trackedEntityInstance=${trackedEntityInstance}`,
        `startDate=${startDate}&endDate=${endDate}`,
      ]
    );
  }

  getAllTrackedEntityInstanceList(orgUnit, program) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query`,
      {
        paging: false,
      },
      [`ou=${orgUnit}`, `ouMode=SELECTED`, `program=${program}`]
    );
  }

  getAllTrackedEntityFiltersList(program) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstanceFilters`,
      {
        paging: false,
      },
      [`fields=:all`, `program=${program}`]
    );
  }

  findTei(orgUnit, program, attributes) {
    let filters = "";
    attributes.forEach((attr) => {
      filters += `&filter=${attr.attribute}:EQ:${attr.value}`;
    });
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances`,
      {
        paging: false,
        filter: filters,
      },
      [`ou=${orgUnit}`, `ouMode=ACCESSIBLE`, `program=${program}`, `fields=*`]
    );
  }

  searchTei(program, attributes, pageSize, page) {
    let filters = "";
    attributes.forEach((attr) => {
      filters += `&filter=${attr.attribute}:EQ:${attr.value}`;
    });
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filters,
        order: "order=created:desc",
      },
      [`ouMode=ACCESSIBLE`, `program=${program}`, `fields=*`]
    );
  }

  searchTeiByTet(tet, attributes, pageSize, page) {
    let filters = "";
    attributes.forEach((attr) => {
      filters += `&filter=${attr.attribute}:EQ:${attr.value}`;
    });
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances`,
      {
        paging: true,
        pageSize: pageSize,
        totalPages: true,
        page: page,
        filter: filters,
        order: "order=created:desc",
      },
      [`ouMode=ACCESSIBLE`, `trackedEntityType=${tet}`, `fields=*`]
    );
  }

  search(ouId, ouMode, queryUrl, program, attribute, pager, paging) {
    var url = this.getSearchUrl(
      ouId,
      ouMode,
      queryUrl,
      program,
      attribute,
      pager,
      paging
    );
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/query`,
      {},
      [url]
    );
  }

  getSearchUrl(ouId, ouMode, queryUrl, program, attribute, pager, paging) {
    var url = "";
    url += "ou=" + ouId + "&ouMode=" + ouMode;

    if (queryUrl) {
      url = url + "&" + queryUrl;
    }
    if (program) {
      url = url + "&program=" + program;
    }
    if (attribute) {
      url = url + "&" + attribute;
    }
    if (paging) {
      var pgSize = (pager && pager.pageSize) || 50;
      var pg = (pager && pager.page) || 1;
      pgSize = pgSize > 1 ? pgSize : 1;
      pg = pg > 1 ? pg : 1;
      url = url + "&pageSize=" + pgSize + "&page=" + pg;
      if (pager && pager.skipTotalPages) {
        url += "&totalPages=false";
      } else {
        url += "&totalPages=true";
      }
    } else {
      url = url + "&paging=false";
    }
    return url;
  }

  getPeriodDate(days) {
    return moment().add(days, "days").format("YYYY-MM-DD");
  }

  getEventUrl(eventFilter) {
    var eventUrl = "";
    if (eventFilter) {
      if (eventFilter.eventStatus)
        eventUrl = "eventStatus=" + eventFilter.eventStatus;
      if (eventFilter.eventCreatedPeriod) {
        if (eventUrl) eventUrl += "&";
        eventUrl +=
          "eventStartDate=" +
          this.getPeriodDate(eventFilter.eventCreatedPeriod.periodFrom);
        eventUrl +=
          "&eventEndDate=" +
          this.getPeriodDate(eventFilter.eventCreatedPeriod.periodTo);
      }
      if (eventFilter.programStage) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "programStage=" + eventFilter.programStage;
      }
      if (eventFilter.assignedUserMode) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "assignedUserMode=" + eventFilter.assignedUserMode;
      }
      if (
        !eventFilter.assignedUserMode ||
        (eventFilter.assignedUserMode == "PROVIDED" &&
          eventFilter.assignedUsers &&
          eventFilter.assignedUsers.length > 0)
      ) {
        if (eventUrl) eventUrl += "&";
        eventUrl += "assignedUser=";
        for (var i = 0; i < eventFilter.assignedUsers.length; i++) {
          if (i > 0) eventUrl += ";";
          eventUrl += eventFilter.assignedUsers[i];
        }
      }
    }
    return eventUrl;
  }

  async getTrackedEntityInstanceById(id, program) {
    const tei = await pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/${id}`,
      { paging: false },
      [`fields=*`, `program=${program}`]
    );
    return tei;
  }

  // async getTrackedEntityFiltersById(id, program) {
  //   const tei = await pull(
  //     this.baseUrl,
  //     this.username,
  //     this.password,
  //     `/api/trackedEntityInstanceFilters/${id}`,
  //     { paging: false },
  //     [`fields=*`, `program=${program}`]
  //   );
  //   return tei;
  // }

  getWorkingListDataWithMultipleEventFilters(
    workingList,
    ou,
    program,
    pager,
    sortColumn
  ) {
    return new Promise((resolve) => {
      var promises = [];
      workingList.eventFilters.forEach((eventFilter) => {
        var eventUrl = this.getEventUrl(eventFilter);
        var tempPager = {
          pageSize: 1000,
          page: 1,
        };
        promises.push(
          this.search(
            ou,
            "SELECTED",
            eventUrl, //queryUrl
            program,
            null, //attribute
            tempPager,
            true // paging
          )
        );
      });

      Promise.all(promises).then((response) => {
        var data = { height: 0, width: 0, rows: [] };
        var existingTeis = {};
        var allRows = [];

        response.forEach((responseData) => {
          data.headers =
            data.headers && data.headers.length > responseData.headers.length
              ? data.headers
              : responseData.headers;
          data.width =
            data.width > responseData.width ? data.width : responseData.width;
          allRows = allRows.concat(responseData.rows);
        });

        //Getting distinct list
        var existing = {};
        data.rows = allRows.filter(function (d) {
          if (existing[d[0]]) return false;
          existing[d[0]] = true;
          return true;
        });
        // var sortColumnIndex = data.headers.findIndex(function (h) {
        //   return h.name === sortColumn.id;
        // });
        // if (sortColumnIndex)
        //   data.rows = orderByKeyFilter(
        //     data.rows,
        //     sortColumnIndex,
        //     sortColumn.direction
        //   );
        // //order list
        // cachedMultipleEventFiltersData[workingList.name] = data;
        // workingList.cachedSorting = searchParams.sortUrl;
        // workingList.cachedOrgUnit = searchParams.orgUnitId;
        // var data = getCachedMultipleEventFiltersData(
        //   workingList,
        //   pager,
        //   sortColumn
        // );
        resolve(data);
      });
    });
  }

  pushTrackedEntityInstance(tei, program) {
    return push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances?program=${program}`,
      tei
    );
  }

  async putTrackedEntityInstance(tei, program) {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances/${tei.trackedEntityInstance}?program=${program}`,
      tei,
      "PUT"
    );
  }

  async postTrackedEntityInstance(tei, program) {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances`,
      tei,
      "POST"
    );
  }

  pushEnrollment(enrollment, program) {
    return push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/enrollments?program=${program}`,
      enrollment
    );
  }

  pushEvents(events) {
    return push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/events/`,
      events
    );
  }

  /**
   *
   * @param {*} eventId
   * @returns
   */
  pullEventById(eventId) {
    return pull(
      this.baseUrl,
      this.username,
      this.password,
      `/api/events${eventId}`,
      {},
      []
    );
  }

  async deleteEvent(event) {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/events?strategy=DELETE`,
      event
    );
    return result.status == "OK";
  }

  async deleteTei(tei) {
    const result = await push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/trackedEntityInstances?strategy=DELETE`,
      tei
    );
    return result.status == "OK";
  }

  modifyOwnership(tei, program, ou) {
    return push(
      this.baseUrl,
      this.username,
      this.password,
      `/api/tracker/ownership/transfer?trackedEntityInstance=${tei}&program=${program}&ou=${ou}`,
      {},
      "PUT"
    );
  }
}
