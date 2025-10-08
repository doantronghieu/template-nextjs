"use client";

import { useMDXComponent } from "next-contentlayer/hooks";
import { useMDXComponents } from "@/components/docs/mdx-components";

interface MdxContentProps {
  code: string;
}

export function MdxContent({ code }: MdxContentProps) {
  const Component = useMDXComponent(code);
  const components = useMDXComponents({});

  return (
    <div className="mdx-content">
      <Component components={components} />
    </div>
  );
}
