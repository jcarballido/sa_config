import { useEffect, useState } from "react"
import type { AssetMetadata } from "../../api/types"
import { useAppStore } from "../../stores/app.store"

export default function OptionRow({
  id,
  category,
  name,
}: {
  id: string,
  category: AssetMetadata["category"],
  name: AssetMetadata['displayName'],
}) {
  const { activeSelection, setActiveSelection } = useAppStore()
  const [ selected, setSelected ] = useState<boolean>(false)
  const onClick: React.MouseEventHandler = async (e: React.MouseEvent) => {
    e.preventDefault()
    setActiveSelection([{category, id}])
  }

  useEffect(() => {
    const activeIds = Array.from(activeSelection.values()).filter(val => val !== null)
    if(activeIds.includes(id)) setSelected(true)
    else setSelected(false)
    return
  },[activeSelection])

  
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-lg border  px-4 py-3 text-sm font-medium transition ${selected? 'border-amber-200': 'border-blue-400' }`}
        // ${
        //   selected
        //     ? 'border-purple-500 bg-zinc-800 text-zinc-100'
        //     : 'border-green-500 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
        // }`
    >
      <span>{name}</span>
      <span className="flex h-5 w-5 items-center justify-center rounded-full border border-zinc-600 text-[10px]">
        {/* {selected ? '✓' : ''} */}
      </span>
    </button>
  )
}