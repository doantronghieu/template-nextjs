import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { CodeBlock } from "./code-block";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }: { children?: ReactNode }) => (
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mb-4">
        {children}
      </h1>
    ),
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0 mt-10 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
        {children}
      </h3>
    ),
    h4: ({ children }: { children?: ReactNode }) => (
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-3">
        {children}
      </h4>
    ),
    p: ({ children }: { children?: ReactNode }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>
    ),
    ul: ({ children }: { children?: ReactNode }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2">{children}</ul>
    ),
    ol: ({ children }: { children?: ReactNode }) => (
      <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">{children}</ol>
    ),
    li: ({ children }: { children?: ReactNode }) => (
      <li className="mt-2">{children}</li>
    ),
    blockquote: ({ children }: { children?: ReactNode }) => (
      <blockquote className="mt-6 border-l-2 pl-6 italic">
        {children}
      </blockquote>
    ),
    code: ({
      children,
      className,
    }: {
      children?: ReactNode;
      className?: string;
    }) => {
      const isInline = !className;
      return isInline ? (
        <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {children}
        </code>
      ) : (
        <code className={className}>{children}</code>
      );
    },
    pre: ({ children }: { children?: ReactNode }) => (
      <CodeBlock>{children}</CodeBlock>
    ),
    a: ({ href, children }: { href?: string; children?: ReactNode }) => {
      const isExternal = href?.startsWith("http");
      const Component = isExternal ? "a" : Link;
      return (
        <Component
          href={href || "#"}
          className="font-medium underline underline-offset-4"
          {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {children}
        </Component>
      );
    },
    table: ({ children }: { children?: ReactNode }) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className="w-full">{children}</table>
      </div>
    ),
    thead: ({ children }: { children?: ReactNode }) => (
      <thead>{children}</thead>
    ),
    tbody: ({ children }: { children?: ReactNode }) => (
      <tbody>{children}</tbody>
    ),
    tr: ({ children }: { children?: ReactNode }) => (
      <tr className="m-0 border-t p-0 even:bg-muted">{children}</tr>
    ),
    th: ({ children }: { children?: ReactNode }) => (
      <th className="border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </th>
    ),
    td: ({ children }: { children?: ReactNode }) => (
      <td className="border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right">
        {children}
      </td>
    ),
    hr: () => <hr className="my-8" />,
    ...components,
  };
}
