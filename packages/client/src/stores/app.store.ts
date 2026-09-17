import { create } from "zustand";
import { getConfigurations } from "../api/configurations.api";
import type { Assets, Configurations } from "../api/types";
import { getAssests } from "../api/assets.api";

type State = {
  initialized: boolean,
  configurations: Configurations,
  assets: Assets,
  activeBody: string | null
}

type Action = {
  initialize: () => Promise<void>,
  setActiveBody: (bodyHash: string) => void
}

export const useAppStore = create<State & Action>((set) => ({
  initialized: false,
  initialize:  async() => {
    const configs = await getConfigurations()
    const assets = await getAssests()
    set({
      initialized: true,
      configurations:[...configs],
      assets: [...assets]
    })
  },
  activeBody: null,
  configurations:[],
  assets:[],
  setActiveBody: (hash) => set({activeBody: hash})
}))