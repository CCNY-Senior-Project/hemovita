import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { LabForm } from "@/components/labs/lab-form";

export default async function NewLabEntryPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">New lab entry</h1>
        <p className="text-muted-foreground">
          Enter the markers from your latest bloodwork to generate personalised insights and follow-up actions.
        </p>
      </div>
      <LabForm />
    </div>
  );
}
