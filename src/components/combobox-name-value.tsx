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

const States = [
  {
    name: "Alabama",
    isoCode: "AL",
    countryCode: "US",
    latitude: "32.31823140",
    longitude: "-86.90229800",
  },
  {
    name: "Alaska",
    isoCode: "AK",
    countryCode: "US",
    latitude: "64.20084130",
    longitude: "-149.49367330",
  },
  {
    name: "American Samoa",
    isoCode: "AS",
    countryCode: "US",
    latitude: "-14.27097200",
    longitude: "-170.13221700",
  },
  {
    name: "Arizona",
    isoCode: "AZ",
    countryCode: "US",
    latitude: "34.04892810",
    longitude: "-111.09373110",
  },
  {
    name: "Arkansas",
    isoCode: "AR",
    countryCode: "US",
    latitude: "35.20105000",
    longitude: "-91.83183340",
  },
  {
    name: "Baker Island",
    isoCode: "UM-81",
    countryCode: "US",
    latitude: "0.19362660",
    longitude: "-176.47690800",
  },
  {
    name: "California",
    isoCode: "CA",
    countryCode: "US",
    latitude: "36.77826100",
    longitude: "-119.41793240",
  },
  {
    name: "Colorado",
    isoCode: "CO",
    countryCode: "US",
    latitude: "39.55005070",
    longitude: "-105.78206740",
  },
  {
    name: "Connecticut",
    isoCode: "CT",
    countryCode: "US",
    latitude: "41.60322070",
    longitude: "-73.08774900",
  },
  {
    name: "Delaware",
    isoCode: "DE",
    countryCode: "US",
    latitude: "38.91083250",
    longitude: "-75.52766990",
  },
  {
    name: "District of Columbia",
    isoCode: "DC",
    countryCode: "US",
    latitude: "38.90719230",
    longitude: "-77.03687070",
  },
  {
    name: "Florida",
    isoCode: "FL",
    countryCode: "US",
    latitude: "27.66482740",
    longitude: "-81.51575350",
  },
  {
    name: "Georgia",
    isoCode: "GA",
    countryCode: "US",
    latitude: "32.16562210",
    longitude: "-82.90007510",
  },
  {
    name: "Guam",
    isoCode: "GU",
    countryCode: "US",
    latitude: "13.44430400",
    longitude: "144.79373100",
  },
  {
    name: "Hawaii",
    isoCode: "HI",
    countryCode: "US",
    latitude: "19.89676620",
    longitude: "-155.58278180",
  },
  {
    name: "Howland Island",
    isoCode: "UM-84",
    countryCode: "US",
    latitude: "0.81132190",
    longitude: "-176.61827360",
  },
  {
    name: "Idaho",
    isoCode: "ID",
    countryCode: "US",
    latitude: "44.06820190",
    longitude: "-114.74204080",
  },
  {
    name: "Illinois",
    isoCode: "IL",
    countryCode: "US",
    latitude: "40.63312490",
    longitude: "-89.39852830",
  },
  {
    name: "Indiana",
    isoCode: "IN",
    countryCode: "US",
    latitude: "40.26719410",
    longitude: "-86.13490190",
  },
  {
    name: "Iowa",
    isoCode: "IA",
    countryCode: "US",
    latitude: "41.87800250",
    longitude: "-93.09770200",
  },
  {
    name: "Jarvis Island",
    isoCode: "UM-86",
    countryCode: "US",
    latitude: "-0.37435030",
    longitude: "-159.99672060",
  },
  {
    name: "Johnston Atoll",
    isoCode: "UM-67",
    countryCode: "US",
    latitude: "16.72950350",
    longitude: "-169.53364770",
  },
  {
    name: "Kansas",
    isoCode: "KS",
    countryCode: "US",
    latitude: "39.01190200",
    longitude: "-98.48424650",
  },
  {
    name: "Kentucky",
    isoCode: "KY",
    countryCode: "US",
    latitude: "37.83933320",
    longitude: "-84.27001790",
  },
  {
    name: "Kingman Reef",
    isoCode: "UM-89",
    countryCode: "US",
    latitude: "6.38333300",
    longitude: "-162.41666700",
  },
  {
    name: "Louisiana",
    isoCode: "LA",
    countryCode: "US",
    latitude: "30.98429770",
    longitude: "-91.96233270",
  },
  {
    name: "Maine",
    isoCode: "ME",
    countryCode: "US",
    latitude: "45.25378300",
    longitude: "-69.44546890",
  },
  {
    name: "Maryland",
    isoCode: "MD",
    countryCode: "US",
    latitude: "39.04575490",
    longitude: "-76.64127120",
  },
  {
    name: "Massachusetts",
    isoCode: "MA",
    countryCode: "US",
    latitude: "42.40721070",
    longitude: "-71.38243740",
  },
  {
    name: "Michigan",
    isoCode: "MI",
    countryCode: "US",
    latitude: "44.31484430",
    longitude: "-85.60236430",
  },
  {
    name: "Midway Atoll",
    isoCode: "UM-71",
    countryCode: "US",
    latitude: "28.20721680",
    longitude: "-177.37349260",
  },
  {
    name: "Minnesota",
    isoCode: "MN",
    countryCode: "US",
    latitude: "46.72955300",
    longitude: "-94.68589980",
  },
  {
    name: "Mississippi",
    isoCode: "MS",
    countryCode: "US",
    latitude: "32.35466790",
    longitude: "-89.39852830",
  },
  {
    name: "Missouri",
    isoCode: "MO",
    countryCode: "US",
    latitude: "37.96425290",
    longitude: "-91.83183340",
  },
  {
    name: "Montana",
    isoCode: "MT",
    countryCode: "US",
    latitude: "46.87968220",
    longitude: "-110.36256580",
  },
  {
    name: "Navassa Island",
    isoCode: "UM-76",
    countryCode: "US",
    latitude: "18.41006890",
    longitude: "-75.01146120",
  },
  {
    name: "Nebraska",
    isoCode: "NE",
    countryCode: "US",
    latitude: "41.49253740",
    longitude: "-99.90181310",
  },
  {
    name: "Nevada",
    isoCode: "NV",
    countryCode: "US",
    latitude: "38.80260970",
    longitude: "-116.41938900",
  },
  {
    name: "New Hampshire",
    isoCode: "NH",
    countryCode: "US",
    latitude: "43.19385160",
    longitude: "-71.57239530",
  },
  {
    name: "New Jersey",
    isoCode: "NJ",
    countryCode: "US",
    latitude: "40.05832380",
    longitude: "-74.40566120",
  },
  {
    name: "New Mexico",
    isoCode: "NM",
    countryCode: "US",
    latitude: "34.51994020",
    longitude: "-105.87009010",
  },
  {
    name: "New York",
    isoCode: "NY",
    countryCode: "US",
    latitude: "40.71277530",
    longitude: "-74.00597280",
  },
  {
    name: "North Carolina",
    isoCode: "NC",
    countryCode: "US",
    latitude: "35.75957310",
    longitude: "-79.01929970",
  },
  {
    name: "North Dakota",
    isoCode: "ND",
    countryCode: "US",
    latitude: "47.55149260",
    longitude: "-101.00201190",
  },
  {
    name: "Northern Mariana Islands",
    isoCode: "MP",
    countryCode: "US",
    latitude: "15.09790000",
    longitude: "145.67390000",
  },
  {
    name: "Ohio",
    isoCode: "OH",
    countryCode: "US",
    latitude: "40.41728710",
    longitude: "-82.90712300",
  },
  {
    name: "Oklahoma",
    isoCode: "OK",
    countryCode: "US",
    latitude: "35.46756020",
    longitude: "-97.51642760",
  },
  {
    name: "Oregon",
    isoCode: "OR",
    countryCode: "US",
    latitude: "43.80413340",
    longitude: "-120.55420120",
  },
  {
    name: "Palmyra Atoll",
    isoCode: "UM-95",
    countryCode: "US",
    latitude: "5.88850260",
    longitude: "-162.07866560",
  },
  {
    name: "Pennsylvania",
    isoCode: "PA",
    countryCode: "US",
    latitude: "41.20332160",
    longitude: "-77.19452470",
  },
  {
    name: "Puerto Rico",
    isoCode: "PR",
    countryCode: "US",
    latitude: "18.22083300",
    longitude: "-66.59014900",
  },
  {
    name: "Rhode Island",
    isoCode: "RI",
    countryCode: "US",
    latitude: "41.58009450",
    longitude: "-71.47742910",
  },
  {
    name: "South Carolina",
    isoCode: "SC",
    countryCode: "US",
    latitude: "33.83608100",
    longitude: "-81.16372450",
  },
  {
    name: "South Dakota",
    isoCode: "SD",
    countryCode: "US",
    latitude: "43.96951480",
    longitude: "-99.90181310",
  },
  {
    name: "Tennessee",
    isoCode: "TN",
    countryCode: "US",
    latitude: "35.51749130",
    longitude: "-86.58044730",
  },
  {
    name: "Texas",
    isoCode: "TX",
    countryCode: "US",
    latitude: "31.96859880",
    longitude: "-99.90181310",
  },
  {
    name: "United States Minor Outlying Islands",
    isoCode: "UM",
    countryCode: "US",
    latitude: "19.28231920",
    longitude: "166.64704700",
  },
  {
    name: "United States Virgin Islands",
    isoCode: "VI",
    countryCode: "US",
    latitude: "18.33576500",
    longitude: "-64.89633500",
  },
  {
    name: "Utah",
    isoCode: "UT",
    countryCode: "US",
    latitude: "39.32098010",
    longitude: "-111.09373110",
  },
  {
    name: "Vermont",
    isoCode: "VT",
    countryCode: "US",
    latitude: "44.55880280",
    longitude: "-72.57784150",
  },
  {
    name: "Virginia",
    isoCode: "VA",
    countryCode: "US",
    latitude: "37.43157340",
    longitude: "-78.65689420",
  },
  {
    name: "Wake Island",
    isoCode: "UM-79",
    countryCode: "US",
    latitude: "19.27961900",
    longitude: "166.64993480",
  },
  {
    name: "Washington",
    isoCode: "WA",
    countryCode: "US",
    latitude: "47.75107410",
    longitude: "-120.74013850",
  },
  {
    name: "West Virginia",
    isoCode: "WV",
    countryCode: "US",
    latitude: "38.59762620",
    longitude: "-80.45490260",
  },
  {
    name: "Wisconsin",
    isoCode: "WI",
    countryCode: "US",
    latitude: "43.78443970",
    longitude: "-88.78786780",
  },
  {
    name: "Wyoming",
    isoCode: "WY",
    countryCode: "US",
    latitude: "43.07596780",
    longitude: "-107.29028390",
  },
];

export function ComboboxNameValue({
  options,
  value: isoValue,
  setValue,
  searchText = "Search Referring Provider...",
  searchEmptyText = "No Referring Provider found.",
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
          {States.find((x) => x.isoCode == isoValue)?.name
            ? States.find(
                (_) =>
                  _.isoCode == options.find((_value) => _value === isoValue)
              )?.name
            : searchText}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent data-disabled={false} className="w-full p-0">
        <Command
          value={isoValue}
          onValueChange={setValue}
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
              States?.filter((x) => x.isoCode == value)?.[0]
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
                    // setValue(currentValue === value ? "" : currentValue);
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
                  {States.find((x) => x.isoCode == _value)?.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
