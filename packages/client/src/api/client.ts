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
    if(!response.ok) throw new Error("Request returned an error")
    return response.json()
  },
  post: async(url: string, body: string): Promise<Response> => {
    const response: Response = await fetch(url,{
      method:"POST",
      headers:{"Content-Type": "application/json"},
      body
    })
    return response
  },
  postPrivate: async(url: string, body: string, token: string): Promise<Response> => {
    const response: Response = await fetch(url,{
      method:"POST",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body
    })
    return response
  }

}

export default http