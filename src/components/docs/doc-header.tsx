import { Badge } from "@/components/ui/badge";
import type { Doc } from "contentlayer/generated";

interface DocHeaderProps {
  doc: Doc;
}

export function DocHeader({ doc }: DocHeaderProps) {
  return (
    <div className="mb-8 not-prose">
      <h1 className="text-4xl font-bold tracking-tight mb-2">{doc.title}</h1>
      {doc.description && (
        <p className="text-xl text-muted-foreground">{doc.description}</p>
      )}
      {doc.tags && doc.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {doc.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
