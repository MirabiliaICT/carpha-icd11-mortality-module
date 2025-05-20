const pull = (baseUrl, username, password, endPoint, pagingObject, params) => {
  const { paging, pageSize, totalPages, page, filter, order } = pagingObject ? pagingObject : {};

  endPoint += "?";
  if (filter) {
    endPoint += `${filter}&`;
  }
  if (order) {
    endPoint += `${order}&`;
  }
  if (paging) {
    endPoint += `paging=true&pageSize=${pageSize}&totalPages=${totalPages}&page=${page}&`;
  } else {
    endPoint += "paging=false&";
  }
  if (params) {
    endPoint += params.join("&");
  }

  return fetch(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  })
    .then((result) => result.json())
    .then((json) => json)
    .catch((err) => err);
};

const purePull = (baseUrl, endPoint, username, password) => {
  return fetch(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  })
    .then((result) => result.json())
    .then((json) => json)
    .catch((err) => err);
};

const purePullNotForJson = (baseUrl, endPoint, username, password) => {
  return fetch(baseUrl + endPoint, {
    credentials: "include",
    headers: {
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  });
};

const push = (baseUrl, username, password, endPoint, payload, method) => {
  return fetch(baseUrl + endPoint, {
    method: method ? method : "POST",
    credentials: "include",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: !username ? "" : "Basic " + btoa(`${username}:${password}`)
    }
  })
    .then((result) => {
      return result.json();
    })
    .catch((err) => {
      return err;
    });
};

export { pull, purePull, purePullNotForJson, push };
