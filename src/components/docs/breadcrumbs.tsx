import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface BreadcrumbItem {
  title: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
      {items.map((crumb, index) => (
        <div key={crumb.href} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-2" />}
          {index === 0 ? (
            <Link href={crumb.href} className="hover:text-foreground">
              {crumb.title}
            </Link>
          ) : index === items.length - 1 ? (
            <span className="text-foreground font-medium">{crumb.title}</span>
          ) : (
            <span>{crumb.title}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
