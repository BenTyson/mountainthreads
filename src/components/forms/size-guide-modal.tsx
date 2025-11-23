"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SizeGuide } from "@/lib/size-guides";

interface SizeGuideModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  guide: SizeGuide;
}

export function SizeGuideModal({ open, onOpenChange, guide }: SizeGuideModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{guide.title}</DialogTitle>
        </DialogHeader>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                {guide.columns.map((col) => (
                  <TableHead key={col.key} className="text-center font-medium">
                    {col.label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {guide.rows.map((row, index) => (
                <TableRow key={index}>
                  {guide.columns.map((col) => (
                    <TableCell key={col.key} className="text-center">
                      {row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {guide.note && (
          <p className="text-sm text-muted-foreground mt-2">{guide.note}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
