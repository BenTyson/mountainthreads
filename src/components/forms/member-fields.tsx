"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { SizeGuideButton } from "./size-guide-button";
import {
  CLOTHING_TYPES,
  SHOE_SIZES,
  JACKET_SIZES,
  PANT_SIZES,
  BIB_SIZES,
  TODDLER_SET_SIZES,
  HANDWEAR_TYPES,
  GLOVE_SIZES,
  GOGGLE_OPTIONS,
  HELMET_SIZES,
  YOUTH_HELMET_KID_SIZES,
  YOUTH_HELMET_ADULT_SIZES,
  PAYMENT_OPTIONS,
  YOUTH_GENDERS,
  usesPants,
  hasHandwearChoice,
  getSizingLabel,
  type ClothingType,
  type YouthGender,
  type HandwearType,
} from "@/lib/form-options";

export interface MemberData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  clothingType: ClothingType | "";
  youthGender: YouthGender | "";
  shoeSize: string;
  jacketSize: string;
  pantSize: string;
  bibSize: string;
  toddlerSetSize: string;
  handwearType: HandwearType | "";
  gloveSize: string;
  goggles: string;
  helmetSize: string;
  sizingNotes: string;
  paymentMethod: string;
}

export const emptyMemberData: MemberData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  clothingType: "",
  youthGender: "",
  shoeSize: "",
  jacketSize: "",
  pantSize: "",
  bibSize: "",
  toddlerSetSize: "",
  handwearType: "",
  gloveSize: "",
  goggles: "",
  helmetSize: "",
  sizingNotes: "",
  paymentMethod: "",
};

interface MemberFieldsProps {
  data: MemberData;
  onChange: (data: MemberData) => void;
  onRemove?: () => void;
  showRemove?: boolean;
  title?: string;
  showPayment?: boolean;
  emailRequired?: boolean;
}

export function MemberFields({
  data,
  onChange,
  onRemove,
  showRemove = false,
  title,
  showPayment = true,
  emailRequired = true,
}: MemberFieldsProps) {
  const update = (field: keyof MemberData, value: string) => {
    const newData = { ...data, [field]: value };
    // Reset size fields when clothing type changes
    if (field === "clothingType") {
      newData.youthGender = "";
      newData.shoeSize = "";
      newData.jacketSize = "";
      newData.pantSize = "";
      newData.bibSize = "";
      newData.toddlerSetSize = "";
      newData.handwearType = "";
      newData.gloveSize = "";
      newData.helmetSize = "";
    }
    // Reset jacket/pant sizes when youth gender changes
    if (field === "youthGender") {
      newData.jacketSize = "";
      newData.pantSize = "";
    }
    onChange(newData);
  };

  const clothingType = data.clothingType as ClothingType;
  const youthGender = data.youthGender as YouthGender;
  const isYouth = clothingType === "youth";
  const isToddler = clothingType === "toddler";
  const showPants = clothingType && usesPants(clothingType);
  const showBibs = clothingType === "youth"; // Only youth gets bibs, toddlers get toddler set
  const sizingLabel = clothingType ? getSizingLabel(clothingType, youthGender) : "";

  // For youth, require gender selection before showing other sizing options
  const showSizingFields = clothingType && (clothingType !== "youth" || youthGender);

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-background">
      {(title || showRemove) && (
        <div className="flex items-center justify-between">
          {title && <h4 className="font-medium">{title}</h4>}
          {showRemove && onRemove && (
            <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      )}

      {/* Personal Info */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Personal Information
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>First Name *</Label>
            <Input
              value={data.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name *</Label>
            <Input
              value={data.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              required
            />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Email {emailRequired && "*"}</Label>
            <Input
              type="email"
              value={data.email}
              onChange={(e) => update("email", e.target.value)}
              required={emailRequired}
              placeholder={emailRequired ? undefined : "Optional"}
            />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Clothing Type */}
      <div className="space-y-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
          Sizing Information
        </p>
        <p className="text-sm text-muted-foreground -mt-2">
          Please select those that apply
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Clothing Type</Label>
            <Select value={data.clothingType} onValueChange={(v) => update("clothingType", v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select clothing type" />
              </SelectTrigger>
              <SelectContent>
                {CLOTHING_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isYouth && (
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select value={data.youthGender} onValueChange={(v) => update("youthGender", v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {YOUTH_GENDERS.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {showSizingFields && (
          <>
            {/* Row 1: Jacket + Pant (mens/womens) OR Jacket + Bib (youth) OR Toddler Set alone */}
            <div className="grid gap-4 sm:grid-cols-2">
              {!isToddler && (
                <div className="space-y-2">
                  <Label className="inline-flex items-center">
                    Jacket Size
                    <SizeGuideButton clothingType={clothingType} item="jacket" />
                  </Label>
                  <Select value={data.jacketSize} onValueChange={(v) => update("jacketSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {sizingLabel}
                      </div>
                      {JACKET_SIZES[clothingType]?.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {isToddler && (
                <div className="space-y-2">
                  <Label>Toddler Set Size <span className="text-muted-foreground font-normal">(Jacket & Bibs)</span></Label>
                  <Select value={data.toddlerSetSize} onValueChange={(v) => update("toddlerSetSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        Toddler Sizes
                      </div>
                      {TODDLER_SET_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showPants && (
                <div className="space-y-2">
                  <Label className="inline-flex items-center">
                    Pant Size
                    <SizeGuideButton clothingType={clothingType} item="pants" />
                  </Label>
                  <Select value={data.pantSize} onValueChange={(v) => update("pantSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {sizingLabel}
                      </div>
                      {PANT_SIZES[clothingType as "mens" | "womens"].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              {showBibs && (
                <div className="space-y-2">
                  <Label>Bib Size</Label>
                  <Select value={data.bibSize} onValueChange={(v) => update("bibSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {sizingLabel}
                      </div>
                      {BIB_SIZES.youth.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Row 2: Gloves - either choice+size (youth/toddler) or just size+helmet (mens/womens) */}
            <div className="grid gap-4 sm:grid-cols-2">
              {hasHandwearChoice(clothingType) ? (
                <>
                  <div className="space-y-2">
                    <Label>Gloves or Mittens?</Label>
                    <Select value={data.handwearType} onValueChange={(v) => update("handwearType", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {HANDWEAR_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center">
                      {data.handwearType === "mittens" ? "Mitten Size" : "Glove Size"}
                      <SizeGuideButton clothingType={clothingType} item="gloves" />
                    </Label>
                    <Select value={data.gloveSize} onValueChange={(v) => update("gloveSize", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {sizingLabel}
                        </div>
                        {GLOVE_SIZES[clothingType].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center">
                      Glove Size
                      <SizeGuideButton clothingType={clothingType} item="gloves" />
                    </Label>
                    <Select value={data.gloveSize} onValueChange={(v) => update("gloveSize", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {sizingLabel}
                        </div>
                        {GLOVE_SIZES[clothingType].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="inline-flex items-center">
                      Helmet Size
                      <SizeGuideButton clothingType={clothingType} item="helmet" />
                    </Label>
                    <Select value={data.helmetSize} onValueChange={(v) => update("helmetSize", v)}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                          {sizingLabel}
                        </div>
                        {HELMET_SIZES[clothingType].map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            {/* Row 3: Goggles + Boot Size (mens/womens) OR Goggles + Helmet Size (youth/toddler) */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Goggles</Label>
                <Select value={data.goggles} onValueChange={(v) => update("goggles", v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {GOGGLE_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {hasHandwearChoice(clothingType) ? (
                <div className="space-y-2">
                  <Label className="inline-flex items-center">
                    Helmet Size
                    <SizeGuideButton clothingType={clothingType} item="helmet" />
                  </Label>
                  <Select value={data.helmetSize} onValueChange={(v) => update("helmetSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {isYouth ? (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Kid Helmets
                          </div>
                          {YOUTH_HELMET_KID_SIZES.map((size) => (
                            <SelectItem key={`kid-${size}`} value={`kid-${size}`}>
                              {size}
                            </SelectItem>
                          ))}
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            Adult Helmets
                          </div>
                          {YOUTH_HELMET_ADULT_SIZES.map((size) => (
                            <SelectItem key={`adult-${size}`} value={`adult-${size}`}>
                              {size}
                            </SelectItem>
                          ))}
                        </>
                      ) : (
                        <>
                          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                            {sizingLabel}
                          </div>
                          {HELMET_SIZES[clothingType].map((size) => (
                            <SelectItem key={size} value={size}>
                              {size}
                            </SelectItem>
                          ))}
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label>Boot Size</Label>
                  <Select value={data.shoeSize} onValueChange={(v) => update("shoeSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {sizingLabel}
                      </div>
                      {SHOE_SIZES[clothingType].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Row 4: Boot Size - only for youth/toddler (mens/womens have it paired with goggles above) */}
            {hasHandwearChoice(clothingType) && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Boot Size</Label>
                  <Select value={data.shoeSize} onValueChange={(v) => update("shoeSize", v)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                        {sizingLabel}
                      </div>
                      {SHOE_SIZES[clothingType].map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </>
        )}

        <div className="space-y-2">
          <Label>Sizing Questions or Concerns</Label>
          <Textarea
            placeholder="Any special sizing needs or questions..."
            value={data.sizingNotes}
            onChange={(e) => update("sizingNotes", e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Payment */}
      {showPayment && (
        <div className="space-y-2">
          <Label>How will you be paying?</Label>
          <Select value={data.paymentMethod} onValueChange={(v) => update("paymentMethod", v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
