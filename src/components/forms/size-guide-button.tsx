"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SizeGuideModal } from "./size-guide-modal";
import { getSizeGuide, hasSizeGuide, type SizeGuideItem } from "@/lib/size-guides";

interface SizeGuideButtonProps {
  clothingType: string;
  item: SizeGuideItem;
}

export function SizeGuideButton({ clothingType, item }: SizeGuideButtonProps) {
  const [open, setOpen] = useState(false);

  // Don't render if no guide exists for this combination
  if (!hasSizeGuide(clothingType, item)) {
    return null;
  }

  const guide = getSizeGuide(clothingType, item);
  if (!guide) return null;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-foreground"
        onClick={() => setOpen(true)}
        title="View size guide"
      >
        <HelpCircle className="h-4 w-4" />
      </Button>
      <SizeGuideModal open={open} onOpenChange={setOpen} guide={guide} />
    </>
  );
}
