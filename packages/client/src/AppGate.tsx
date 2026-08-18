import { useEffect, useRef, useState } from "react"
// import { useAppStateStore } from "../stores/appState.store"
import { useAuthStore } from "./stores/auth.store"
import App from "./App"
// import SplashScreen from "./SplashScreen"
import { LoadingScreen } from "./components/LoadingScreen"
// import { useThemeStore } from "../stores/theme.store"
// import { useConversationStore } from "../stores/conversation.store"


const AppGate = () => {
  const { authStatus } = useAuthStore()
  // const { theme, toggleTheme } = useThemeStore()
  const [ showSplash, setShowSplash ] = useState<boolean>(true) 
  const [ isLeaving, setIsLeaving ] = useState(false)

  // console.log("Auth Status: ", authStatus.status)
  // console.log("SESSION:", authStatus.session )
  // console.log("PERFORMANCE RUNNING")
  const start = useRef(performance.now())
  // console.log(start)
  // const { getStoredConversationMetadata } = useConversationStore()
  // const [ pinged, setPinged ] = useState<boolean>(false)

  useEffect(() => {
    console.log("USEEFFECT RUNNING")
    console.log("AUTH STATUS: ",authStatus)
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
        setTimeout(()=>setShowSplash(false),500)    // getStoredConversationMetadata()
      }
    }
    console.log("AUTH STATUS AFTER LOADING: ", authStatus.status)
  },[authStatus.status])

  // useEffect(() => {
  //   const persistedTheme = localStorage.getItem("theme")
  //   const theme: {state:{theme:"dark"|"light"}, version: number} = JSON.parse(persistedTheme!)
  //   document.documentElement.classList.toggle(
  //     "dark",
  //     theme.state.theme === "dark"
  //   )
  // },[theme])
  
    return (
      <>
        <App /> 
        { authStatus.status !== "unauthenticated" && showSplash && <LoadingScreen isLeaving={isLeaving} />}
      </>
    )



}

export default AppGate