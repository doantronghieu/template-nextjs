"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-background">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-6" />

      <div className="flex flex-1 items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
        >
          <Home className="h-4 w-4" />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <SignedOut>
            <SignInButton>
              <Button
                variant="outline"
                size="default"
                className="rounded-full sm:h-10 sm:px-5"
              >
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton>
              <Button
                size="default"
                className="rounded-full sm:h-10 sm:px-5 bg-[#6c47ff] hover:bg-[#5a3ad1]"
              >
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 sm:h-10 sm:w-10 cursor-pointer hover:opacity-90 transition-opacity",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
