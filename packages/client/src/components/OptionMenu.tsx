import { useEffect, useState, type Dispatch, type SetStateAction } from "react"
import type { AssetMetadataArray } from "../api/types"
import OptionRow from "../features/configMenu/OptionRow"
import { useAppStore } from "../stores/app.store"
// import { AnimatePresence, motion } from 'motion/react'
// import { entryColors, bodyColors, handleColors } from "../constants/colorVariants"
import ColorSwatch from "../features/configMenu/ColorSwatch"
import Safe from '../assets/safe.svg'
export function OptionMenu({setRotate, rotate}:{setRotate: Dispatch<SetStateAction<boolean>>, rotate: boolean}){
  const { assetMetadata, activeSelection, setActiveSelection } = useAppStore()
  const groups = new Map<string, AssetMetadataArray>()
  const [ isOpen, setOpen ] = useState<Record<string, boolean>>({})
  // const [ selected, setSelected ] = useState<Record<string,boolean>>({})
  // const [ testOpen, setTestOpen ] = useState<boolean>(false)
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
      // console.log("SORTED GROUPS")
      // console.log(sortedGroups)
      const body = sortedGroups.get('Body')
      const entry = sortedGroups.get('Entry')
      const handle = sortedGroups.get('Handle')
      if(body && entry && handle){
        const b = body[0]
        const e = entry[0]
        const h = handle[0]
        if(b && e && h){
          setActiveSelection([{category:b.category,id: b.id},{category:e.category,id:e.id},{category: h.category, id:h.id}])
          setOpen({[b.category]:false,[e.category]:false,[h.category]:false})
        }
      }
    }
  },[assetMetadata])

  
  // useEffect(() => {
  //   if(colors){
  //     const activeColors = colors.map(color => [[color.name,false]])
  //     const converted: Record<string, Record<string,boolean>> = Object.fromEntries(activeColors)
  //     setSelected(converted)
  //   }
  // },[])


  const toggleColorSwatch = (category: string) => {
    setOpen(prev => (
      {
        ...prev,
        [category]:!prev[category]
      }
    ))
  }

  return(
    <div className="flex flex-col gap-7 py-6 flex-1 min-h-0 overflow-y-auto overscroll-contain ">
      {
        Array.from(sortedGroups,([category, assets],index) =>{
          return (
            <div key={category} className="">
              <div className="mb-3 flex items-center justify-between">
                <label className="text-sm font-semibold capitalize text-zinc-100 tracking-widest">0{index+1} / {category}</label>
              </div>
              <div className="flex flex-col gap-4 px-2">
                {
                  assets.map( asset => {
                    return (
                      <OptionRow key={asset.id} id={asset.id} category={asset.category} name={asset.displayName} />
                    )
                  })
                } 
                <ColorSwatch category={category} toggleOpen={toggleColorSwatch} isOpen={isOpen} />
                {/* <div  onClick={()=>toggleColorSwatch(category)}>Color</div>
                <div className="grid grid-cols-2 gap-4">
                  <AnimatePresence >
                      {
                        isOpen[category] && colors.map(color => {
                          return(
                            <motion.div 
                            key={color.code}
                            initial={{ opacity: 0, y: -8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className={`flex flex-col border border-white/20 justify-center items-center ${isOpen? 'p-2':'p-0'} rounded-xl`} onClick={(e)=>e.stopPropagation()}
                            >
                              <div className={`h-4 w-4 border-white border-2 rounded-full flex justify-center items-center ${color.code}`} onClick={()=>changeColor(category,color.code)}/>
                              <div className="flex items-center justify-center">
                                {color.name}
                              </div>
                            </motion.div>
                          )
                        })
                      }
                  </AnimatePresence>
                </div> */}
              </div>
            </div>
        )})
      }
    </div>     
  )
}