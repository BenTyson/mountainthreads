// Clothing type options
export const CLOTHING_TYPES = [
  { value: "mens", label: "Men's" },
  { value: "womens", label: "Women's" },
  { value: "youth", label: "Youth" },
  { value: "toddler", label: "Toddler" },
] as const;

export type ClothingType = (typeof CLOTHING_TYPES)[number]["value"];

// Gender options (for youth)
export const YOUTH_GENDERS = [
  { value: "boys", label: "Boys" },
  { value: "girls", label: "Girls" },
] as const;

export type YouthGender = (typeof YOUTH_GENDERS)[number]["value"];

// Get sizing label based on clothing type and gender
export function getSizingLabel(clothingType: ClothingType, gender?: YouthGender): string {
  if (clothingType === "mens") return "Men's Sizes";
  if (clothingType === "womens") return "Women's Sizes";
  if (clothingType === "toddler") return "Toddler Sizes";
  if (clothingType === "youth") {
    if (gender === "boys") return "Youth Boys Sizes";
    if (gender === "girls") return "Youth Girls Sizes";
    return "Youth Sizes";
  }
  return "";
}

// Shoe sizes by clothing type
export const SHOE_SIZES: Record<ClothingType, string[]> = {
  mens: ["7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "14", "15"],
  womens: ["5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12"],
  youth: ["1", "1.5", "2", "2.5", "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7"],
  toddler: ["4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
};

// Jacket sizes (same for all)
export const JACKET_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "Other"];

// Pant sizes (only for men's and women's)
export const PANT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// Bib sizes (only for youth and toddler)
export const BIB_SIZES: Record<"youth" | "toddler", string[]> = {
  youth: ["XS", "S", "M", "L", "XL"],
  toddler: ["2T", "3T", "4T", "5T/XXS"],
};

// Glove sizes by clothing type
export const GLOVE_SIZES: Record<ClothingType, string[]> = {
  mens: ["S", "M", "L", "XL", "Custom Size"],
  womens: ["S", "M", "L", "Custom Size"],
  youth: ["S", "M", "L", "Custom Size"],
  toddler: ["S", "M", "L", "Custom Size"],
};

// Goggle options
export const GOGGLE_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "over-glasses", label: "Over Glasses" },
];

// Helmet sizes by clothing type
export const HELMET_SIZES: Record<ClothingType, string[]> = {
  mens: ["S", "M", "L", "XL"],
  womens: ["S", "M", "L", "XL"],
  youth: ["XS", "S"],
  toddler: ["XS"],
};

// Payment options
export const PAYMENT_OPTIONS = [
  { value: "individually", label: "Individually" },
  { value: "family", label: "For my family members" },
  { value: "entire-group", label: "Entire Group" },
  { value: "someone-else", label: "Someone Else is Paying for me" },
];

// Helper to check if clothing type uses pants (vs bibs)
export function usesPants(clothingType: ClothingType): boolean {
  return clothingType === "mens" || clothingType === "womens";
}
