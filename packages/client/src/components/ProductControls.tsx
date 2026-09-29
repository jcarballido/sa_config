import { SidebarHeader } from './SidebarHeader'
import { OptionMenu } from './OptionMenu'

export function ProductControls() {

  return (
    <aside className="w-full rounded-3xl border border-zinc-800 bg-zinc-900 p-5 lg:max-w-97.5 lg:p-6">
      <SidebarHeader />
      <OptionMenu />
      <div className="border-t border-zinc-800 pt-5">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs text-zinc-500">Configuration index</span>
        </div>

        <button
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-800 px-4 py-3 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <div className="h-4 w-4 rounded bg-zinc-600" />
        </button>
        <p className="mt-3 text-center text-[11px] leading-5 text-zinc-500">
          Image download only. 3D source files are not downloadable.
        </p>
      </div>
    </aside>
  )
}
