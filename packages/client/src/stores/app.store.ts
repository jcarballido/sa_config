import { create } from "zustand";
import { getConfigurations } from "../api/configurations.api";
import { type AssetMetadata, type Configuration, type ImageAssetMetadata } from "../api/types";
import { getAssestMetadata, getImageAssetMetadata } from "../api/assets.api";
import colorVariants from "../constants/colorVariants";
import type { ColorDefinition, ColorOption } from "../components/types";

type State = {
  initialized: boolean,
  configurations: Map<Configuration["signature"][number],Configuration> | null,
  assetMetadata: Map<AssetMetadata['id'],AssetMetadata> | null,
  imageAssetMetadata: Map<ImageAssetMetadata['configurationId'],ImageAssetMetadata[]> | null,
  activeImageIds: ImageAssetMetadata[] | null,
  activeSelection: Map<AssetMetadata['category'], AssetMetadata['id']|null>,
  activeConfiguration: Configuration | null,
  activeColorSelection: ColorOption | null
}

type Action = {
  initialize: () => Promise<void>,
  setActiveSelection: (updates: {category:AssetMetadata['category'], id: AssetMetadata['id']}[]) => void,
  setActiveImageIds: (arrId: ImageAssetMetadata[]) => void,
  setActiveColor: (category:'Entry'|'Body'|'Handle', color: ColorDefinition) => void
}

export const useAppStore = create<State & Action>((set) => ({
  initialized: false,
  initialize:  async() => {
    const configs = await getConfigurations()
    const assetMetadata = await getAssestMetadata()
    const imageAssetMetadata = await getImageAssetMetadata()
    const colorSelection = {
      body: colorVariants.body[0],
      entry: colorVariants.entry[0],
      handle: colorVariants.handle[0]
    }
    set({
      initialized: true,
      configurations: configs,
      assetMetadata,
      imageAssetMetadata,
      activeColorSelection: colorSelection
    })
  },
  configurations: null,
  assetMetadata: null,
  imageAssetMetadata:null,
  activeImageIds: null,
  activeSelection: new Map(),
  activeConfiguration: null,
  activeColorSelection: null,
  setActiveSelection: (updates) => {
    set((state) => {
      const newUpdates = new Map(state.activeSelection)
      for (const update of updates){
        if(!['Body','Handle','Entry'].includes(update.category)) {
          console.log(`${update.category} is not a valid category`)
        } 
        newUpdates.set(update.category,update.id)
      }
      const selectionSignature = Array.from(newUpdates.values()).filter(val=>val!=null).sort((a,b) => a?.localeCompare(b))
      const activeConfiguration = state.configurations?.get(selectionSignature.join("-")) || null
      return {
        activeSelection: newUpdates,
        activeConfiguration
      }
    })
  },
  setActiveImageIds: (arrIds) => {
    set({
      activeImageIds: [...arrIds]
    })
  },
  setActiveColor: (category, color ) => {
    if(category === "Body"){
      set((state)=>({
        activeColorSelection: {
          entry:{...state.activeColorSelection?.entry!},
          handle:{...state.activeColorSelection?.handle!},
          body:{...color}
        }
      }))
    }else if(category === "Entry"){
      set((state)=>({
        activeColorSelection: {
          body:{...state.activeColorSelection?.body!},
          handle:{...state.activeColorSelection?.handle!},
          entry:{...color}
        }
      }))
    }else{
      set((state)=>({
        activeColorSelection: {
          entry:{...state.activeColorSelection?.entry!},
          body:{...state.activeColorSelection?.body!},
          handle:{...color}
        }
      }))

    }
  }
}))