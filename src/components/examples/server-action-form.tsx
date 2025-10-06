"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// Define form schema
const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Example server action type
type ServerActionResult = {
  success: boolean;
  message?: string;
};

interface ServerActionFormProps {
  action: (
    prev: ServerActionResult | null,
    data: FormData,
  ) => Promise<ServerActionResult>;
}

export function ServerActionForm({ action }: ServerActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formAction(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {state?.message && (
          <p
            className={
              state.success
                ? "text-green-600 text-sm"
                : "text-destructive text-sm"
            }
          >
            {state.message}
          </p>
        )}

        <Button type="submit" disabled={isPending}>
          {isPending ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
}
