"use client";

import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import dataProvider from "@refinedev/simple-rest";
import type { ReactNode } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.fake-rest.refine.dev";

export function RefineProvider({ children }: { children: ReactNode }) {
  return (
    <Refine
      routerProvider={routerProvider}
      dataProvider={dataProvider(API_URL)}
      resources={[
        {
          name: "products",
          list: "/products",
          show: "/products/:id",
          create: "/products/create",
          edit: "/products/:id/edit",
        },
      ]}
      options={{
        syncWithLocation: true,
        warnWhenUnsavedChanges: true,
      }}
    >
      {children}
    </Refine>
  );
}
