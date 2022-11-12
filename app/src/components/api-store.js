
const ApiRunner = async (method, endpoint, payload, callback) => {
  const domain = 'http://127.0.0.1:5000/api'

  const RequestInfo = {
    method
  }

  if (method === 'POST' && 'body' in payload) {
    RequestInfo.body = payload.body
  }

  if ('headers' in payload) {
    RequestInfo.headers = payload.headers
  }

  return await fetch(domain+endpoint, RequestInfo).then(callback).catch()
}

const ApiStore = () => (
  {
    getToken: async ({email, password}) => {
      const payload = {
        headers: new Headers({
          'Authorization': 'Basic ' + btoa(email +":"+password)
        })
      }

      const callback = (res) => {
        if (res.ok) {
          const result = res.text()
          return result
        }
      }

      return await ApiRunner('POST', "/tokens", payload, callback)
    },
    createUser: async ({email, first_name, last_name, password}) => {
      const payload = {
        body: JSON.stringify({ email, first_name, last_name, password }),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }

      const callback = (res) => {
        if (res.ok) {
          const result = res.text()
          return result
        }
      }

      return await ApiRunner('POST', '/users', payload, callback)
    },
    createProject: async ({name, description, size, type}) => {
      const payload = {
        body: JSON.stringify({name, description, size, type}),
        headers: new Headers({
          "Content-Type": "application/json"
        })
      }

      const callback = (res) => {
        if (res.ok) {
          const result = res.text()
          return result
        }
      }

      return await ApiRunner('POST', 'projects', payload, callback)
    }
  }
);

export default ApiStore()
