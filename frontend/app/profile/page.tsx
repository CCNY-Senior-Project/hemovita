import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/components/profile/profile-form";

export default async function ProfilePage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="mx-auto grid max-w-3xl gap-8">
      <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
        <CardHeader>
          <CardTitle>Your profile</CardTitle>
          <CardDescription>Update your contact details and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm
            defaultValues={{
              name: session.user.name ?? "",
              email: session.user.email,
              age: "",
              sex: "",
              unitPreference: "Metric"
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
