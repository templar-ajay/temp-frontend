"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { referring_providers } from "@/app/data/referring-providers";
import { State } from "country-state-city";
import PhoneInput from "react-phone-input-2";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { isMobilePhone, isPostalCode } from "validator";

import React, { useState, useRef } from "react";
import { BACKEND_URL } from "@/lib/env";
import { Combobox } from "./combobox";
import { toast } from "@/components/ui/use-toast";
import { LoaderCircle } from "lucide-react";
import { insuranceNames } from "@/app/data/insurance-company";
import { physician } from "@/app/data/physician";
import { DateInput } from "@nextui-org/date-input";
import {
  getLocalTimeZone,
  parseDate,
  today as _their_today,
} from "@internationalized/date";
import { ComboboxPhysician } from "./combobox-physician";
import { cn } from "@/lib/utils";

export default function CustomForm() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(undefined);
  const today = new Date();

  const year = today.getFullYear();
  // @ts-ignore
  const isValidDate = (day, month, year) => {
    const date = new Date(year, month - 1, day);
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 150,
      today.getMonth(),
      today.getDate()
    );
    return date < today && date > minDate;
  };

  const formSchema = z
    .object({
      physician: z.string().min(2, { message: "please select your physician" }),
      first_name: z
        .string()
        .min(1, { message: "Please enter a valid first Name" })
        .max(20),
      middle_name: z.string().optional(),
      last_name: z
        .string()
        .min(2, { message: "Please enter a valid last Name" })
        .max(20),
      mobile_number: z
        .string()
        .optional()
        .refine((value) => !value || isMobilePhone(value.slice(1), "en-US"), {
          message: "Please enter a valid US mobile number",
        }),
      home_phone_number: z.string().optional(),
      email: z.string().email(),
      address_line_1: z.string().min(6, "required"),
      city: z.string().min(2, { message: "Please enter your city name" }),
      state: z.string().min(1, { message: "required" }),
      zip_code: z.string().refine((value) => isPostalCode(value, "US"), {
        message: "Please enter a valid US zip code",
      }),
      preferred_contact_method: z.string().optional(),
      referring_provider: z
        .string()
        .min(1, "please select a referring provider"),
      date_of_birth: z
        .object(
          {
            day: z.number().int().min(1).max(31), // Validate day is between 1 and 31
            month: z.number().int().min(1).max(12), // Validate month is between 1 and 12
            year: z.number().int().min(1958).max(year), // Validate year is a non-negative integer
            era: z.literal("AD"), // Validate era is "AD"
          },
          { message: "required!" }
        )
        .refine((data) => isValidDate(data.day, data.month, data.year), {
          message: "Required", // Generic message for date range validation
        }),
      sex: z.string().min(2, "field is required"),
      insurance_company: z
        .string()
        .min(2, "please provide a valid insurance company name"),
      insurance_member_id: z
        .string()
        .min(2, "please provide a valid insurance member id"),
      secondary_insurance_company: z.string().optional(),
      secondary_insurance_member_id: z.string().optional(),
    })
    .refine(
      (data) => {
        if (
          !data.secondary_insurance_company &&
          data.secondary_insurance_member_id
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Required if Secondary Insurance Member ID is provided",
        path: ["secondary_insurance_company"], // Specify which field to attach the error to
      }
    )
    .refine(
      (data) => {
        if (
          data.secondary_insurance_company &&
          !data.secondary_insurance_member_id
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Required if Secondary Insurance Company is provided",
        path: ["secondary_insurance_member_id"], // Specify which field to attach the error to
      }
    )
    .refine(
      (data) => {
        if (
          data.secondary_insurance_member_id &&
          data.secondary_insurance_member_id.length <= 5
        ) {
          return false;
        }
        return true;
      },
      {
        message: "Please enter a valid insurance member id",
        path: ["secondary_insurance_member_id"], // Specify which field to attach the error to
      }
    )
    .refine(
      (data) => {
        if (
          new Date().getTime() >
          new Date(
            `${data.date_of_birth.month}-${data.date_of_birth.day}-${data.date_of_birth.year}`
          ).getTime()
        ) {
          return true;
        }
        console.log(
          "k",
          new Date(
            `${data.date_of_birth.month}-${data.date_of_birth.day}-${data.date_of_birth.year}`
          ).getTime()
        );
        return false;
      },
      {
        message: "cannot be greater than today",
        path: ["date_of_birth"], // Specify which field to attach the error to
      }
    )
    .superRefine((data, ctx) => {
      console.log("mobile number", data.mobile_number);
      console.log("home phone number", data.home_phone_number);
      // if (form.getValues()["home_phone_number"]?.length) {
      //   form.trigger();
      // }
      if (!data.home_phone_number && !data.mobile_number) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one phone number (mobile or home) is required",
          path: ["mobile_number"], // Attach the error to the mobile_number field
        });
      }
      return true;
    })
    .refine(
      (data) =>
        !data.home_phone_number ||
        isMobilePhone(data.home_phone_number.slice(1), "en-US"),
      {
        message: "Please enter a valid US phone number",
        path: ["home_phone_number"],
      }
    );

  const all_US_States = State.getStatesOfCountry("US");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      physician: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      mobile_number: "",
      home_phone_number: "",
      preferred_contact_method: "",
      date_of_birth: undefined,
      sex: "",
      referring_provider: "",
      address_line_1: "",
      city: "",
      state: "",
      zip_code: "",
      insurance_company: "",
      insurance_member_id: "",
      secondary_insurance_company: "",
      secondary_insurance_member_id: "",
    },
    mode: "onSubmit",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const _values = JSON.parse(JSON.stringify(values));
    _values.date_of_birth = `${values.date_of_birth.month}-${values.date_of_birth.day}-${values.date_of_birth.year}`;

    console.log("values", _values);
    setLoading((x) => true);
    try {
      const response = await axios.post(
        BACKEND_URL + "/api/patients/",
        _values
      );
      // console.log("Form submitted successfully:", response.data);
      if (response.status == 201) {
        toast({
          title: "Form Submitted Successfully",
        });
      } else {
        throw new Error("error submitting the form", {
          cause: "response code not 201",
        });
      }
      form.reset();
      form.setValue("email", "");
    } catch (error) {
      // console.error("Error submitting form:", error);
      let errorMessage = "Unknown error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;

        // If error has a cause property
        if (error.cause) {
          errorMessage += ` (Cause: ${error.cause})`;
        }
      }

      toast({
        title: "Error Submitting the form",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white break-words whitespace-pre-wrap">
              {JSON.stringify(errorMessage, null, 2)}
            </code>
          </pre>
        ),
      });
    } finally {
      setLoading((x) => false);
    }
  }
  return (
    <Form {...form}>
      <form
        id="myForm"
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:border-gray-900 md:border-[1px] w-full mx-auto px-4 py-1 shadow-none md:dark:shadow-emerald-50 dark:shadow-sm my-form rounded text-xl bg-white"
      >
        <div className="grid grid-cols-1 gap-4 md:gap-x-8 gap-y-0">
          <FormField
            control={form.control}
            name="physician"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Physician*
                </FormLabel>
                <div className="w-full">
                  <FormControl tabIndex={0}>
                    <ComboboxPhysician
                      options={physician.map((x) => x.uid)}
                      value={field.value}
                      setValue={(x: any) => {
                        field.onChange(x);
                        form.setFocus("referring_provider");
                      }}
                    />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referring_provider"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Referring Provider*
                </FormLabel>
                <div className="w-full">
                  <FormControl
                  // onKeyDown={(event) => {
                  //   // if (event.key === "Backspace") {
                  //   // field.value = "";
                  //   console.log("backspace detected");
                  //   // }
                  // }}
                  >
                    <Combobox
                      options={referring_providers}
                      value={field.value}
                      setValue={(x: any) => {
                        field.onChange(x);
                        form.setFocus("first_name");
                      }}
                      shouldOpen={
                        Boolean(form.getValues("physician").length) &&
                        !form.getValues("referring_provider").length
                      }
                    />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  First Name*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="First Name" type="text" {...field} />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="middle_name"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Middle Name
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Middle Name" type="text" {...field} />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Last Name*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Last Name" type="text" {...field} />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="space-y-2 col-span-1 md:col-span-1 flex justify-between items-center gap-2">
            <FormField
              control={form.control}
              name="mobile_number"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                  <FormLabel className="max-w-32 verysmall:w-56 leading-snug">
                    Mobile Number*
                  </FormLabel>
                  <div className="w-fit">
                    <FormControl className="">
                      <PhoneInput
                        inputProps={{
                          name: "",
                        }}
                        inputClass="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        specialLabel=""
                        country={"us"}
                        onChange={field.onChange}
                        value={field.value}
                        disableDropdown={true}
                        countryCodeEditable={true}
                      />
                    </FormControl>
                    {/* <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div> */}
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="home_phone_number"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                  <FormLabel className="max-w-32 verysmall:w-56 leading-snug">
                    Home Number
                  </FormLabel>
                  <div className="w-fit">
                    <FormControl tabIndex={-1}>
                      <PhoneInput
                        inputProps={{
                          name: "",
                          tabIndex: -1,
                        }}
                        inputClass="flex h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300"
                        specialLabel=""
                        country={"us"}
                        onChange={(x) => {
                          field.onChange(x);
                          form.trigger("mobile_number", {
                            shouldFocus: true,
                          });
                        }}
                        value={field.value}
                        disableDropdown={true}
                        countryCodeEditable={true}
                      />
                    </FormControl>
                    <div className="h-fit block">
                      {/* <FormMessage className="mt-[2px]" /> */}
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div
            className={cn(
              "h-fit w-full block text-left",
              form.formState.errors.home_phone_number?.message && "text-right"
            )}
          >
            {/* {form.formState.errors && (
              <div className="text-red-500">
                {form.formState.errors.home_phone_number.message}
              </div>
            )} */}
            {form.formState.errors.home_phone_number?.message && (
              <FormField
                name="home_phone_number"
                render={({ field }) => (
                  <FormMessage className="mt-[2px]">
                    {form.formState.errors.home_phone_number?.message}
                  </FormMessage>
                )}
              />
            )}
            {form.formState.errors.mobile_number?.message && (
              <FormField
                name="mobile_number"
                render={({ field }) => (
                  <FormMessage className="mt-[2px]">
                    {form.formState.errors.mobile_number?.message}
                  </FormMessage>
                )}
              />
            )}
            {/* <FormMessage name="home_phone_number" className="mt-[2px]" /> */}
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Email*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input placeholder="Email" type="text" {...field} />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferred_contact_method"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Preferred Contact Method
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Combobox
                      searchEmptyText=""
                      searchText="Select Your preferred contact method"
                      options={["Mobile Number", "Email", "Home Number"]}
                      value={field.value}
                      setValue={(x: any) => {
                        field.onChange(x);
                      }}
                    />
                    {/* <Select onValueChange={field.onChange} {...field}>
                      <SelectTrigger className="w-full my-trigger">
                        <SelectValue placeholder="select any one" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select> */}
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Birth Sex*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Combobox
                      searchEmptyText=""
                      searchText="Select Birth Sex"
                      options={["Male", "Female", "Prefer Not To Say"]}
                      value={field.value}
                      setValue={(x: any) => {
                        field.onChange(x);
                      }}
                      shouldOpen={
                        Boolean(
                          form.getValues("preferred_contact_method")?.length
                        ) && !form.getValues("sex")?.length
                      }
                    />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date_of_birth"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Date Of Birth*
                </FormLabel>
                <div className="w-full">
                  <FormControl className="grandparent ">
                    <DateInput
                      granularity="day"
                      value={value}
                      onChange={(_) => {
                        console.log(_);
                        field.onChange(_);
                      }}
                      isRequired
                      maxValue={_their_today(getLocalTimeZone())}
                      minValue={parseDate("1880-01-01")}
                      errorMessage={(value) => {
                        if (value.isInvalid) {
                          return "Please enter a valid birth date.";
                        }
                      }}
                      // isInvalid={false}
                      classNames={{
                        errorMessage:
                          "text-red-500 text-[14px] font-[500] -mt-2",
                      }}
                      className=" !bg-white my-date-picker "
                    />
                  </FormControl>
                  {/* <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div> */}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address_line_1"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Address*
                </FormLabel>
                <div className="w-full flex flex-col items-center">
                  <FormControl>
                    <Input type="text" placeholder="Address..." {...field} />
                  </FormControl>
                  <div className="h-fit w-full text-left block">
                    <FormMessage className="mt-[2px] " />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="col-span-1 flex justify-start items-start gap-2">
            <div className="w-24 verysmall:w-56 leading-snug"></div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between">
                  <FormLabel className=" w-[0.63rem] leading-snug">
                    {false && "City"}
                  </FormLabel>
                  <div className="w-32">
                    <FormControl>
                      <Input placeholder="City" type="text" {...field} />
                    </FormControl>
                    <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-fit leading-snug">
                    {false && "State"}
                  </FormLabel>
                  <div className="w-full">
                    <FormControl>
                      {/* <Input placeholder="State" type="text" {...field} /> */}
                      <Combobox
                        options={all_US_States.map((x) => x.isoCode)}
                        value={field.value}
                        setValue={(x: any) => {
                          field.onChange(x);
                          form.setFocus("zip_code");
                          // const ind = all_US_States.findIndex(
                          //   (_x) => _x.name == x
                          // );
                          // const _iso_code = all_US_States[ind].isoCode;
                          // //@ts-ignore
                          // setCityOptions(City.getCitiesOfState("US", _iso_code));
                        }}
                        searchEmptyText="No State found"
                        searchText="Search Your State"
                      />
                    </FormControl>
                    <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="zip_code"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormLabel className="w-fit leading-snug">
                    {false && "Zip Code"}
                  </FormLabel>
                  <div className="w-28">
                    <FormControl>
                      <Input placeholder="Postal code" type="text" {...field} />
                    </FormControl>
                    <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="font-semibold text-lg mt-2">Primary Insurance</div>

          <FormField
            control={form.control}
            name="insurance_company"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Company*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Combobox
                      options={insuranceNames}
                      setValue={(x: any) => {
                        if (x != "none") {
                          field.onChange(x);
                          form.setFocus("insurance_member_id");
                        } else {
                          form.resetField("insurance_company");
                        }
                        // const ind = all_US_States.findIndex(
                        //   (_x) => _x.name == x
                        // );
                        // const _iso_code = all_US_States[ind].isoCode;
                        // //@ts-ignore
                        // setCityOptions(City.getCitiesOfState("US", _iso_code));
                      }}
                      value={field.value}
                      searchEmptyText="No Insurance Company found with given name"
                      searchText="Search Insurance Company"
                    />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="insurance_member_id"
            render={({ field }) => (
              <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                <FormLabel className="w-32 verysmall:w-56 leading-snug">
                  Member ID*
                </FormLabel>
                <div className="w-full">
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Primary Insurance Member ID"
                      {...field}
                    />
                  </FormControl>
                  <div className="h-fit block">
                    <FormMessage className="mt-[2px]" />
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="font-semibold text-lg mt-2">Secondary Insurance</div>

          <>
            <FormField
              control={form.control}
              name="secondary_insurance_company"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                  <FormLabel className="w-32 verysmall:w-56 leading-snug">
                    Company*
                  </FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Combobox
                        options={insuranceNames}
                        setValue={(x: any) => {
                          if (x != "none") {
                            field.onChange(x);
                            form.setFocus("secondary_insurance_member_id");
                          } else {
                            form.resetField("secondary_insurance_company");
                          }
                          // const ind = all_US_States.findIndex(
                          //   (_x) => _x.name == x
                          // );
                          // const _iso_code = all_US_States[ind].isoCode;
                          // //@ts-ignore
                          // setCityOptions(City.getCitiesOfState("US", _iso_code));
                        }}
                        onFocusEvent={false}
                        value={field.value}
                        searchEmptyText="No Insurance Company found with given name"
                        searchText="Search Insurance Company"
                      />
                    </FormControl>
                    <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secondary_insurance_member_id"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-1 flex items-center gap-2">
                  <FormLabel className="w-32 verysmall:w-56 leading-snug">
                    Member ID*
                  </FormLabel>
                  <div className="w-full">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Secondary Insurance Member ID"
                        {...field}
                      />
                    </FormControl>
                    <div className="h-fit block">
                      <FormMessage className="mt-[2px]" />
                    </div>
                  </div>
                </FormItem>
              )}
            />
          </>
        </div>
        <div className="mt-4">
          <Button disabled={loading} type="submit">
            {loading && <LoaderCircle className="animate-spin mr-2" />} Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
