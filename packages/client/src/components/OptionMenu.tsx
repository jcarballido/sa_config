import { useEffect } from "react"
import type { AssetMetadataArray } from "../api/types"
import OptionRow from "../features/configMenu/OptionRow"
import { useAppStore } from "../stores/app.store"

export function OptionMenu(){
  const { assetMetadata } = useAppStore()
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
    
  })

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