import { create } from "zustand"

export const useStore = create(set => ({

  year: 2025,
  scenario: "bau",
  co2: 424,

  selectedLocation: null,

  setYear: (year)=>set({year}),
  setScenario: (scenario)=>set({scenario}),
  setCO2: (co2)=>set({co2}),
  setLocation: (selectedLocation)=>set({selectedLocation})

}))
