import { allDocs, type Doc } from "contentlayer/generated";

export function getDocBySlug(slug: string[]): Doc | undefined {
  const slugPath = slug.join("/");
  return allDocs.find((doc: Doc) => doc.slug === slugPath);
}

export function getAllDocs(): Doc[] {
  return allDocs
    .filter((doc: Doc) => doc.published)
    .sort((a: Doc, b: Doc) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return a.title.localeCompare(b.title);
    });
}

export function getDocsByCategory(category: string): Doc[] {
  return getAllDocs().filter((doc) => doc.category?.slug === category);
}

export function getAllCategories(): Array<{
  title: string;
  slug: string;
  count: number;
}> {
  const categoryMap = new Map<string, { title: string; count: number }>();

  allDocs.forEach((doc: Doc) => {
    if (doc.category) {
      const existing = categoryMap.get(doc.category.slug);
      if (existing) {
        existing.count++;
      } else {
        categoryMap.set(doc.category.slug, {
          title: doc.category.title,
          count: 1,
        });
      }
    }
  });

  return Array.from(categoryMap.entries()).map(([slug, { title, count }]) => ({
    slug,
    title,
    count,
  }));
}

export function getDocsBreadcrumb(
  slug: string[],
): Array<{ title: string; href: string }> {
  const breadcrumbs: Array<{ title: string; href: string }> = [
    { title: "Docs", href: "/docs" },
  ];

  let currentPath = "/docs";
  slug.forEach((segment, index) => {
    currentPath = `${currentPath}/${segment}`;
    const doc = getDocBySlug(slug.slice(0, index + 1));
    breadcrumbs.push({
      title: doc?.title || segment,
      href: currentPath,
    });
  });

  return breadcrumbs;
}

// Types for hierarchical structure
export type DocNode = {
  type: "doc";
  doc: Doc;
};

export type FolderNode = {
  type: "folder";
  name: string;
  path: string;
  children: (DocNode | FolderNode)[];
};

export type HierarchyNode = DocNode | FolderNode;

// Helper function to format folder names
function formatFolderName(name: string): string {
  return name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Build hierarchical structure from flat doc list
export function buildHierarchy(docs: Doc[]): Map<string, FolderNode> {
  const categoryMap = new Map<string, FolderNode>();

  docs.forEach((doc) => {
    if (!doc.category) return;

    const categorySlug = doc.category.slug;
    const categoryTitle = doc.category.title;

    // Get or create category root
    if (!categoryMap.has(categorySlug)) {
      categoryMap.set(categorySlug, {
        type: "folder",
        name: categoryTitle,
        path: categorySlug,
        children: [],
      });
    }

    const categoryRoot = categoryMap.get(categorySlug)!;

    // Parse the doc's path to find subfolders
    const pathParts = doc.slug.split("/");

    // If doc is directly in category (no subfolders)
    if (pathParts.length === 2) {
      categoryRoot.children.push({
        type: "doc",
        doc,
      });
    } else {
      // Doc is in a subfolder, build the path
      let currentFolder = categoryRoot;

      // Navigate/create folder structure (skip first part which is category, and last which is filename)
      for (let i = 1; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i];
        const folderPath = pathParts.slice(0, i + 1).join("/");

        let folder = currentFolder.children.find(
          (child): child is FolderNode =>
            child.type === "folder" && child.path === folderPath,
        );

        if (!folder) {
          folder = {
            type: "folder",
            name: formatFolderName(folderName),
            path: folderPath,
            children: [],
          };
          currentFolder.children.push(folder);
        }

        currentFolder = folder;
      }

      // Add the doc to the deepest folder
      currentFolder.children.push({
        type: "doc",
        doc,
      });
    }
  });

  return categoryMap;
}
