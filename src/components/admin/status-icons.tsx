import { Circle, CircleCheck, Package, RotateCcw } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusIconsProps {
  paid: boolean;
  pickedUp: boolean;
  returned: boolean;
  size?: "sm" | "md";
}

export function StatusIcons({ paid, pickedUp, returned, size = "md" }: StatusIconsProps) {
  const iconSize = size === "sm" ? "h-4 w-4" : "h-5 w-5";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center gap-1.5">
        {/* Payment Status */}
        <Tooltip>
          <TooltipTrigger asChild>
            {paid ? (
              <CircleCheck className={`${iconSize} text-emerald-500`} />
            ) : (
              <Circle className={`${iconSize} text-amber-500`} />
            )}
          </TooltipTrigger>
          <TooltipContent>
            <p>{paid ? "Paid" : "Unpaid"}</p>
          </TooltipContent>
        </Tooltip>

        {/* Picked Up Status - only show if paid */}
        {paid && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Package
                className={`${iconSize} ${
                  pickedUp ? "text-primary" : "text-muted-foreground/40"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{pickedUp ? "Picked Up" : "Not Picked Up"}</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Returned Status - only show if picked up */}
        {pickedUp && (
          <Tooltip>
            <TooltipTrigger asChild>
              <RotateCcw
                className={`${iconSize} ${
                  returned ? "text-muted-foreground" : "text-muted-foreground/40"
                }`}
              />
            </TooltipTrigger>
            <TooltipContent>
              <p>{returned ? "Returned" : "Not Returned"}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  );
}
