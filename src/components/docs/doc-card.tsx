import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Doc } from "contentlayer/generated";

const MAX_TAGS_DISPLAYED = 3;
const CARD_HOVER_CLASS =
  "hover:border-primary hover:bg-accent/50 transition-colors";

interface DocCardProps {
  doc: Doc;
}

export function DocCard({ doc }: DocCardProps) {
  return (
    <Link href={doc.url} className="block">
      <Card className={CARD_HOVER_CLASS}>
        <CardHeader>
          <CardTitle className="text-base">{doc.title}</CardTitle>
          {doc.description && (
            <CardDescription>{doc.description}</CardDescription>
          )}
          {doc.tags && doc.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {doc.tags.slice(0, MAX_TAGS_DISPLAYED).map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>
      </Card>
    </Link>
  );
}
