import { create } from "zustand";
import { getConfigurations } from "../api/configurations.api";
import type { AssetMetadata, Configuration } from "../api/types";
import { getAssestMetadata } from "../api/assets.api";

type State = {
  initialized: boolean,
  configurations: Map<Configuration["signature"][number],Configuration> | null,
  assetMetadata: Map<AssetMetadata['id'],AssetMetadata> | null,
  activeSelection: {
    body: AssetMetadata["id"] | null,
    entry: AssetMetadata["id"] | null,
    handle: AssetMetadata["id"]| null
  },
  activeConfiguration: Configuration | null
}

type Action = {
  initialize: () => Promise<void>,
  setActiveSelection: (assetId: string, category: string) => void
}

export const useAppStore = create<State & Action>((set) => ({
  initialized: false,
  initialize:  async() => {
    const configs = await getConfigurations()
    const assetMetadata = await getAssestMetadata()
    const getFirstValue = (category: string) => {
      const value = [...assetMetadata.values()].find((meta) => meta.category == category)
      if(value) return value
    }
    console.log("ASSET METADATA")
    console.log(assetMetadata)
    const body = getFirstValue("Body")?.id || null
    const entry = getFirstValue("Entry")?.id || null
    const handle = getFirstValue("Handle")?.id || null
    const arr = [entry,body, handle].filter(element => element != null).sort((a,b) => a.localeCompare(b))
    console.log("INIT PARTS ARRAY")
    console.log(arr)
    console.log("CONFIGS:")
    console.log(configs)
    const config = configs.get(arr.join("-")) || null
    console.log("CONFIG FOUND:")
    console.log(config)
    set({
      initialized: true,
      configurations: configs,
      assetMetadata,
      activeSelection:{
        body,
        entry,
        handle
      },
      activeConfiguration: config
    })
  },
  configurations: null,
  assetMetadata: null,
  activeSelection:{
    body: null,
    entry: null,
    handle: null
  },
  activeConfiguration: null,
  setActiveSelection: (assetId, category) => {
    if(category === "Body"){
      set((state) => ({
        activeSelection:{
          ...state.activeSelection,
          body: assetId
        }
      }))
    } else if(category === "Handle"){
      set((state) => ({
        activeSelection:{
          ...state.activeSelection,
          handle: assetId
        }
      }))
    } else if(category === "Entry"){
      set((state) => ({
        activeSelection:{
          ...state.activeSelection,
          entry: assetId
        }
      }))
    }else {
      console.log("INVALID CATEGORY")
      return
    }
  }
}))