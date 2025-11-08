import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const highlights = [
  "Evidence-informed reference ranges",
  "Actionable follow-up plan in seconds",
  "Secure account with NextAuth credentials"
];

export default function LandingPage() {
  return (
    <div className="relative w-full">
      <section className="mx-auto grid max-w-4xl gap-10 text-center">
        <Badge variant="secondary" className="mx-auto px-4 py-1 uppercase tracking-wide text-xs text-muted-foreground">
          Smarter Micronutrient tracking
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
          Understand your blood health with clarity and personalised guidance.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          HemoVita transforms raw blood test data into clear, personalized health recommendations.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Sign up</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/sign-in">Log in</Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="gap-2">
            <Link href="/labs/new">
              Try demo
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="mt-16 grid gap-8 sm:grid-cols-2">
        <Card className="border-0 bg-white/70 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>For clinicians &amp; self-advocates</CardTitle>
            <CardDescription>Bring order to complex micronutrient assessments.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {highlights.map((item) => (
              <div key={item} className="flex items-start gap-3 text-left">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-4 w-4" />
                </span>
                <p className="text-sm text-muted-foreground">{item}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-0 bg-white/70 shadow-xl backdrop-blur">
          <CardHeader>
            <CardTitle>Streamlined workflow</CardTitle>
            <CardDescription>Designed for quick data entry and instant recommendations.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-left text-sm text-muted-foreground">
            <p>
              The HemoVita lab entry flow guides you through each key marker with unit hints, validation, and inline
              tooltips explaining clinical context.
            </p>
            <Separator />
            <p>Easily revisit past entries and keep your profile in sync with your care team.</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
