import StatusCodes from 'http-status-codes'

const ApiRunner = async (method, endpoint, payload, fn) => {
  const domain = 'http://127.0.0.1:5000/api'

  const RequestInfo = {
    method
  }

  if ((method === 'POST'|| method === 'PUT') && 'body' in payload) {
    RequestInfo.body = payload.body
  }

  if ('headers' in payload) {
    RequestInfo.headers = payload.headers
  }

  const processResponse = (res) => {
    if (!res.ok) {
      return {
        error: res.status,
        message: res.statusText
      }
    }

    if (res.status === StatusCodes.NO_CONTENT) {
      return {
        success: res.status,
        message: "success"
      }
    }

    return res.json()
  }

  const callback = (data) => {
    if (fn) return fn(data)
    return data
  }

  return await fetch(domain + endpoint, RequestInfo)
    .then(processResponse)
    .then(callback)
    .catch()
}

const ApiStore = () => (
  {
    getToken: async ({ email, password }) => {
      const payload = {
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(email + ":" + password)
        })
      }

      return await ApiRunner('POST', "/tokens", payload)
    },
    createUser: async ({ email, first_name, last_name, password }) => {
      const payload = {
        body: JSON.stringify({ email, first_name, last_name, password }),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }

      return await ApiRunner('POST', '/users', payload)
    },
    updateUser: async (id, token, { email, first_name, last_name, password }) => {
      const payload = {
        body: JSON.stringify({ email, first_name, last_name, password }),
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('PUT', `/users/${id}`, payload)
    },
    getUsers: async (token, include=false, page, perPage) => {
      const payload = {
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }
      let queryParams = '?'

      if (page && perPage) {
        queryParams += `page=${page}&per_page=${perPage}`
        if (include) queryParams += `&include`
      } else {
        if (include) queryParams += 'include'
      }

      return await ApiRunner('GET', `/users${queryParams}`, payload)
    },
    getUserById: async (id, token) => {
      const payload = {
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('GET', `/users/${id}`, payload)
    },
    deleteUser: async (id, token) => {
      const payload = {
        headers: new Headers({
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('DELETE', `/users/${id}`, payload)
    },
    createProject: async (token, { name, description, size, tag }) => {
      const payload = {
        body: JSON.stringify({ name, description, size, tag }),
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('POST', '/projects', payload)
    },
    getProjects: async (token, include=false, page, perPage) => {
      const payload = {
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }
      let queryParams = '?'

      if (page && perPage) {
        queryParams += `page=${page}&per_page=${perPage}`
        if (include) queryParams += `&include`
      } else {
        if (include) queryParams += 'include'
      }

      return await ApiRunner('GET', `/projects${queryParams}`, payload)
    },
    getProjectById: async (id, token, include=false) => {
      const payload = {
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('GET', `/projects/${id}${include?'?include': ''}`, payload)
    },
    updateProject: async (id, token, { name, description, size, tag }) => {
      const payload = {
        body: JSON.stringify({ name, description, size, tag }),
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('PUT', `/projects/${id}`, payload)
    },
    publishProject: async (id, token) => {
      const payload = {
        headers: new Headers({
          "Content-Type": "application/json",
          'Authorization': 'Bearer ' + token
        })
      }

      return await ApiRunner('GET', `/projects/${id}/publish`, payload)
    },
    deleteProject: async(id, token) => {
      const payload = {
        headers: new Headers({
          'Authorization': 'Bearer ' + token
        })
      }
      return await ApiRunner('DELETE', `/projects/${id}`, payload)
    }
  }
);

export default ApiStore()
