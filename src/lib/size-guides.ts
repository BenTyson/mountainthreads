// Size guide data from mountainthreads.com/page/apparel_size_guides

export type SizeGuideItem = "jacket" | "pants";
export type SizeGuideClothingType = "mens" | "womens";

export interface SizeGuideRow {
  size: string;
  [key: string]: string;
}

export interface SizeGuide {
  title: string;
  columns: { key: string; label: string }[];
  rows: SizeGuideRow[];
  note?: string;
}

// Men's Jackets
const mensJackets: SizeGuide = {
  title: "Men's Jacket Sizing",
  columns: [
    { key: "size", label: "Size" },
    { key: "chest", label: "Chest (in)" },
    { key: "sleeve", label: "Sleeve (in)" },
  ],
  rows: [
    { size: "S", chest: "36-38", sleeve: "35.5" },
    { size: "M", chest: "39-41", sleeve: "36" },
    { size: "L", chest: "42-44", sleeve: "36.5" },
    { size: "XL", chest: "45-47", sleeve: "37" },
    { size: "2XL", chest: "48-51", sleeve: "38" },
    { size: "3XL", chest: "52-55", sleeve: "39" },
    { size: "4XL", chest: "58-60", sleeve: "40" },
  ],
};

// Men's Pants
const mensPants: SizeGuide = {
  title: "Men's Pants Sizing",
  columns: [
    { key: "size", label: "Size" },
    { key: "waist", label: "Waist (in)" },
    { key: "inseam", label: "Inseam (in)" },
  ],
  rows: [
    { size: "S", waist: "30-32", inseam: "32" },
    { size: "M", waist: "33-35", inseam: "32" },
    { size: "L", waist: "36-38", inseam: "32" },
    { size: "XL", waist: "39-42", inseam: "32" },
    { size: "2XL", waist: "43-46", inseam: "32" },
    { size: "3XL", waist: "47-50", inseam: "32.5" },
    { size: "4XL", waist: "51-53", inseam: "32.5" },
    { size: "5XL", waist: "54-56", inseam: "32.5" },
  ],
};

// Women's Jackets
const womensJackets: SizeGuide = {
  title: "Women's Jacket Sizing",
  columns: [
    { key: "size", label: "Size" },
    { key: "chest", label: "Chest (in)" },
    { key: "sleeve", label: "Sleeve (in)" },
  ],
  rows: [
    { size: "S", chest: "34-36", sleeve: "34" },
    { size: "M", chest: "36.5-38.5", sleeve: "34.5" },
    { size: "L", chest: "39-41", sleeve: "35" },
    { size: "XL", chest: "41.5-45", sleeve: "35" },
  ],
};

// Women's Pants
const womensPants: SizeGuide = {
  title: "Women's Pants Sizing",
  columns: [
    { key: "size", label: "Size" },
    { key: "waist", label: "Waist (in)" },
    { key: "hip", label: "Hip (in)" },
    { key: "inseam", label: "Inseam (in)" },
  ],
  rows: [
    { size: "XS", waist: "26-28", hip: "34-36", inseam: "31" },
    { size: "S", waist: "28-30", hip: "36-38", inseam: "31" },
    { size: "M", waist: "30-32", hip: "38-40", inseam: "31.5" },
    { size: "L", waist: "32-34", hip: "40-43", inseam: "32" },
    { size: "XL", waist: "34-36", hip: "43-46", inseam: "32" },
    { size: "2XL", waist: "37-38", hip: "47-49", inseam: "32" },
    { size: "3XL", waist: "39-40", hip: "50-52", inseam: "32" },
  ],
};

// Size guide lookup map
const sizeGuides: Record<SizeGuideClothingType, Record<SizeGuideItem, SizeGuide>> = {
  mens: {
    jacket: mensJackets,
    pants: mensPants,
  },
  womens: {
    jacket: womensJackets,
    pants: womensPants,
  },
};

/**
 * Get the size guide for a specific clothing type and item
 * Returns undefined if no guide exists (e.g., youth, toddler, or other items)
 */
export function getSizeGuide(
  clothingType: string,
  item: SizeGuideItem
): SizeGuide | undefined {
  if (clothingType !== "mens" && clothingType !== "womens") {
    return undefined;
  }
  return sizeGuides[clothingType]?.[item];
}

/**
 * Check if a size guide exists for the given combination
 */
export function hasSizeGuide(clothingType: string, item: SizeGuideItem): boolean {
  return getSizeGuide(clothingType, item) !== undefined;
}
