
// fetch
const http = {
  get: async<T>(url: string): Promise<T> => {
    const response = await fetch(url)
    if(response.ok!) throw new Error("Request returned an error")
    return response.json()
  },
  getPrivate: async<T>(url: string, token: string): Promise<T> => {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    if(response.ok!) throw new Error("Request returned an error")
    return response.json()
  },
}

export default http