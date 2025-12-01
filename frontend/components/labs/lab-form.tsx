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
import { Separator } from "@/components/ui/separator";
import { labSchema } from "@/lib/validators/labs";
import { REF } from "@/lib/ref";

// -------- types matching the FastAPI backend (schema.py) --------

type FoodItem = {
  name: string;
  serving_g?: number | null;
  category?: string | null;
};

type ReportResponse = {
  labels: Record<string, string>;
  supplement_plan: Record<string, string[]>; // e.g. { morning: ["iron", "vitamin_C"] }
  foods: Record<string, FoodItem[]>;         // e.g. { iron: [{ name, serving_g, category }, ...] }
  network_notes: string[];
  report_text: string;
};

// ---------------- field definitions ----------------

const fields = [
  {
    key: "Hemoglobin",
    label: "Hemoglobin",
    unit: "g/dL",
    min: 0,
    max: 25,
    tooltip: "Primary oxygen-carrying protein; low values commonly reflect anemia.",
  },
  {
    key: "MCV",
    label: "Mean corpuscular volume",
    unit: "fL",
    min: 40,
    max: 150,
    tooltip: "Average size of red blood cells; helps classify anemia types.",
  },
  {
    key: "ferritin",
    label: "Ferritin",
    unit: "ng/mL",
    min: 0,
    max: 500,
    tooltip: "Reflects stored iron; low levels precede anemia.",
  },
  // {
  //   key: "indicator_iron_serum",
  //   label: "Serum iron",
  //   unit: "µg/dL",
  //   min: 0,
  //   max: 400,
  //   tooltip: "Circulating iron bound to transferrin.",
  // },
  // {
  //   key: "transferrin",
  //   label: "Transferrin",
  //   unit: "mg/dL",
  //   min: 0,
  //   max: 600,
  //   tooltip: "Iron transporter protein; elevated in iron deficiency.",
  // },
  // {
  //   key: "total_iron_binding_capacity",
  //   label: "Total iron binding capacity",
  //   unit: "µg/dL",
  //   min: 0,
  //   max: 600,
  //   tooltip: "Indirect measure of transferrin; rises when iron stores fall.",
  // },
  {
    key: "vitamin_B12",
    label: "Vitamin B12",
    unit: "pg/mL",
    min: 0,
    max: 2000,
    tooltip: "Essential for nerve and blood health.",
  },
  {
    key: "folate_plasma",
    label: "Plasma folate",
    unit: "ng/mL",
    min: 0,
    max: 40,
    tooltip: "Supports DNA synthesis and methylation.",
  },
  {
    key: "vitamin_D",
    label: "Vitamin D (25-OH)",
    unit: "ng/mL",
    min: 0,
    max: 150,
    tooltip: "Impacts bone health and immune function.",
  },
  {
    key: "magnesium",
    label: "Magnesium",
    unit: "mg/dL",
    min: 0,
    max: 4,
    tooltip: "Cofactor in hundreds of enzymatic reactions.",
  },
  {
    key: "zinc",
    label: "Zinc",
    unit: "µg/dL",
    min: 0,
    max: 300,
    tooltip: "Critical for immune response and wound healing.",
  },
  {
    key: "calcium",
    label: "Calcium",
    unit: "mg/dL",
    min: 0,
    max: 15,
    tooltip: "Maintains bone strength and cellular signaling.",
  },
  {
    key: "vitamin_C",
    label: "Vitamin C",
    unit: "mg/dL",
    min: 0,
    max: 5,
    tooltip: "Supports collagen synthesis and antioxidant recycling.",
  },
  {
    key: "vitamin_A",
    label: "Vitamin A",
    unit: "µg/dL",
    min: 0,
    max: 120,
    tooltip: "Important for vision and epithelial integrity.",
  },
  {
    key: "vitamin_E",
    label: "Vitamin E",
    unit: "mg/L",
    min: 0,
    max: 40,
    tooltip: "Fat-soluble antioxidant protecting cell membranes.",
  },
  {
    key: "vitamin_B6",
    label: "Vitamin B6",
    unit: "µg/L",
    min: 0,
    max: 80,
    tooltip: "Supports amino acid metabolism and neurotransmitters.",
  },
  {
    key: "homocysteine",
    label: "Homocysteine",
    unit: "µmol/L",
    min: 0,
    max: 100,
    tooltip: "Cardiovascular risk marker; responds to B vitamins.",
  },
] as const;

// const sampleValues = {
//   Hemoglobin: 11.4,
//   MCV: 78,
//   ferritin: 12,
//   // indicator_iron_serum: 45,
//   // transferrin: 380,
//   // total_iron_binding_capacity: 430,
//   vitamin_B12: 230,
//   folate_plasma: 3.2,
//   vitamin_D: 18,
//   magnesium: 1.6,
//   zinc: 58,
//   calcium: 8.8,
//   vitamin_C: 0.5,
//   vitamin_A: 28,
//   vitamin_E: 5.5,
//   vitamin_B6: 4.9,
//   homocysteine: 18,
// } satisfies Record<(typeof fields)[number]["key"], number>;

type LabFormValues = z.infer<typeof labSchema>;



function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function generateRandomSample(): LabFormValues {
  const values: any = {};

  for (const field of fields) {
    const ref = REF[field.key];
    const low = ref?.low ?? field.min;
    const high = ref?.high ?? field.max;

    if (low == null || high == null || low >= high) {
      // Fallback to mid of min/max if ref is weird/missing
      values[field.key] = (field.min + field.max) / 2;
    } else {
      // Random within reference range (slightly jittered)
      values[field.key] = Number(randomInRange(low, high).toFixed(2));
    }
  }

  return values as LabFormValues;
}


export function LabForm() {
  const [result, setResult] = useState<ReportResponse | null>(null);
  const [lastLabs, setLastLabs] = useState<LabFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LabFormValues>({
    resolver: zodResolver(labSchema),
    defaultValues: useMemo(
      () =>
        fields.reduce(
          (acc, field) => {
            acc[field.key as keyof LabFormValues] = undefined as any;
            return acc;
          },
          {} as LabFormValues,
        ),
      [],
    ),
  });

  const onSubmit = (values: LabFormValues) => {
    setError(null);
    setResult(null);

    // Build labs object with ONLY numeric values (backend expects Dict[str, float])
    const labs: Record<string, number> = {};
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === "number" && !Number.isNaN(value)) {
        labs[key] = value;
      }
    }

    startTransition(async () => {
      try {
        const res = await fetch("/api/report", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            labs,
            patient: {
              // TODO: wire these to real patient fields in your profile or form
              age: 30,
              sex: "female",
              country: null,
              notes: null,
              pregnant: null,
            },
            diet_filter: null,
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `API returned status ${res.status}`);
        }

        const data: ReportResponse = await res.json();
        setResult(data);
        setLastLabs(values);
      } catch (err: any) {
        console.error(err);
        setError(
          err?.message ||
            "Could not generate recommendations from the backend. Please check your inputs and try again.",
        );
      }
    });
  };

  // const loadSample = () => {
  //   form.reset(sampleValues);
  //   setResult(null);
  //   setLastLabs(null);
  //   setError(null);
  // };

  const loadSample = () => {
  const randomValues = generateRandomSample();
  form.reset(randomValues);
  setResult(null);
  setLastLabs(null);
  setError(null);
};


  return (
    <div className="space-y-8">
      {/* --- input card --- */}
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
                {fields.map((fieldDef) => (
                  <FormField
                    key={fieldDef.key}
                    control={form.control}
                    name={fieldDef.key as keyof LabFormValues}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormLabel className="text-sm font-semibold text-foreground">{fieldDef.label}</FormLabel>
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
                              <TooltipContent>{fieldDef.tooltip}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              step="any"
                              min={fieldDef.min}
                              max={fieldDef.max}
                              placeholder={`e.g. ${fieldDef.unit}`}
                              value={field.value ?? ""}
                              onChange={(event) => {
                                const value = event.target.value;
                                field.onChange(value === "" ? undefined : Number(value));
                              }}
                            />
                            <span className="text-xs font-medium text-muted-foreground">{fieldDef.unit}</span>
                          </div>
                        </FormControl>
                        <FormMessage />
                        <p className="text-xs text-muted-foreground">
                          Reference: {REF[fieldDef.key]?.low ?? "—"} – {REF[fieldDef.key]?.high ?? "—"}
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

      {/* --- results --- */}
      {result && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Narrative summary */}
          {/* <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle>Full report</CardTitle>
              <CardDescription>
                Prototype narrative generated by the HemoVita recommendation engine (backend).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap rounded-2xl bg-muted/60 p-4 text-sm">
                {result.report_text}
              </pre>
            </CardContent>
          </Card> */}

          {/* Marker classification */}
          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle>Marker classification</CardTitle>
              {/* <CardDescription>Comparing your values to the backend&apos;s evidence-based ranges.</CardDescription> */}
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Marker</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(result.labels).map(([marker, status]) => {
                    const value = lastLabs ? (lastLabs as any)[marker] : undefined;
                    return (
                      <TableRow key={marker}>
                        <TableCell className="font-medium">{marker}</TableCell>
                        <TableCell>{value ?? "—"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              status === "normal"
                                ? "secondary"
                                : status === "unknown"
                                ? "outline"
                                : "default"
                            }
                          >
                            {status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Supplement plan */}
          <div className="space-y-4">
                {/* Supplement plan */}
                <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle>Supplement schedule</CardTitle>
                    <CardDescription>Grouped into simple morning / midday / evening slots.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(result.supplement_plan).map(([slot, supplements]) => (
                      <div key={slot} className="rounded-2xl border px-4 py-3">
                        <p className="text-sm font-semibold capitalize text-primary">{slot}</p>
                        {supplements.length === 0 ? (
                          <p className="text-sm text-muted-foreground">No supplements scheduled in this slot.</p>
                        ) : (
                          <div className="mt-1 flex flex-wrap gap-2">
                            {supplements.map((supp) => (
                              <Badge key={supp} variant="outline" className="capitalize">
                                {supp.replace(/_/g, " ")}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Nutrient interaction notes – now directly under supplement schedule */}
                <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur">
                  <CardHeader>
                    <CardTitle>Nutrient interaction notes</CardTitle>
                    {/* <CardDescription>How the engine is spacing and pairing supplements.</CardDescription> */}
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    {result.network_notes.map((note, idx) => (
                      <p key={idx}>• {note}</p>
                    ))}
                  </CardContent>
                </Card>
              </div>

          {/* Food suggestions */}
          <Card className="rounded-3xl border-0 bg-white/80 shadow-xl backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle>Food suggestions</CardTitle>
              <CardDescription>Top foods per nutrient .</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.keys(result.foods).length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No food suggestions available for this panel. Try adding more deficient markers.
                </p>
              )}

              {Object.entries(result.foods).map(([bundle, foods]) => (
                <div key={bundle} className="rounded-2xl border p-4">
                  <p className="mb-2 text-sm font-semibold capitalize">
                    {bundle.replace(/_/g, " ")} – suggested foods
                  </p>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Food</TableHead>
                        <TableHead>Typical serving</TableHead>
                        <TableHead>Category</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {foods.map((f, idx) => (
                        <TableRow key={`${bundle}-${idx}`}>
                          <TableCell>{f.name}</TableCell>
                          <TableCell>{f.serving_g != null ? `${f.serving_g} g` : "—"}</TableCell>
                          <TableCell>{f.category ?? "—"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Network notes */}

        </div>
      )}
    </div>
  );
}
