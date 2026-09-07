import http from "./client"

export async function sendMagicLink(email: string): Promise<void> {
  const response = await http.post('api/login/requestAccess',JSON.stringify({email: email})) 
  console.log("RESPONSE: ")
  console.log(response)
  // const response = await fetch('api/login/requestAccess',{
  //     method:"POST",
  //     headers:{"Content-Type": "application/json"},
  //     body:JSON.stringify({email: email})
  // })
  if(!response.ok) throw new Error("Error failed.")
}

