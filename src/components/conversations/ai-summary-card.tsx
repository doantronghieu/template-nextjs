"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface AISummaryCardProps {
  summary: string;
  updatedAt: string;
}

const STORAGE_KEY = "conversations-ai-summary-expanded";

export function AISummaryCard({ summary, updatedAt }: AISummaryCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  // Load expanded state from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) {
      setIsExpanded(stored === "true");
    }
  }, []);

  // Save expanded state to localStorage
  const handleOpenChange = (open: boolean) => {
    setIsExpanded(open);
    localStorage.setItem(STORAGE_KEY, String(open));
  };

  const relativeTime = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
  });

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={handleOpenChange}
      className="border-b bg-blue-50/50 dark:bg-blue-950/20"
    >
      <CollapsibleTrigger className="w-full px-4 py-3 flex items-center justify-between hover:bg-blue-100/50 dark:hover:bg-blue-900/20 transition-colors">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-foreground">
            AI Summary
          </span>
          <span className="text-xs text-muted-foreground">
            (updated {relativeTime})
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="px-4 pb-3 pt-1">
          <p className="text-sm text-foreground leading-relaxed">{summary}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
