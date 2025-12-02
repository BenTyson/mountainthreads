// Size guide data from mountainthreads.com/page/apparel_size_guides

export type SizeGuideItem = "jacket" | "pants" | "gloves" | "helmet";
export type SizeGuideClothingType = "mens" | "womens" | "youth";

export interface SizeGuideRow {
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

// Men's Gloves
const mensGloves: SizeGuide = {
  title: "Men's Glove Size Guide",
  columns: [
    { key: "measurement", label: "" },
    { key: "S", label: "Small" },
    { key: "M", label: "Medium" },
    { key: "L", label: "Large" },
    { key: "XL", label: "XL" },
  ],
  rows: [
    { measurement: "Circumference (in)", S: "7.5-8", M: "8-8.5", L: "8.5-9", XL: "9-10" },
    { measurement: "Length (in)", S: "6.9-7.5", M: "7.3-7.9", L: "7.7-8.3", XL: "8.1-8.7" },
    { measurement: "Width (in)", S: "3.1", M: "3.1", L: "3.5", XL: "3.9" },
  ],
};

// Women's Gloves
const womensGloves: SizeGuide = {
  title: "Women's Glove/Mitten Size Guide",
  columns: [
    { key: "measurement", label: "" },
    { key: "S", label: "Small" },
    { key: "M", label: "Medium" },
    { key: "L", label: "Large" },
  ],
  rows: [
    { measurement: "Circumference (in)", S: "6.5-7", M: "7-7.5", L: "7.5-8" },
    { measurement: "Length (in)", S: "6.1-6.7", M: "6.5-7.1", L: "6.9-7.5" },
    { measurement: "Width (in)", S: "2.7", M: "2.7", L: "3.1" },
  ],
};

// Youth/Kids Gloves
const youthGloves: SizeGuide = {
  title: "Kids Glove/Mitten Size Guide",
  columns: [
    { key: "measurement", label: "" },
    { key: "XS", label: "XS" },
    { key: "S", label: "Small" },
    { key: "M", label: "Medium" },
    { key: "L", label: "Large" },
    { key: "XL", label: "XL" },
  ],
  rows: [
    { measurement: "Age", XS: "Under 5", S: "6", M: "7-8", L: "9-10", XL: "11-12" },
    { measurement: "Circumference (in)", XS: "4.5-5", S: "5-5.5", M: "5.5-6", L: "6-6.5", XL: "6.5-7" },
    { measurement: "Length (in)", XS: "4.5-5.1", S: "4.9-5.5", M: "5.3-5.9", L: "5.7-6.3", XL: "6.1-6.7" },
  ],
};

// Helmet Size Guide (universal)
const helmetGuide: SizeGuide = {
  title: "Helmet Size Guide",
  columns: [
    { key: "measurement", label: "" },
    { key: "S", label: "Small" },
    { key: "M", label: "Medium" },
    { key: "L", label: "Large" },
    { key: "XL", label: "XL" },
  ],
  rows: [
    { measurement: "In Inches", S: "19-20½", M: "20½-23", L: "22-24", XL: "23⅗-24⅘" },
    { measurement: "Hat Size", S: "6-6¾", M: "6¾-7⅜", L: "7⅛-7⅝", XL: "7½-8" },
  ],
};

// Size guide lookup map
const sizeGuides: Record<SizeGuideClothingType, Partial<Record<SizeGuideItem, SizeGuide>>> = {
  mens: {
    jacket: mensJackets,
    pants: mensPants,
    gloves: mensGloves,
    helmet: helmetGuide,
  },
  womens: {
    jacket: womensJackets,
    pants: womensPants,
    gloves: womensGloves,
    helmet: helmetGuide,
  },
  youth: {
    gloves: youthGloves,
    helmet: helmetGuide,
  },
};

/**
 * Get the size guide for a specific clothing type and item
 * Returns undefined if no guide exists (e.g., toddler or other items without guides)
 */
export function getSizeGuide(
  clothingType: string,
  item: SizeGuideItem
): SizeGuide | undefined {
  if (clothingType !== "mens" && clothingType !== "womens" && clothingType !== "youth") {
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
