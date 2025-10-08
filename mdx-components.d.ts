declare module "mdx/types" {
  import type { ReactElement, ReactNode } from "react";

  export type MDXComponents = {
    [key: string]: (props: any) => ReactElement | null;
  };
}
