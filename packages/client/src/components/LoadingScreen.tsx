type LoadingScreenProps = {
  label?: string
}

export function LoadingScreen({ label = 'Loading…' }: LoadingScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-zinc-950 text-zinc-100">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-100" />
      <p className="text-sm text-zinc-400">{label}</p>
    </div>
  )
}