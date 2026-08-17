import type { ReactNode } from 'react'

type MessageProps = {
  variant: 'error' | 'info'
  children: ReactNode
}

const VARIANT_CLASSES: Record<MessageProps['variant'], string> = {
  error: 'border-red-900 bg-red-950/50 text-red-300',
  info: 'border-zinc-700 bg-zinc-950/50 text-zinc-300',
}

export function Message({ variant, children }: MessageProps) {
  return (
    <div role="alert" className={`rounded-lg border p-3 text-sm ${VARIANT_CLASSES[variant]}`}>
      {children}
    </div>
  )
}