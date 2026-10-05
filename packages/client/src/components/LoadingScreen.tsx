type LoadingScreenProps = {
  label?: string,
  isLeaving: boolean
}

export function LoadingScreen({ label = 'Initializing…', isLeaving }: LoadingScreenProps) {
  // const {theme} = useThemeStore()

  return (
    <>
    <div className={`fixed inset-0 flex flex-col justify-center items-center  z-50 transition duration-300 ease-in  ${isLeaving && "opacity-0 scale-95"} bg-zinc-400 gap-5`}>
      <div className="h-10 w-10  animate-spin rounded-full border-2 border-zinc-700 border-t-red-500" />
      <p className="text-sm text-zinc-700">{label}</p>
     </div>
    </>
  )
}