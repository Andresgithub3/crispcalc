"use client";

import { useState } from "react";

import {
  celsiusToFahrenheit,
  fahrenheitToCelsius,
} from "@/lib/converter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * Two-way °C ↔ °F live converter for the /charts/celsius-to-fahrenheit
 * page. Both inputs are independently editable; changing one updates
 * the other without clobbering active focus.
 */
export function TempConverter() {
  const [fahrenheit, setFahrenheit] = useState(400);
  const [celsius, setCelsius] = useState(() =>
    Math.round(fahrenheitToCelsius(400)),
  );

  function handleF(value: number) {
    setFahrenheit(value);
    setCelsius(Math.round(fahrenheitToCelsius(value)));
  }

  function handleC(value: number) {
    setCelsius(value);
    setFahrenheit(Math.round(celsiusToFahrenheit(value)));
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Field
        id="chart-f"
        label="Fahrenheit"
        unit="°F"
        value={fahrenheit}
        onChange={handleF}
      />
      <Field
        id="chart-c"
        label="Celsius"
        unit="°C"
        value={celsius}
        onChange={handleC}
      />
    </div>
  );
}

function Field({
  id,
  label,
  unit,
  value,
  onChange,
}: {
  id: string;
  label: string;
  unit: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label
        htmlFor={id}
        className="text-xs font-medium tracking-wide text-muted-foreground uppercase"
      >
        {label}
      </Label>
      <div className="relative flex items-stretch">
        <Input
          id={id}
          type="number"
          inputMode="numeric"
          step={1}
          value={Number.isFinite(value) ? value : ""}
          onChange={(e) => {
            const next = e.currentTarget.valueAsNumber;
            onChange(Number.isFinite(next) ? next : 0);
          }}
          className="h-14 w-full rounded-xl pr-14 text-2xl font-medium"
          aria-label={label}
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base text-muted-foreground"
        >
          {unit}
        </span>
      </div>
    </div>
  );
}
