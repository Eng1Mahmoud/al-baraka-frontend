"use client";

import type { ComponentProps, ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/shared/components/forms/FormField";

/**
 * Fields that resolve themselves from the form context `AppForm` provides, so a
 * field is declared once by name instead of three times — as `htmlFor`, as `id`,
 * and again inside `errors.x?.message`. Those three drifting apart used to be a
 * silent bug: the label simply stopped focusing its control.
 */

interface BaseFieldProps {
  /** Doubles as the control's `id`, which is what keeps the label wired up. */
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

/** The one piece of context every field needs: this field's error message. */
function useFieldError(name: string) {
  const { getFieldState, formState } = useFormContext();
  // formState must be read here, not destructured lazily — RHF's Proxy tracks which
  // slices a component subscribes to, and `getFieldState` alone would not subscribe.
  return getFieldState(name, formState).error?.message;
}

type TextFieldProps = BaseFieldProps &
  Omit<ComponentProps<typeof Input>, "id" | "name"> & {
    /** Passed to `register` — `setValueAs`, `valueAsNumber`, and friends. */
    registerOptions?: RegisterOptions;
  };

export function TextField({
  name,
  label,
  hint,
  required,
  className,
  registerOptions,
  ...inputProps
}: TextFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);

  return (
    <FormField
      label={label}
      htmlFor={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Input id={name} aria-invalid={Boolean(error)} {...inputProps} {...register(name, registerOptions)} />
    </FormField>
  );
}

type TextareaFieldProps = BaseFieldProps & Omit<ComponentProps<typeof Textarea>, "id" | "name">;

export function TextareaField({
  name,
  label,
  hint,
  required,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);

  return (
    <FormField
      label={label}
      htmlFor={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Textarea id={name} aria-invalid={Boolean(error)} {...textareaProps} {...register(name)} />
    </FormField>
  );
}

interface SelectFieldProps extends BaseFieldProps {
  options: { value: string; label: ReactNode }[];
  placeholder?: string;
  disabled?: boolean;
  /** Extra work on change — checkout re-prices delivery off the chosen area. */
  onValueChange?: (value: string) => void;
}

export function SelectField({
  name,
  label,
  hint,
  required,
  className,
  options,
  placeholder,
  disabled,
  onValueChange,
}: SelectFieldProps) {
  const { control } = useFormContext();
  const error = useFieldError(name);

  return (
    <FormField
      label={label}
      htmlFor={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            value={field.value ?? ""}
            disabled={disabled}
            onValueChange={(value) => {
              field.onChange(value);
              onValueChange?.(value);
            }}
          >
            <SelectTrigger id={name} aria-invalid={Boolean(error)} className="w-full">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
    </FormField>
  );
}

/**
 * A switch reads as one line, not as a labelled block, so it skips `FormField`
 * and puts its label beside the control instead of above it.
 */
export function SwitchField({
  name,
  label,
  className,
}: Pick<BaseFieldProps, "name" | "label" | "className">) {
  const { control } = useFormContext();

  return (
    <div className={className ?? "flex items-center gap-3"}>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Switch id={name} checked={Boolean(field.value)} onCheckedChange={field.onChange} />
        )}
      />
      <Label htmlFor={name}>{label}</Label>
    </div>
  );
}

interface ControlledFieldProps extends Omit<BaseFieldProps, "label"> {
  /** Omit when the control draws its own label — the image inputs do. */
  label?: string;
  render: (field: ControllerRenderProps<FieldValues, string>) => ReactNode;
}

/** Escape hatch for controls with their own value shape: image pickers, and the like. */
export function ControlledField({
  name,
  label,
  hint,
  required,
  className,
  render,
}: ControlledFieldProps) {
  const { control } = useFormContext();
  const error = useFieldError(name);

  const controlled = (
    <Controller control={control} name={name} render={({ field }) => <>{render(field)}</>} />
  );

  if (!label) return controlled;

  return (
    <FormField
      label={label}
      htmlFor={name}
      error={error}
      hint={hint}
      required={required}
      className={className}
    >
      {controlled}
    </FormField>
  );
}
