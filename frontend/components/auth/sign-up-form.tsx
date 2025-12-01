"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";

// --- Zod schema for the *form inputs* (all strings) ---
const signUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),

  age: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        (!Number.isNaN(Number(val)) &&
          Number(val) >= 0 &&
          Number(val) <= 120),
      { message: "Age must be between 0 and 120" }
    ),

  sex: z.enum(["female", "male"]).optional(),
  country: z.string().optional(),

  // "yes" / "no" in the UI; we'll convert to boolean in onSubmit
  pregnant: z.enum(["yes", "no"]).optional(),
});

type SignUpValues = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: "",
      sex: undefined,
      country: "",
      pregnant: "no",
    },
  });

  const onSubmit = (values: SignUpValues) => {
    setError(null);

    // Convert string fields into the types your backend expects
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      age: values.age ? Number(values.age) : undefined,
      sex: values.sex, // "male" | "female" | undefined
      country: values.country || undefined,
      pregnant:
        values.pregnant === "yes"
          ? true
          : values.pregnant === "no"
          ? false
          : undefined,
    };

    startTransition(async () => {
      try {
        await api.post("/auth/register", payload);
        router.push("/sign-in?success=true");
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response
            ?.data?.error ??
          "Unable to create your account. Please try again.";
        setError(message);
      }
    });
  };

  const sexWatch = form.watch("sex");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane@hemovita.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Age (optional) */}
        <FormField
          control={form.control}
          name="age"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Age (optional)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  max={120}
                  placeholder="e.g. 28"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Sex (male / female) */}
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sex</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? undefined : e.target.value)
                  }
                >
                  <option value="">Select…</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country (optional) */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country (optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. United States" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Pregnancy (yes/no) */}
        <FormField
          control={form.control}
          name="pregnant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Are you currently pregnant? (optional)</FormLabel>
              <FormControl>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value="yes"
                      // Disable "yes" unless sex is explicitly female
                      disabled={sexWatch !== "female"}
                      checked={field.value === "yes"}
                      onChange={() => field.onChange("yes")}
                    />
                    Yes
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      value="no"
                      checked={field.value === "no"}
                      onChange={() => field.onChange("no")}
                    />
                    No
                  </label>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Creating..." : "Create my account"}
        </Button>
      </form>
    </Form>
  );
}
