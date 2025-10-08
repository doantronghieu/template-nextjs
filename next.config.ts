import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: process.cwd(),
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
};

export default withContentlayer(nextConfig);
