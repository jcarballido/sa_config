import type { AssetMetadata } from "../../api/types"
import { getAsset } from "../../assets/assetCache"
import { useAppStore } from "../../stores/app.store"

export default function OptionRow({
  label,
  id,
  category
  // selected,
  // onClick,
}: {
  label: number,
  id: string,
  category: AssetMetadata["category"]
  // selected: boolean
  // onClick: () => void
}) {
  const { activeSelection,setActiveSelection } = useAppStore()
  // const { setActiveBody } = useAppStore()
  const onClick: React.MouseEventHandler = async (e: React.MouseEvent) => {
    e.preventDefault()
    // setActiveBody(id)
    setActiveSelection(id, category)
    const r = await getAsset(id)
  }
  
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border  px-4 py-3 text-sm font-medium transition   border-amber-200`}
        // ${
        //   selected
        //     ? 'border-purple-500 bg-zinc-800 text-zinc-100'
        //     : 'border-green-500 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
        // }`
    >
      <span>{label}</span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-[10px]">
        {/* {selected ? '✓' : ''} */}
      </span>
    </button>
  )
}