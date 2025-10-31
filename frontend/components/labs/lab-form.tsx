"use client";

import { useMemo, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Info } from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { type RecommendationPayload } from "@/lib/recommendations";
import { labSchema } from "@/lib/validators/labs";
import { REF } from "@/lib/ref";

const fields = [
  {
    key: "Hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    min: 0,
    max: 25,
    tooltip: "Primary oxygen-carrying protein; low values commonly reflect anemia."
  },
  {
    key: "MCV",
    label: "Mean corpuscular volume",
    unit: "fL",
    min: 40,
    max: 150,
    tooltip: "Average size of red blood cells; helps classify anemia types."
  },
  {
    key: "ferritin",
    label: "Ferritin",
    unit: "ng/mL",
    min: 0,
    max: 500,
    tooltip: "Reflects stored iron; low levels precede anemia."
  },
  {
    key: "indicator_iron_serum",
    label: "Serum iron",
    unit: "µg/dL",
    min: 0,
    max: 400,
    tooltip: "Circulating iron bound to transferrin."
  },
  {
    key: "transferrin",
    label: "Transferrin",
    unit: "mg/dL",
    min: 0,
    max: 600,
    tooltip: "Iron transporter protein; elevated in iron deficiency."
  },
  {
    key: "total_iron_binding_capacity",
    label: "Total iron binding capacity",
    unit: "µg/dL",
    min: 0,
    max: 600,
    tooltip: "Indirect measure of transferrin; rises when iron stores fall."
  },
  {
    key: "vitamin_B12",
    label: "Vitamin B12",
    unit: "pg/mL",
    min: 0,
    max: 2000,
    tooltip: "Essential for nerve and blood health."
  },
  {
    key: "folate_plasma",
    label: "Plasma folate",
    unit: "ng/mL",
    min: 0,
    max: 40,
    tooltip: "Supports DNA synthesis and methylation."
  },
  {
    key: "vitamin_D",
    label: "Vitamin D (25-OH)",
    unit: "ng/mL",
    min: 0,
    max: 150,
    tooltip: "Impacts bone health and immune function."
  },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mg/dL",
    min: 0,
    max: 4,
    tooltip: "Cofactor in hundreds of enzymatic reactions."
  },
  {
    key: "zinc",
    label: "Zinc",
    unit: "µg/dL",
    min: 0,
    max: 300,
    tooltip: "Critical for immune response and wound healing."
  },
  {
    key: "calcium",
    label: "Calcium",
    unit: "mg/dL",
    min: 0,
    max: 15,
    tooltip: "Maintains bone strength and cellular signaling."
  },
  {
    key: "vitamin_C",
    label: "Vitamin C",
    unit: "mg/dL",
    min: 0,
    max: 5,
    tooltip: "Supports collagen synthesis and antioxidant recycling."
  },
  {
    key: "vitamin_A",
    label: "Vitamin A",
    unit: "µg/dL",
    min: 0,
    max: 120,
    tooltip: "Important for vision and epithelial integrity."
  },
  {
    key: "vitamin_E",
    label: "Vitamin E",
    unit: "mg/L",
    min: 0,
    max: 40,
    tooltip: "Fat-soluble antioxidant protecting cell membranes."
  },
  {
    key: "vitamin_B6",
    label: "Vitamin B6",
    unit: "µg/L",
    min: 0,
    max: 80,
    tooltip: "Supports amino acid metabolism and neurotransmitters."
  },
  {
    key: "homocysteine",
    label: "Homocysteine",
    unit: "µmol/L",
    min: 0,
    max: 100,
    tooltip: "Cardiovascular risk marker; responds to B vitamins."
  }
] as const;

const sampleValues = {
  Hemoglobin: 11.4,
  MCV: 78,
  ferritin: 12,
  indicator_iron_serum: 45,
  transferrin: 380,
  total_iron_binding_capacity: 430,
  vitamin_B12: 230,
  folate_plasma: 3.2,
  vitamin_D: 18,
  magnesium: 1.6,
  zinc: 58,
  calcium: 8.8,
  vitamin_C: 0.5,
  vitamin_A: 28,
  vitamin_E: 5.5,
  vitamin_B6: 4.9,
  homocysteine: 18
} satisfies Record<(typeof fields)[number]["key"], number>;

type LabFormValues = z.infer<typeof labSchema>;

export function LabForm() {
  const [result, setResult] = useState<RecommendationPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: useMemo(
      () =>
        fields.reduce(
          (acc, field) => {
            acc[field.key] = undefined;
            return acc;
          },
          {} as LabFormValues
        ),
      []
    )
  });

  const onSubmit = (values: LabFormValues) => {
    setError(null);
    startTransition(async () => {
      try {
        const payload = Object.fromEntries(
          Object.entries(values).map(([key, value]) => [key, value === undefined ? null : value])
        );
        const response = await api.post<RecommendationPayload>("/recommend", payload);
        setResult(response.data);
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "Could not generate recommendations. Please review your inputs.";
        setError(message);
        setResult(null);
      }
    });
  };

  const loadSample = () => {
    form.reset(sampleValues);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-8">
      <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
        <CardHeader className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <CardTitle>Enter lab markers</CardTitle>
            <CardDescription>All fields are optional. Leave blank if a marker was not tested.</CardDescription>
          </div>
          <Button type="button" variant="secondary" onClick={loadSample}>
            Load sample
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {error ? (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}
              <div className="grid gap-6 md:grid-cols-2">
                {fields.map((field) => (
                  <FormField
                    key={field.key}
                    control={form.control}
                    name={field.key}
                    render={({ field: inputField }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-semibold text-foreground">{field.label}</FormLabel>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  type="button"
                                  className="text-muted-foreground transition-colors hover:text-foreground"
                                  tabIndex={-1}
                                >
                                  <Info className="h-4 w-4" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent>{field.tooltip}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="any"
                              min={field.min}
                              max={field.max}
                              placeholder={`e.g. ${field.unit}`}
                              value={inputField.value ?? ""}
                              onChange={(event) => {
                                const value = event.target.value;
                                inputField.onChange(value === "" ? undefined : Number(value));
                              }}
                            />
                            <span className="text-xs font-medium text-muted-foreground">{field.unit}</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Reference: {REF[field.key]?.low ?? "—"} – {REF[field.key]?.high ?? "—"}
                        </p>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <Button type="submit" size="lg" className="rounded-full" disabled={isPending}>
                {isPending ? "Analyzing..." : "Generate recommendations"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {result ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
              <CardDescription>{result.summary}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Marker classification</CardTitle>
              <CardDescription>Comparing your values against evidence-based ranges.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marker</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.markers.map((marker) => (
                    <TableRow key={marker.marker}>
                      <TableCell className="font-medium">{marker.marker}</TableCell>
                      <TableCell>{marker.value ?? "—"}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            marker.status === "normal"
                              ? "secondary"
                              : marker.status === "unknown"
                                ? "outline"
                                : "default"
                          }
                        >
                          {marker.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{marker.note}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Follow-up schedule</CardTitle>
              <CardDescription>Simple next steps to discuss with your provider.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.schedule.map((item) => (
                <div key={item.title} className="rounded-2xl border px-4 py-3">
                  <p className="text-sm font-semibold text-primary">{item.timeframe}</p>
                  <p className="text-base font-semibold text-foreground">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
