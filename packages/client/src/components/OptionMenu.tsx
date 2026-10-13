import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { AssetMetadataArray } from "../api/types"
import OptionRow from "../features/configMenu/OptionRow"
import { useAppStore } from "../stores/app.store"

export function OptionMenu({setColor, setRotate, rotate}:{setColor: Dispatch<SetStateAction<{color:{entry:string,handle:string}}>>, setRotate: Dispatch<SetStateAction<boolean>>, rotate: boolean}){
  const { assetMetadata, activeSelection, setActiveSelection } = useAppStore()
  const groups = new Map<string, AssetMetadataArray>()
  const [ isOpen, setOpen ] = useState<{cat:string|null, status:boolean}>({cat:null,status:false})
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
    if(activeSelection.size === 0){
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
    }
  },[assetMetadata])

  // const colors = ['bg-[#FF6D00]','bg-[#00E5FF]','bg-[#39FF14]','bg-[#FF1493]']
  const colors = [{name:'Burnt Orange',code:'bg-[#FF6D00]'},{name:'Sky Blue',code:'bg-[#00E5FF]'},{name:'Neon Green',code:'bg-[#39FF14]'},{name:'Magenta',code:'bg-[#FF1493]'}]

  const changeColor = (cat: string, color:string) => {
    const c = color.replace("bg-","").replace("[","").replace("]","")
    console.log("CATEGORY: ",cat)
    if(cat.trim() === "Entry"){
      setColor(prev=>({
        ...prev,
        color:{
          handle:prev.color.handle,
          entry:c
        }
      }))
    }else if( cat === "Handle"){
      setColor(prev=>({
        ...prev,
        color:{
          entry:prev.color.entry,
          handle:c
        }
      }))
    }
  }

  // const toggleRotate = () => {
  //   setRotate(!rotate)
  // }

  return(
    <div className="flex flex-col gap-7 py-6 flex-1 min-h-0 overflow-y-auto overscroll-contain ">
      {/* <div onClick={toggleRotate} className="border-2 border-white p-4 text-2xl">ROTATE</div> */}
      {
        Array.from(sortedGroups,([category, assets],index) =>{
          return (
            <div key={category} className="">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold capitalize text-zinc-100 tracking-widest">0{index+1} / {category}</label>
              </div>
              <div className="flex flex-col gap-4">
                {
                  assets.map( asset => {
                    return (
                      <OptionRow key={asset.id} id={asset.id} category={asset.category} name={asset.displayName} />
                    )
                  })
                }
                <div className="" onClick={(e)=>{
                  
                  setOpen(prev=>({cat: category, status: true}))
                }}>
                  Color
                </div>
                <div className=" text-3xl flex flex-col  justify-left gap-2">
                  {
                    isOpen.status && isOpen.cat === category  && colors.map(color => {
                      return(
                        <div className="flex justify-left w-full border gap-6 p-3">
                          <div className={`w-10 h-10 border-white border-2 rounded-full ${color.code}`} onClick={()=>changeColor(category,color.code)}/>
                          <div className="text-xs flex items-center">
                            {color.name}
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </div>
        )})
      }
    </div>     
  )
}