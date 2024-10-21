"use client";

import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxWithText({
  text,
  description,
  checked,
  onCheckedChange,
}: {
  text?: string;
  description?: string;
  checked: any;
  onCheckedChange: any;
}) {
  return (
    <div className="items-top flex space-x-2">
      <Checkbox
        checked={checked}
        onCheckedChange={onCheckedChange}
        id="checkbox"
      />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="checkbox"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {text}
        </label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
