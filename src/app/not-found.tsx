"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-full items-center justify-center p-8">
      <Card className="mx-auto max-w-xl text-center">
        <CardHeader className="items-center justify-center space-y-4">
          <FileQuestion className="mx-auto size-16 text-muted-foreground" />
          <CardTitle className="text-3xl sm:text-4xl">Page Not Found</CardTitle>
          <CardDescription className="text-base sm:text-lg">
            We couldn't find the page you're looking for.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => router.back()} variant="outline" size="lg">
            <ArrowLeft />
            Go Back
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
