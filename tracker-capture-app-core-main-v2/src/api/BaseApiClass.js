import { pull, push, purePull, purePullNotForJson } from "./Fetch";

export default class BaseApiClass {
  constructor(baseUrl, username, password) {
    this.baseUrl = baseUrl ? baseUrl : "../../..";
    this.username = username ? username : "";
    this.password = password ? password : "";
  }

  get(endPoint, paging, params) {
    return pull(this.baseUrl, this.username, this.password, endPoint, paging, params);
  }

  pull(endPoint) {
    return purePull(this.baseUrl, endPoint, this.username, this.password);
  }

  pullNotForJson(endPoint) {
    return purePullNotForJson(this.baseUrl, endPoint, this.username, this.password);
  }

  push(endPoint, payload, method) {
    return push(this.baseUrl, this.username, this.password, endPoint, payload, method);
  }
}
