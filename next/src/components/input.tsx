"use client";

import { ChangeEvent, useId, useRef } from "react";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "./ui/input";
import { ArrowRight, Search } from "lucide-react";

export default function SearchBar({
  values,
  loading,
}: {
  values: (value: string) => void;
  loading: boolean;
}) {
  // console.log(loading);
  let schema = z.object({
    search: z.string().min(1),
  });
  let form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      search: "",
    },
  });
  const onSubmit = (value: z.infer<typeof schema>) => {
    values(value.search);
    form.reset();
  };
  const id = useId();
  // const textareaRef = useRef<HTMLTextAreaElement>(null);
  // const defaultRows = 1;
  const maxRows = 6; // You can set a max number of rows

  // const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
  //   const textarea = e.target;
  //   textarea.style.height = "auto";

  //   const style = window.getComputedStyle(textarea);
  //   const borderHeight =
  //     parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth);
  //   const paddingHeight =
  //     parseInt(style.paddingTop) + parseInt(style.paddingBottom);

  //   const lineHeight = parseInt(style.lineHeight);
  //   const maxHeight = maxRows
  //     ? lineHeight * maxRows + borderHeight + paddingHeight
  //     : Infinity;

  //   const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight);

  //   textarea.style.height = `${newHeight}px`;
  // };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="search"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    id={id}
                    className={"peer pe-9 ps-9 py-6"}
                    placeholder={loading ? "Thinking" : "Search..."}
                    type="search"
                    disabled={loading}
                    {...field}
                  />
                  <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50 p-4">
                    <Search size={16} strokeWidth={2} />
                  </div>
                  <button
                    disabled={loading}
                    className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Submit search"
                    type="submit"
                  >
                    <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
