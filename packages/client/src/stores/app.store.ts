import { create } from "zustand";
import { getConfigurations } from "../api/configurations.api";
import type { AssetMetadata, Configuration } from "../api/types";
import { getAssestMetadata } from "../api/assets.api";

type State = {
  initialized: boolean,
  configurations: Map<Configuration["signature"][number],Configuration> | null,
  assetMetadata: Map<AssetMetadata['id'],AssetMetadata> | null,
  activeSelection: Map<AssetMetadata['category'], AssetMetadata['id']|null>
  activeConfiguration: Configuration | null
}

type Action = {
  initialize: () => Promise<void>,
  // setActiveSelection: (assetId: string, category: string) => void
  setActiveSelection: (updates: {category:AssetMetadata['category'], id: AssetMetadata['id']}[]) => void
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
    const body = getFirstValue("Body")?.id || null
    const entry = getFirstValue("Entry")?.id || null
    const handle = getFirstValue("Handle")?.id || null
    const arr = [entry,body, handle].filter(element => element != null).sort((a,b) => a.localeCompare(b))
    const config = configs.get(arr.join("-")) || null
    set({
      initialized: true,
      configurations: configs,
      assetMetadata,
      // activeSelection: new Map([
      //   ['body', body],
      //   ['entry', entry],
      //   ['handle', handle]
      // ]),
      // activeConfiguration: config
    })
  },
  configurations: null,
  assetMetadata: null,
  activeSelection: new Map(),
  activeConfiguration: null,
  setActiveSelection: (assetId, category) => {
    if(category === "Body"){
      set((state) => {
        const update = new Map(state.activeSelection)
        update.set('body', assetId)
        return { activeSelection: update }
      })
    } else if(category === "Handle"){
      set((state) => {
        const update = new Map(state.activeSelection)
        update.set('handle', assetId)
        return { activeSelection: update }
      })
    } else if(category === "Entry"){
      set((state) => {
        const update = new Map(state.activeSelection)
        update.set('entry', assetId)
        return { activeSelection: update }
      })
    }else {
      console.log("INVALID CATEGORY")
      return
    }
  }
}))