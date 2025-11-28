import Link from "next/link";
import { redirect } from "next/navigation";
import { PlusCircle, Activity } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getServerAuthSession } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";

const previousEntries = [
  {
    id: "demo-1",
    title: "Baseline panel",
    date: "2024-03-10",
    status: "Complete"
  },
  {
    id: "demo-2",
    title: "Follow-up panel",
    date: "2024-01-08",
    status: "Pending review"
  }
];

export default async function DashboardPage() {
  const session = await getServerAuthSession();
  if (!session?.user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-8">
      <div>
        <Badge variant="secondary" className="px-4 py-1 text-xs uppercase tracking-wide">
          Welcome, {session.user.name ?? "friend"}
        </Badge>
        <h1 className="mt-4 text-3xl font-semibold">Your dashboard</h1>
        <p className="text-muted-foreground">
          Start a new lab entry or revisit previous records to spot trends over time.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>New lab entry</CardTitle>
              <CardDescription>Capture a fresh panel and receive instant guidance.</CardDescription>
            </div>
            <PlusCircle className="h-10 w-10 text-primary" />
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="rounded-full">
              <Link href="/labs/new">Start now</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Previous entries</CardTitle>
              <CardDescription>History is coming soon. Here&apos;s a preview.</CardDescription>
            </div>
            <Activity className="h-10 w-10 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {previousEntries.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between rounded-2xl border px-4 py-3">
                <div>
                  <p className="font-semibold text-foreground">{entry.title}</p>
                  <p className="text-xs">{new Date(entry.date).toLocaleDateString()}</p>
                </div>
                <Badge variant="secondary">{entry.status}</Badge>
              </div>
            ))}
            <p className="text-xs text-muted-foreground">
              Connect to your LIMS or manual uploads will appear here in future releases.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
