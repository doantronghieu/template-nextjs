import { allDocs } from "contentlayer/generated";
import { FileText } from "lucide-react";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import {
  CategoryCollapsible,
  UncategorizedSection,
} from "@/components/docs/category-collapsible";
import { DocCard } from "@/components/docs/doc-card";
import { DocHeader } from "@/components/docs/doc-header";
import { MdxContent } from "@/components/docs/mdx-content";
import {
  buildHierarchy,
  getAllDocs,
  getDocBySlug,
  getDocsBreadcrumb,
} from "@/lib/docs";

interface DocPageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  return [
    { slug: undefined }, // For the listing page at /docs
    ...allDocs.map((doc: { slug: string }) => ({
      slug: doc.slug.split("/"),
    })),
  ];
}

export async function generateMetadata({ params }: DocPageProps) {
  const { slug = [] } = await params;

  if (slug.length === 0) {
    return {
      title: "Documentation",
      description: "Browse all educational content and tutorials",
    };
  }

  const doc = getDocBySlug(slug);

  if (!doc) {
    return {};
  }

  return {
    title: doc.title,
    description: doc.description,
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug = [] } = await params;

  // If no slug, show the listing page
  if (slug.length === 0) {
    const allDocs = getAllDocs();
    const hierarchy = buildHierarchy(allDocs);

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground">
            Browse all educational content and tutorials
          </p>
        </div>

        {/* All Documents Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <FileText className="mr-2 h-6 w-6" />
            All Documents
          </h2>

          {hierarchy.size > 0 ? (
            <div className="flex flex-col gap-4">
              {Array.from(hierarchy.values()).map((categoryNode) => (
                <CategoryCollapsible
                  key={categoryNode.path}
                  node={categoryNode}
                />
              ))}
              <UncategorizedSection docs={allDocs} />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {allDocs.map((doc) => (
                <DocCard key={doc.slug} doc={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Otherwise, show individual document
  const doc = getDocBySlug(slug);

  if (!doc) {
    notFound();
  }

  const breadcrumbs = getDocsBreadcrumb(slug);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbs} />
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <DocHeader doc={doc} />
        <MdxContent code={doc.body.code} />
      </article>
    </div>
  );
}
