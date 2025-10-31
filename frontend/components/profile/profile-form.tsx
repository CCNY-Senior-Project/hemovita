"use client";

import { useState, useTransition } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { updateProfileAction } from "@/app/profile/actions";

const profileFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  age: z.union([z.string(), z.number(), z.null(), z.undefined()]).transform((value) => {
    if (value == null || value === "") return "";
    const number = Number(value);
    return Number.isFinite(number) ? String(number) : "";
  }),
  sex: z.string().optional(),
  unitPreference: z.string().optional()
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileFormProps = {
  defaultValues: ProfileFormValues;
};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues
  });

  const onSubmit = (values: ProfileFormValues) => {
    setSuccess(null);
    setError(null);
    startTransition(async () => {
      try {
        await updateProfileAction({ name: values.name, email: values.email });
        setSuccess("Profile updated successfully.");
      } catch (err) {
        setError("Unable to update profile. Please try again.");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {success ? (
          <Alert variant="success">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        ) : null}
        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full name</FormLabel>
                <FormControl>
                  <Input placeholder="Jane Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age (optional)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} max={120} placeholder="32" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sex (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="Female" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="unitPreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred units</FormLabel>
              <FormControl>
                <Input placeholder="Metric" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
          <Button type="button" variant="ghost" className="text-destructive hover:text-destructive" disabled>
            Delete account (coming soon)
          </Button>
        </div>
      </form>
    </Form>
  );
}
