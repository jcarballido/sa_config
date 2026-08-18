type LoadingScreenProps = {
  label?: string,
  isLeaving: boolean
}


export function LoadingScreen({ label = 'Loading…', isLeaving }: LoadingScreenProps) {
  // const {theme} = useThemeStore()

  return (
    <div className={`w-screen h-screen flex flex-col justify-center items-center absolute z-10 transition duration-300 ease-in  ${isLeaving && "opacity-0 scale-95"} bg-amber-200`}>
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-100" />
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  )
}