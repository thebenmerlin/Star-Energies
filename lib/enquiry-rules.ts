export const enquiryCompanyTypes = ["Factory", "Trader", "Broker", "Power Plant", "Brick Kiln", "Individual", "Other"] as const;
export type EnquiryCompanyType = (typeof enquiryCompanyTypes)[number];

export const enquiryRoles = ["Owner", "Partner", "Director", "Purchase Manager", "Procurement", "Sales Manager", "Broker / Agent", "Other"] as const;
export type EnquiryRole = (typeof enquiryRoles)[number];

export const enquiryRequirementFrequencies = ["One-time", "Regular"] as const;
export type EnquiryRequirementFrequency = (typeof enquiryRequirementFrequencies)[number];

export function rolesForCompanyType(companyType: EnquiryCompanyType | "") {
  if (companyType === "Broker") return ["Owner", "Partner", "Director", "Broker / Agent", "Other"] as const;
  if (companyType === "Individual") return ["Owner", "Other"] as const;
  return enquiryRoles.filter((role) => role !== "Broker / Agent");
}

/** A company or firm name is essential when a non-principal represents a business. */
export function requiresCompanyName(companyType: EnquiryCompanyType, role: EnquiryRole) {
  return companyType !== "Individual" && ["Purchase Manager", "Procurement", "Sales Manager"].includes(role);
}

export function companyNameTreatment(companyType: EnquiryCompanyType, role: EnquiryRole) {
  if (companyType === "Individual") return "hidden" as const;
  return requiresCompanyName(companyType, role) ? "required" as const : "optional" as const;
}
