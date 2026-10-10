import { create } from "zustand";
import { getConfigurations } from "../api/configurations.api";
import { type AssetMetadata, type Configuration, type ImageAssetMetadata } from "../api/types";
import { getAssestMetadata, getImageAssetMetadata } from "../api/assets.api";

type State = {
  initialized: boolean,
  configurations: Map<Configuration["signature"][number],Configuration> | null,
  assetMetadata: Map<AssetMetadata['id'],AssetMetadata> | null,
  imageAssetMetadata: Map<ImageAssetMetadata['configurationId'],ImageAssetMetadata[]> | null,
  activeImageIds: ImageAssetMetadata['hash'][] | null
  activeSelection: Map<AssetMetadata['category'], AssetMetadata['id']|null>
  activeConfiguration: Configuration | null
}

type Action = {
  initialize: () => Promise<void>,
  setActiveSelection: (updates: {category:AssetMetadata['category'], id: AssetMetadata['id']}[]) => void,
  setActiveImageIds: (arrId: ImageAssetMetadata['hash'][]) => void
}

export const useAppStore = create<State & Action>((set) => ({
  initialized: false,
  initialize:  async() => {
    const configs = await getConfigurations()
    const assetMetadata = await getAssestMetadata()
    const imageAssetMetadata = await getImageAssetMetadata()
    set({
      initialized: true,
      configurations: configs,
      assetMetadata,
      imageAssetMetadata
    })
  },
  configurations: null,
  assetMetadata: null,
  imageAssetMetadata:null,
  activeImageIds: null,
  activeSelection: new Map(),
  activeConfiguration: null,
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
  }
}))