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

// Shoe sizes by clothing type (boot sizes - whole sizes only)
export const SHOE_SIZES: Record<ClothingType, string[]> = {
  mens: ["7", "8", "9", "10", "11", "12", "13", "14", "15"],
  womens: ["6", "7", "8", "9", "10", "11"],
  youth: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"],
  toddler: ["5T", "6T", "7T", "8T", "9T", "10T"],
};

// Jacket sizes by clothing type
export const JACKET_SIZES: Record<ClothingType, string[]> = {
  mens: ["S", "M", "L", "XL", "2XL", "3XL", "4XL"],
  womens: ["S", "M", "L", "XL", "2XL", "3XL"],
  youth: ["XS", "S", "M", "L", "XL"],
  toddler: ["XS", "S", "M", "L", "XL"],
};

// Pant sizes by clothing type (only for men's and women's)
export const PANT_SIZES: Record<"mens" | "womens", string[]> = {
  mens: ["S", "M", "L", "XL", "XXL", "2XL", "3XL", "4XL", "5XL", "Custom Size"],
  womens: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "Custom Size"],
};

// Bib sizes (only for youth)
export const BIB_SIZES: Record<"youth", string[]> = {
  youth: ["XS", "S", "M", "L", "XL"],
};

// Toddler Set sizes (combined jacket & bib)
export const TODDLER_SET_SIZES = ["12MO", "2T", "3T", "4T", "XXS"];

// Glove/Mitten type options (for women's and youth only)
export const HANDWEAR_TYPES = [
  { value: "gloves", label: "Gloves" },
  { value: "mittens", label: "Mittens" },
] as const;

export type HandwearType = (typeof HANDWEAR_TYPES)[number]["value"];

// Glove/Mitten sizes by clothing type
export const GLOVE_SIZES: Record<ClothingType, string[]> = {
  mens: ["S", "M", "L", "XL"],
  womens: ["S", "M", "L"],
  youth: ["S", "M", "L", "XL"],
  toddler: ["S", "M", "L", "XL"],
};

// Helper to check if clothing type can choose between gloves/mittens
export function hasHandwearChoice(clothingType: ClothingType): boolean {
  return clothingType === "womens" || clothingType === "youth";
}

// Goggle options
export const GOGGLE_OPTIONS = [
  { value: "standard", label: "Standard" },
  { value: "over-glasses", label: "Over Glasses" },
];

// Helmet sizes by clothing type
export const HELMET_SIZES: Record<ClothingType, string[]> = {
  mens: ["S", "M", "L", "XL"],
  womens: ["S", "M", "L", "XL"],
  youth: ["XS", "S", "S", "M", "L", "XL"], // First XS, S are kid sizes; second S, M, L, XL are adult sizes
  toddler: ["XS"],
};

// Youth helmet has two sections - kid and adult sizes
export const YOUTH_HELMET_KID_SIZES = ["XS", "S"];
export const YOUTH_HELMET_ADULT_SIZES = ["S", "M", "L", "XL"];

// Payment options
export const PAYMENT_OPTIONS = [
  { value: "individually", label: "Individually" },
  { value: "family", label: "For my crew" },
  { value: "entire-group", label: "For the entire group" },
  { value: "someone-else", label: "Someone else is paying for me" },
  { value: "not-sure", label: "I'm not sure" },
];

// Helper to check if clothing type uses pants (vs bibs)
export function usesPants(clothingType: ClothingType): boolean {
  return clothingType === "mens" || clothingType === "womens";
}
