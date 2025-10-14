"use client";

import { Badge } from "@/components/ui/badge";

interface JsonViewerProps {
  data: unknown;
  level?: number;
}

export function JsonViewer({ data, level = 0 }: JsonViewerProps) {
  if (data === null || data === undefined) {
    return (
      <Badge variant="secondary" className="text-muted-foreground italic">
        null
      </Badge>
    );
  }

  if (typeof data === "boolean") {
    return (
      <Badge
        variant="default"
        className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      >
        {String(data)}
      </Badge>
    );
  }

  if (typeof data === "number") {
    return (
      <Badge
        variant="default"
        className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      >
        {data}
      </Badge>
    );
  }

  if (typeof data === "string") {
    return <span className="text-foreground">{data}</span>;
  }

  if (Array.isArray(data)) {
    return <JsonArray data={data} level={level} />;
  }

  if (typeof data === "object") {
    return <JsonObject data={data as Record<string, unknown>} level={level} />;
  }

  return <span>{String(data)}</span>;
}

function JsonObject({
  data,
  level,
}: {
  data: Record<string, unknown>;
  level: number;
}) {
  const entries = Object.entries(data);

  if (entries.length === 0) {
    return (
      <Badge variant="secondary" className="text-muted-foreground italic">
        empty
      </Badge>
    );
  }

  return (
    <div className={level > 0 ? "pl-3 border-l-2 border-muted" : ""}>
      <div className="space-y-2">
        {entries.map(([key, value]) => {
          const isNestedObject =
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value);
          const isArray = Array.isArray(value);

          return (
            <div key={key} className="space-y-2">
              <div
                className={`flex ${isNestedObject || isArray ? "flex-col gap-2" : "justify-between gap-2"}`}
              >
                <span className="text-xs font-medium text-muted-foreground">
                  {key}
                </span>
                {!isNestedObject && !isArray && (
                  <div className="text-sm font-medium">
                    <JsonViewer data={value} level={level + 1} />
                  </div>
                )}
              </div>
              {(isNestedObject || isArray) && (
                <div className="text-sm">
                  <JsonViewer data={value} level={level + 1} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function JsonArray({ data, level }: { data: unknown[]; level: number }) {
  if (data.length === 0) {
    return (
      <Badge variant="secondary" className="text-muted-foreground italic">
        empty
      </Badge>
    );
  }

  // Check if all items are primitives for compact display
  const allPrimitives = data.every(
    (item) => typeof item !== "object" || item === null,
  );

  if (allPrimitives) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {data.map((item, index) => (
          <Badge key={`primitive-${index}-${String(item)}`} variant="outline">
            <JsonViewer data={item} level={level + 1} />
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="pl-3 border-l-2 border-muted space-y-2">
      {data.map((item, index) => (
        <div key={`item-${index}-${level}`} className="space-y-1">
          <span className="text-xs font-medium text-muted-foreground">
            Item {index + 1}
          </span>
          <div className="text-sm">
            <JsonViewer data={item} level={level + 1} />
          </div>
        </div>
      ))}
    </div>
  );
}
