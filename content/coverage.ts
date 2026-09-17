import type { CoverageRegion, QualityParameter, RequirementDimension } from "@/types/content";

export const coverageRegions = [
  { id: "maharashtra", name: "Maharashtra", label: "Maharashtra", state: "Maharashtra", experienceType: "industry-experience", active: true, displayOrder: 1, mapLabel: "MAHARASHTRA" },
  { id: "telangana-hyderabad", name: "Telangana / Hyderabad", label: "Telangana / Hyderabad", state: "Telangana", cityOrMarket: "Hyderabad", experienceType: "industry-experience", active: true, displayOrder: 2, mapLabel: "HYDERABAD" },
  { id: "andhra-visakhapatnam", name: "Andhra Pradesh / Visakhapatnam", label: "Andhra Pradesh / Visakhapatnam", state: "Andhra Pradesh", cityOrMarket: "Visakhapatnam", experienceType: "industry-experience", active: true, displayOrder: 3, mapLabel: "VISAKHAPATNAM" },
  { id: "karnataka", name: "Karnataka", label: "Karnataka", state: "Karnataka", experienceType: "industry-experience", active: true, displayOrder: 4, mapLabel: "KARNATAKA" },
  { id: "gujarat", name: "Gujarat", label: "Gujarat", state: "Gujarat", experienceType: "industry-experience", active: true, displayOrder: 5, mapLabel: "GUJARAT" },
] satisfies CoverageRegion[];

export const qualityParameters = [
  { id: "gcv", shortLabel: "GCV", name: "Gross Calorific Value", description: "as available / required", displayOrder: 1, active: true },
  { id: "grade", shortLabel: "GR", name: "Grade", description: "as applicable", displayOrder: 2, active: true },
  { id: "ash", shortLabel: "ASH", name: "Ash", description: "as available / required", displayOrder: 3, active: true },
  { id: "moisture", shortLabel: "MST", name: "Moisture", description: "as available / required", displayOrder: 4, active: true },
  { id: "sulphur", shortLabel: "SUL", name: "Sulphur", description: "where required / available", displayOrder: 5, active: true },
] satisfies QualityParameter[];

export const requirementDimensions = [
  { id: "grade", label: "Grade", detail: "Specify the coal grade appropriate to your operation.", displayOrder: 1 },
  { id: "size", label: "Size", detail: "Share the size fraction or handling requirement.", displayOrder: 2 },
  { id: "quantity", label: "Quantity", detail: "From an initial lot to sustained industrial demand.", displayOrder: 3 },
  { id: "destination", label: "Destination", detail: "Tell us where material needs to be delivered.", displayOrder: 4 },
] satisfies RequirementDimension[];
