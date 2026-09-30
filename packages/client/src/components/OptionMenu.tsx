import { useEffect } from "react"
import type { AssetMetadataArray } from "../api/types"
import OptionRow from "../features/configMenu/OptionRow"
import { useAppStore } from "../stores/app.store"

export function OptionMenu(){
  const { assetMetadata, setActiveSelection } = useAppStore()
  const groups = new Map<string, AssetMetadataArray>()
  if(assetMetadata){
    for(const asset of assetMetadata.values()){
      const group = groups.get(asset.category)
      if(group){
        group.push(asset)
      }else{
        groups.set(asset.category,[asset])
      }
    }
  }
  const sortedGroups = new Map(
    [...groups.entries()]
      .sort(([a],[b])=> a.localeCompare(b))
      .map(([key,values])=> [
        key,
        values.toSorted((a,b)=> a.displayName.localeCompare(b.displayName))
      ])
  )

  useEffect(() => {
    console.log("SORTED GROUPS")
    console.log(sortedGroups)
    const body = sortedGroups.get('Body')
    const entry = sortedGroups.get('Entry')
    const handle = sortedGroups.get('Handle')
    if(body && entry && handle){
      const b = body[0]
      const e = entry[0]
      const h = handle[0]
      if(b && e && h){
        setActiveSelection([{category:b.category,id: b.id},{category:e.category,id:e.id},{category: h.category, id:h.id}])
      }
    }
  },[assetMetadata])

  return(
    <div className="flex flex-col gap-7 py-6">
      {
        Array.from(sortedGroups,([category, assets]) =>{
          return (
            <div key={category}>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold capitalize text-zinc-100">{category}</label>
              </div>
              <div className="flex flex-col gap-4">
                {
                  assets.map( asset => {
                    return (
                      <OptionRow key={asset.id} id={asset.id} category={asset.category} name={asset.displayName} />
                    )
                  })
                }
              </div>
            </div>
        )})
      }
    </div>     
  )
}