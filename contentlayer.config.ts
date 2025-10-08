import {
  defineDocumentType,
  defineNestedType,
  makeSource,
} from "contentlayer/source-files";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

const Category = defineNestedType(() => ({
  name: "Category",
  fields: {
    title: {
      type: "string",
      required: true,
    },
    slug: {
      type: "string",
      required: true,
    },
  },
}));

export const Doc = defineDocumentType(() => ({
  name: "Doc",
  filePathPattern: "**/*.mdx",
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the document",
      required: true,
    },
    description: {
      type: "string",
      description: "Brief description of the content",
    },
    published: {
      type: "boolean",
      default: true,
      description: "Whether the document is published",
    },
    order: {
      type: "number",
      description: "Order in the list (lower numbers first)",
    },
    category: {
      type: "nested",
      of: Category,
      description: "Category information",
    },
    tags: {
      type: "list",
      of: { type: "string" },
      description: "Tags for the document",
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (doc) => `/docs/${doc._raw.flattenedPath}`,
    },
    slug: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath,
    },
    slugAsParams: {
      type: "string",
      resolve: (doc) => doc._raw.flattenedPath.split("/").join("/"),
    },
  },
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Doc],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeHighlight, { ignoreMissing: true }]] as any,
  },
});
