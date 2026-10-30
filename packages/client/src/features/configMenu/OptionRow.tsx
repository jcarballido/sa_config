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
      className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-sm font-medium transition ${selected? 'bg-[rgb(251,44,54)]/5 border-[rgb(251,44,54)]': ' border-zinc-700 bg-black/70' }`}
        // ${
        //   selected
        //     ? 'border-purple-500 bg-zinc-800 text-zinc-100'
        //     : 'border-green-500 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900'
        // }`
    >
      <span className={`${selected? 'text-white font-semibold':' text-white font-light'}`} >{name}</span>
      <span className={`flex h-4 w-4 items-center justify-center rounded-full border  text-base p-1 ${selected ? 'border-[rgb(251,44,54)]':'border-zinc-700'} `}>
        {/* <div  className="h-full aspect-square rounded-full p-0.5 bg-white"/> */}
        {selected ?         <div  className="h-full aspect-square rounded-full p-0.5 bg-[rgb(251,44,54)]"/>
 : null}
      </span>
    </button>
  )
}