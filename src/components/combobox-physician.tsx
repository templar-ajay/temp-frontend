"use client";

import * as React from "react";
import { useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Physicians = [
  { uid: "UID_060Z6BZZDCC3FY0987Y4", name: "Ali, NP, Jessica Fay" },
  { uid: "UID_Az86426924_1451", name: "Gelfand, MD, Robert" },
  { uid: "UID_066ATE4VW2A49WWGN5KW", name: "Ghuman, MD, Damanjit" },
  { uid: "UID_VV664631032_1165", name: "Kramer, MD, Rachel" },
  { uid: "UID_VV370565293_2160", name: "Livescu, NP, Nicole" },
];

export function ComboboxPhysician({
  options,
  value: isoValue,
  setValue,
  searchText = "Search Physician...",
  searchEmptyText = "No Physician found.",
}: {
  options: string[];
  value: any;
  setValue: any;
  searchText?: string;
  searchEmptyText?: string;
}) {
  const buttonRef = useRef<any>();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(open && "border-black border-2")} asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          tabIndex={0}
          onFocus={(event) => {
            // enable auto-click on first focus
            if (!isoValue && !open) {
              try {
                buttonRef?.current?.click();
              } catch (err) {
                console.trace("button ref not found in combobox (name-value)");
              }
            }
          }}
          className="w-full justify-between font-normal"
        >
          {Physicians.find((x) => x.uid == isoValue)?.name
            ? Physicians.find(
                (_) => _.uid == options.find((_value) => _value === isoValue)
              )?.name
            : searchText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent data-disabled={false} className="w-full p-0">
        <Command
          filter={(value, search) => {
            // console.log("value", value);
            // console.log("search", search);
            // console.log(
            //   "basically",
            //   States?.filter((x) =>
            //     x.name.toLowerCase().includes(search.toLowerCase())
            //   )
            // );
            if (
              Physicians?.filter((x) => x.uid == value)?.[0]
                ?.name.toLowerCase()
                .includes(search.toLowerCase())
            ) {
              return 1;
            } else return 0;
          }}
          data-disabled={false}
          disablePointerSelection={false}
        >
          <CommandInput placeholder={searchText} />
          <CommandList aria-disabled="true">
            <CommandEmpty>{searchEmptyText}</CommandEmpty>
            <CommandGroup aria-disabled="false">
              {options.map((_value, i) => (
                <CommandItem
                  data-disabled={false}
                  style={{
                    pointerEvents: "auto",
                    opacity: 1,
                  }}
                  key={_value + i}
                  value={_value}
                  onSelect={(currentValue) => {
                    setValue(currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      isoValue === _value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {Physicians.find((x) => x.uid == _value)?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
