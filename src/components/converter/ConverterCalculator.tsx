"use client";

/**
 * CrispCalc core calculator — the product.
 *
 * Live, debounced, URL-shareable conversion from oven recipe to air fryer
 * settings. Renders on the homepage and (with pre-filled `initialState`)
 * on every food preset page in Milestone 3.
 *
 * Spec reference: CRISPCALC_BUILD_SPEC.md §6.
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Check, ClipboardCopy, TriangleAlert } from "lucide-react";

import {
  celsiusToFahrenheit,
  convert,
  fahrenheitToCelsius,
  toFahrenheit,
  type ConversionResult,
  type TempUnit,
} from "@/lib/converter";
import {
  trackConversion,
  trackResultCopied,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DEFAULT_CALCULATOR_STATE,
  FOOD_LABELS,
  FOOD_TYPES,
  FRYER_LABELS,
  FRYER_MODELS,
  calculatorStateToQueryString,
  readCalculatorStateFromParams,
  type CalculatorState,
} from "./labels";

const DEBOUNCE_MS = 200;

export interface ConverterCalculatorProps {
  /** Food preset pages pass their per-food defaults here. */
  initialState?: Partial<CalculatorState>;
  /** When false, skips rewriting window.location on state change. */
  syncUrl?: boolean;
  className?: string;
}

export function ConverterCalculator({
  initialState,
  syncUrl = true,
  className,
}: ConverterCalculatorProps) {
  // Merge prop defaults over hard defaults. URL is applied post-hydration.
  const initial = useMemo<CalculatorState>(
    () => ({ ...DEFAULT_CALCULATOR_STATE, ...initialState }),
    [initialState],
  );

  const [state, setState] = useState<CalculatorState>(initial);
  const [hasHydratedFromUrl, setHasHydratedFromUrl] = useState(false);
  const [copied, setCopied] = useState(false);

  // Client-only: apply ?temp=&time=&... if the user arrived with a share URL.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const hasAny =
      params.has("temp") ||
      params.has("time") ||
      params.has("unit") ||
      params.has("food") ||
      params.has("fryer");
    if (hasAny) {
      setState(readCalculatorStateFromParams(params, initial));
    }
    setHasHydratedFromUrl(true);
    // Intentionally run once on mount; initial is stable via useMemo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce the inputs that drive conversion + URL sync.
  const [debounced, setDebounced] = useState<CalculatorState>(initial);
  useEffect(() => {
    const handle = setTimeout(() => setDebounced(state), DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [state]);

  // Compute the result from debounced inputs.
  const result = useMemo<ConversionResult | null>(() => {
    if (debounced.temp <= 0 || debounced.time <= 0) return null;
    return convert({
      ovenTempF: toFahrenheit(debounced.temp, debounced.unit),
      ovenTimeMin: debounced.time,
      foodType: debounced.food,
      fryerModel: debounced.fryer,
    });
  }, [debounced]);

  // Fire `conversion_calculated` once per meaningful input change.
  useEffect(() => {
    if (!result) return;
    trackConversion({
      ovenTempF: toFahrenheit(debounced.temp, debounced.unit),
      ovenTimeMin: debounced.time,
      airFryerTempF: result.airFryerTempF,
      airFryerTimeMin: result.airFryerTimeMin,
      foodType: debounced.food,
      fryerModel: debounced.fryer,
    });
  }, [result, debounced]);

  // URL sync — client-only, non-pushing, no scroll jump.
  const lastUrlRef = useRef<string | null>(null);
  useEffect(() => {
    if (!syncUrl) return;
    if (!hasHydratedFromUrl) return;
    if (typeof window === "undefined") return;

    const qs = calculatorStateToQueryString(debounced, initial);
    const next = qs
      ? `${window.location.pathname}?${qs}`
      : window.location.pathname;
    if (lastUrlRef.current === next) return;
    lastUrlRef.current = next;
    window.history.replaceState(null, "", next);
  }, [debounced, syncUrl, hasHydratedFromUrl, initial]);

  // Flip °F ↔ °C: convert the current numeric input so the user doesn't
  // see a nonsense value when they change units mid-entry.
  const handleUnitChange = useCallback((next: TempUnit) => {
    setState((prev) => {
      if (prev.unit === next) return prev;
      const converted =
        next === "C"
          ? fahrenheitToCelsius(prev.temp)
          : celsiusToFahrenheit(prev.temp);
      return { ...prev, unit: next, temp: converted };
    });
  }, []);

  const handleCopy = useCallback(async () => {
    if (!result || typeof navigator === "undefined") return;
    const tempDisplay =
      state.unit === "F"
        ? `${result.airFryerTempF}°F`
        : `${result.airFryerTempC}°C`;
    const text = `Air fryer: ${tempDisplay} for ${result.airFryerTimeMin} min (check at ${result.checkAtMin} min) — via CrispCalc`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      trackResultCopied(state.food);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent — browsers without Clipboard API will simply not flash the check.
    }
  }, [result, state.unit, state.food]);

  const displayTemp =
    result === null
      ? "—"
      : state.unit === "F"
        ? `${result.airFryerTempF}°`
        : `${result.airFryerTempC}°`;
  const displayTime = result === null ? "—" : `${result.airFryerTimeMin}`;

  return (
    <Card
      className={cn(
        "w-full max-w-3xl gap-0 overflow-hidden rounded-2xl p-0 ring-foreground/10",
        className,
      )}
    >
      {/* Inputs */}
      <div className="grid grid-cols-1 gap-5 bg-card p-6 sm:p-8 md:grid-cols-2">
        <TempField
          value={state.temp}
          unit={state.unit}
          onValueChange={(temp) => setState((s) => ({ ...s, temp }))}
          onUnitChange={handleUnitChange}
        />
        <TimeField
          value={state.time}
          onValueChange={(time) => setState((s) => ({ ...s, time }))}
        />
        <SelectField
          id="food-type"
          label="Food type"
          value={state.food}
          onValueChange={(food) => setState((s) => ({ ...s, food }))}
          options={FOOD_TYPES}
          labels={FOOD_LABELS}
        />
        <SelectField
          id="fryer-model"
          label="Air fryer model"
          value={state.fryer}
          onValueChange={(fryer) => setState((s) => ({ ...s, fryer }))}
          options={FRYER_MODELS}
          labels={FRYER_LABELS}
        />
      </div>

      {/* Result */}
      <ResultPanel
        result={result}
        tempDisplay={displayTemp}
        timeDisplay={displayTime}
        onCopy={handleCopy}
        copied={copied}
      />
    </Card>
  );
}

/* -----------------------------------------------------------------------
 * Field subcomponents (kept local — not reused elsewhere yet).
 * --------------------------------------------------------------------- */

function TempField({
  value,
  unit,
  onValueChange,
  onUnitChange,
}: {
  value: number;
  unit: TempUnit;
  onValueChange: (n: number) => void;
  onUnitChange: (u: TempUnit) => void;
}) {
  const [display, setDisplay] = useState(() =>
    Number.isFinite(value) ? String(value) : "",
  );
  const focused = useRef(false);

  // Sync from parent when not focused (e.g. unit toggle, URL hydration).
  useEffect(() => {
    if (!focused.current) {
      setDisplay(Number.isFinite(value) ? String(value) : "");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor="oven-temp"
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        Oven temperature
      </Label>
      <div className="flex items-stretch gap-2">
        <Input
          id="oven-temp"
          type="number"
          inputMode="numeric"
          min={0}
          step={5}
          value={display}
          onChange={(e) => {
            const raw = e.currentTarget.value;
            setDisplay(raw);
            const next = e.currentTarget.valueAsNumber;
            onValueChange(Number.isFinite(next) ? next : 0);
          }}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
          }}
          className="h-12 flex-1 rounded-xl text-lg font-medium"
          aria-label="Oven temperature"
        />
        <UnitToggle unit={unit} onChange={onUnitChange} />
      </div>
    </div>
  );
}

function TimeField({
  value,
  onValueChange,
}: {
  value: number;
  onValueChange: (n: number) => void;
}) {
  const [display, setDisplay] = useState(() =>
    Number.isFinite(value) ? String(value) : "",
  );
  const focused = useRef(false);

  useEffect(() => {
    if (!focused.current) {
      setDisplay(Number.isFinite(value) ? String(value) : "");
    }
  }, [value]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor="oven-time"
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        Oven time
      </Label>
      <div className="relative flex items-stretch">
        <Input
          id="oven-time"
          type="number"
          inputMode="numeric"
          min={0}
          step={1}
          value={display}
          onChange={(e) => {
            const raw = e.currentTarget.value;
            setDisplay(raw);
            const next = e.currentTarget.valueAsNumber;
            onValueChange(Number.isFinite(next) ? next : 0);
          }}
          onFocus={() => {
            focused.current = true;
          }}
          onBlur={() => {
            focused.current = false;
          }}
          className="h-12 w-full rounded-xl pr-20 text-lg font-medium"
          aria-label="Oven time in minutes"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-muted-foreground"
        >
          minutes
        </span>
      </div>
    </div>
  );
}

function UnitToggle({
  unit,
  onChange,
}: {
  unit: TempUnit;
  onChange: (u: TempUnit) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Temperature unit"
      className="inline-flex h-12 shrink-0 items-center rounded-xl border border-input bg-background p-1"
    >
      {(["F", "C"] as const).map((u) => {
        const active = unit === u;
        return (
          <button
            key={u}
            type="button"
            onClick={() => onChange(u)}
            aria-pressed={active}
            className={cn(
              "flex h-full w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            °{u}
          </button>
        );
      })}
    </div>
  );
}

function SelectField<T extends string>({
  id,
  label,
  value,
  onValueChange,
  options,
  labels,
}: {
  id: string;
  label: string;
  value: T;
  onValueChange: (v: T) => void;
  options: readonly T[];
  labels: Record<T, string>;
}) {
  // base-ui accepts `items={{ key: label }}` on Root so <Select.Value /> can
  // render the label directly from the current value. We pass it too, but
  // we also render visible <SelectItem> children inside the popup.
  const items = useMemo(() => {
    const entries: Record<string, string> = {};
    for (const opt of options) entries[opt] = labels[opt];
    return entries;
  }, [options, labels]);

  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={(next) => onValueChange(next as T)}
        items={items}
      >
        <SelectTrigger
          id={id}
          className="h-12 w-full rounded-xl text-base font-medium"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {labels[opt]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultPanel({
  result,
  tempDisplay,
  timeDisplay,
  onCopy,
  copied,
}: {
  result: ConversionResult | null;
  tempDisplay: string;
  timeDisplay: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="border-t border-border bg-muted/40 p-6 sm:p-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1">
          <div
            className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase"
            aria-hidden
          >
            Air fryer
          </div>
          <div
            className="flex items-baseline gap-6 font-mono text-5xl leading-none font-medium tracking-tight text-foreground sm:text-6xl"
            aria-live="polite"
          >
            <span className="tabular-nums">{tempDisplay}</span>
            <span
              aria-hidden
              className="text-border"
            >
              ·
            </span>
            <span className="tabular-nums">
              {timeDisplay}
              <span className="ml-2 text-2xl font-normal text-muted-foreground sm:text-3xl">
                min
              </span>
            </span>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {result === null
              ? "Enter an oven temperature and time to see the conversion."
              : `Check at ${result.checkAtMin} min. Shake or flip then, and add time if needed.`}
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onCopy}
          disabled={result === null}
          className="h-11 shrink-0 rounded-xl px-4"
          aria-live="polite"
        >
          {copied ? (
            <>
              <Check className="size-4" />
              Copied
            </>
          ) : (
            <>
              <ClipboardCopy className="size-4" />
              Copy result
            </>
          )}
        </Button>
      </div>

      {result && result.warnings.length > 0 && (
        <div className="mt-5 flex flex-col gap-2">
          {result.warnings.map((warning) => (
            <Alert
              key={warning}
              className="rounded-xl border-accent/40 bg-accent/15"
            >
              <TriangleAlert className="size-4 text-accent-foreground" />
              <AlertDescription className="text-foreground/90">
                {warning}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}
    </div>
  );
}
