"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface CopyLinkButtonProps {
  slug: string;
  type?: "leader" | "member";
  label?: string;
  className?: string;
}

export function CopyLinkButton({ slug, type = "member", label, className }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = async () => {
    const path = type === "leader" ? `/group/${slug}/leader` : `/group/${slug}`;
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const buttonLabel = label || (type === "leader" ? "Copy Leader Link" : "Copy Link");

  return (
    <Button variant="outline" size="sm" onClick={copyLink} className={className}>
      {copied ? (
        <>
          <Check className="mr-1 h-3 w-3" />
          Copied
        </>
      ) : (
        <>
          <Copy className="mr-1 h-3 w-3" />
          {buttonLabel}
        </>
      )}
    </Button>
  );
}
