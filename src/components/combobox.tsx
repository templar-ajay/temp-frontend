"use client";

import React, { useState, useRef } from "react";
import { FixedSizeList as List } from "react-window";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

export function Combobox({
  options,
  value,
  setValue,
  searchText = "Search Referring Provider...",
  searchEmptyText = "No Referring Provider found.",
  onFocusEvent = true,
  defaultOpen = false,
  shouldOpen = false,
}: {
  options: string[];
  value: any;
  setValue: any;
  searchText?: string;
  searchEmptyText?: string;
  onFocusEvent?: boolean;
  defaultOpen?: boolean;
  shouldOpen?: boolean;
}) {
  const buttonRef = useRef<any>();
  const [open, setOpen] = React.useState(defaultOpen || shouldOpen);
  const [searchValue, setSearchValue] = useState(""); // Track search input

  React.useEffect(() => {
    setOpen(shouldOpen);
  }, [shouldOpen]);

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchValue.toLowerCase())
  );

  const height = 35; // Height of each list item
  const visibleItemsCount = 5; // Number of items to display in the visible list
  const itemSize = 40; // Size of each item in the list

  // Row component for react-window
  const Row = ({ index, style }: { index: number; style: any }) => {
    const framework = filteredOptions[index]; // Use filtered options
    return (
      <CommandItem
        data-disabled={false}
        style={{
          ...style, // Required for react-window's inline styling
          pointerEvents: "auto",
          opacity: 1,
        }}
        key={framework + index}
        value={framework}
        onSelect={(currentValue) => {
          setValue(currentValue);
          setOpen(false);
        }}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            value === framework ? "opacity-100" : "opacity-0"
          )}
        />
        {framework}
      </CommandItem>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className={cn(open && "border-black border-2")} asChild>
        <Button
          ref={buttonRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          onFocusCapture={
            onFocusEvent
              ? (event) => {
                  if (!open && !value) {
                    try {
                      buttonRef?.current?.click();
                    } catch (err) {
                      console.trace("button ref not found in combobox");
                    }
                  }
                }
              : () => {}
          }
          className={cn(
            "w-full md:w-full justify-between font-normal max-w-full text-wrap"
          )}
        >
          {value
            ? options.find(
                (framework) => framework.toLowerCase() === value.toLowerCase()
              )
            : searchText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent data-disabled={false} className="w-full p-0">
        <Command
          filter={(value, search) => {
            const regex = new RegExp(`(?:,\\s*)?\\b${search}`, "i");
            return regex.test(value) ? 1 : 0;
          }}
          loop
        >
          <CommandInput
            placeholder={searchText}
            value={searchValue}
            onValueChange={setSearchValue} // Update search input
          />
          <CommandList aria-disabled="true">
            {filteredOptions.length === 0 ? (
              <CommandEmpty>{searchEmptyText}</CommandEmpty>
            ) : (
              <CommandGroup aria-disabled="false">
                <List
                  height={visibleItemsCount * itemSize}
                  itemCount={filteredOptions.length} // Use filtered options length
                  itemSize={itemSize}
                  width="100%"
                >
                  {Row}
                </List>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
