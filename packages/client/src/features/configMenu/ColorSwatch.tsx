import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import colors from '../../constants/colorVariants'
import Chevron from '../../assets/chevron-down.svg'
import { useAppStore } from '../../stores/app.store'
import type { ColorDefinition, ColorOption, Component } from '../../components/types'

type ColorSwatch = {
  isOpen: Record<string, boolean>,
  category: string,
  toggleOpen: (category: string) => void,
  // setColor: Dispatch<SetStateAction<{color: {entry: string, handle: string}}>>,
  // color: {color:{entry:string,handle:string}}
}

const ColorSwatch = ({isOpen, category, toggleOpen }: ColorSwatch) => {
  const [selected, setSelected] = useState<ColorDefinition>({name:'',code:''})
  const [selectedBgClass, setSelectedBgClass] = useState<string>('')
  // const [ optionColor, setOptionColor ] = useState<string>('')
  const { activeColorSelection,setActiveColor } = useAppStore()

  let colorOptions
  if(category === "Entry"){
    colorOptions = [...colors.entry]
  }else if(category === "Body"){
    colorOptions = [...colors.body]
  }else{
    colorOptions = [...colors.handle]
  }

  const changeColor = (category: string, color:ColorDefinition) => {
    // const c = color.replace("bg-","").replace("[","").replace("]","")
    // console.log("CATEGORY: ",cat)
    console.log("CATEGORY:")
    console.log(category)
    if(category === "Body"){
      console.log("BODY COLOR CLICKED")
      setActiveColor('Body',color)
    }else if(category === "Handle"){
      console.log("HANDLE COLOR CLICKED")
      setActiveColor('Handle',color)
    }else {
      console.log("ENTRY COLOR CLICKED")
      setActiveColor('Entry',color)
    }


    // if(cat.trim() === "Entry"){
    //   setColor(prev=>({
    //     ...prev,
    //     color:{
    //       handle:prev.color.handle,
    //       entry:c
    //     }
    //   }))
    // }else if( cat === "Handle"){
    //   setColor(prev=>({
    //     ...prev,
    //     color:{
    //       entry:prev.color.entry,
    //       handle:c
    //     }
    //   }))
    // }
  }

  // useEffect(() => {
    // console.log("CATEGORY")
    // console.log(category)
    // console.log("COLOR STATE:")
    // console.log(color)
    // if(category==="Entry"){
    //   setSelected(color.color.entry)
    // }else if(category ==="Handle"){
    //   setSelected(color.color.handle)
    // }
  // },[color])

  useEffect(() => {
    if(category==="Entry"){
      setSelected(activeColorSelection?.entry!)
    }else if(category ==="Handle"){
      setSelected(activeColorSelection?.handle!)
    }else{
      setSelected(activeColorSelection?.body!)
    }    
  },[activeColorSelection])

  return (
    <div className='flex flex-col text-nowrap text-sm gap-2'>
      {/* <div className='w-full border px-4 py-1 rounded-lg border-white/20 bg-gray-500/10 flex justify-between' onClick={()=>toggleOpen(category)}> */}
        {/* <div className='flex items-center'>Color</div>
        <div className='px-2 flex items-center gap-1 py-1 rounded-sm'>
          <div className={`h-4 w-4 border-2 rounded-full flex justify-center items-center ${selected.code}`} />
          <div className='flex items-center justify-center '>
            {selected.name}
          </div>
          <img className={`w-4 aspect-square transition-transform duration-150 ease-linear ${isOpen[category] ? '-rotate-180':'rotate-0'}`} src={Chevron} />
        </div> */}
      {/* </div> */}
      <div className="flex gap-4">
        {/* <AnimatePresence> */}
            {
              colorOptions!.map(color => {
                return(
                  <>
                    <div 
                    key={color.code}
                    // initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    // animate={{ opacity: 1, y: 0, scale: 1 }}
                    // exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    // transition={{ duration: 0.2 }}
                    className={`flex  justify-center items-center ${isOpen? 'p-0':'p-0 '} ${color.name === selected.name ? 'border-green-400':' border-white'} rounded-xl`} onClick={(e)=>e.stopPropagation()}
                    >
                      <div className={`rounded-full border-2 ${color.name === selected.name? 'border-[rgb(251,44,54)]/60':'border-zinc-700/40'} p-1`}>
                        <div className={`h-6 w-6 rounded-full flex justify-center items-center ${color.code}`} onClick={()=>changeColor(category,color)}/>
                          {/* <div className='bg-red-400 h-full w-full'>
                            
                          </div> */}
                      </div>

                      </div>
                  </>
                )
              })
            }
        {/* </AnimatePresence> */}
      </div>
      <div className="flex items-center justify-start font-extralight">
        Finish: {selected.name}
      </div>
    </div>

  )
}

export default ColorSwatch