"use client";

import type { ReactNode } from "react";
import {
  FormProvider,
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { cn } from "@/lib/utils";
import { SubmitButton } from "@/shared/components/forms/SubmitButton";

/**
 * Any zod object schema. Both sides are pinned to `FieldValues` because
 * react-hook-form only works with objects, and a schema whose input is a string
 * or an array would fail deep inside RHF's types rather than at the call site.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormSchema = z.ZodType<FieldValues, any, any>;

/** What `onSubmit` gets as its second argument — enough for `reset`, not the whole hook. */
export type FormApi<S extends FormSchema> = UseFormReturn<z.input<S>, unknown, z.output<S>>;

interface AppFormProps<S extends FormSchema> {
  schema: S;
  /**
   * Receives parsed values (post-coercion) and the form itself, so a caller that
   * needs to clear the fields afterwards can call `form.reset()` without this
   * component having to guess whether it should.
   */
  onSubmit: (values: z.output<S>, form: FormApi<S>) => Promise<unknown> | void;
  defaultValues?: DefaultValues<z.input<S>>;
  /** Reactive alternative to `defaultValues`, for fields fed by a server query. */
  values?: z.input<S>;
  submitLabel: string;
  /**
   * Folded into `isSubmitting`. RHF drops that flag the moment the promise settles,
   * which is before a mutation's `onSuccess` has navigated or invalidated — so the
   * button flickers back to life for a frame without this.
   */
  isPending?: boolean;
  className?: string;
  submitClassName?: string;
  /** Plain JSX for the common case; a function when a field needs `watch` or `control`. */
  children: ReactNode | ((form: FormApi<S>) => ReactNode);
}

/**
 * Owns the parts every form in the app repeats: the resolver wiring, the `<form>`
 * element, vertical rhythm, and the submit button.
 *
 * The three type arguments to `useForm` are not optional here — schemas using
 * `z.coerce` or `.default()` have an input type that differs from their output, so
 * `z.input` describes what the fields hold and `z.output` what `onSubmit` receives.
 */
export function AppForm<S extends FormSchema>({
  schema,
  onSubmit,
  defaultValues,
  values,
  submitLabel,
  isPending,
  className,
  submitClassName,
  children,
}: AppFormProps<S>) {
  const form = useForm<z.input<S>, unknown, z.output<S>>({
    resolver: zodResolver(schema),
    defaultValues,
    values,
  });

  return (
    // Spread rather than passed as one prop: this is RHF's own context shape, and it
    // is what lets the field components below resolve everything from a `name`.
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit((parsed) => onSubmit(parsed, form))}
        className={cn("space-y-4", className)}
        noValidate
      >
        {typeof children === "function" ? children(form) : children}

        <SubmitButton
          isSubmitting={form.formState.isSubmitting || Boolean(isPending)}
          className={submitClassName}
        >
          {submitLabel}
        </SubmitButton>
      </form>
    </FormProvider>
  );
}
