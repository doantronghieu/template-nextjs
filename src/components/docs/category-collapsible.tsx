import { ChevronRight, FileText, FolderOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DocCard } from "./doc-card";
import type { Doc } from "contentlayer/generated";
import type { HierarchyNode, FolderNode } from "@/lib/docs";

interface CategoryCollapsibleProps {
  node: HierarchyNode;
  level?: number;
}

function countDocs(node: FolderNode): number {
  return node.children.reduce((count, child) => {
    if (child.type === "doc") return count + 1;
    return count + countDocs(child);
  }, 0);
}

export function CategoryCollapsible({
  node,
  level = 0,
}: CategoryCollapsibleProps) {
  if (node.type === "doc") {
    return <DocCard doc={node.doc} />;
  }

  const docCount = countDocs(node);

  return (
    <Collapsible key={node.path} defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
          <ChevronRight className="h-5 w-5 transition-transform group-data-[state=open]:rotate-90" />
          {level === 0 ? (
            <FileText className="h-5 w-5" />
          ) : (
            <FolderOpen className="h-5 w-5" />
          )}
          <h3
            className={
              level === 0 ? "text-xl font-semibold" : "text-lg font-medium"
            }
          >
            {node.name}
          </h3>
          <Badge variant="outline">{docCount}</Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 ml-8 mt-3">
          {node.children.map((child) => (
            <CategoryCollapsible
              key={child.type === "doc" ? child.doc.slug : child.path}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

interface UncategorizedSectionProps {
  docs: Doc[];
}

export function UncategorizedSection({ docs }: UncategorizedSectionProps) {
  const uncategorizedDocs = docs.filter((doc) => !doc.category);

  if (uncategorizedDocs.length === 0) return null;

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 hover:bg-accent rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
          <ChevronRight className="h-5 w-5 transition-transform group-data-[state=open]:rotate-90" />
          <FileText className="h-5 w-5" />
          <h3 className="text-xl font-semibold">Other</h3>
          <Badge variant="outline">{uncategorizedDocs.length}</Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="flex flex-col gap-3 ml-8 mt-3">
          {uncategorizedDocs.map((doc) => (
            <DocCard key={doc.slug} doc={doc} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
