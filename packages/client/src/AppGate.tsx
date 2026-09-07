import { useEffect, useRef, useState } from "react"
import { useAuthStore } from "./stores/auth.store"
import App from "./App"
import { LoadingScreen } from "./components/LoadingScreen"

const AppGate = () => {
  const { authStatus } = useAuthStore()
  const [ showSplash, setShowSplash ] = useState<boolean>(true) 
  const [ isLeaving, setIsLeaving ] = useState(false)

  const start = useRef(performance.now())

  useEffect(() => {
    if(authStatus.status !== "loading"){
      const elapsed = performance.now()
      console.log("ELAPSED TIME: ", elapsed)
      if(elapsed - start.current < 3000){
        console.log("TIME LESS THAN THRESHOLD")
        setTimeout(()=>{
          setIsLeaving(true)
          setTimeout(()=>setShowSplash(false),500)
        }, (3000-(elapsed-start.current)))
      }else{
        console.log("TIME EXCEEDS THRESHOLD")
        setIsLeaving(true)
        setTimeout(()=>setShowSplash(false),500)
      }
    }
  },[authStatus.status])


  return (
    <>
      <App /> 
      { authStatus.status !== "unauthenticated" && showSplash && <LoadingScreen isLeaving={isLeaving} />}
    </>
  )
}

export default AppGate