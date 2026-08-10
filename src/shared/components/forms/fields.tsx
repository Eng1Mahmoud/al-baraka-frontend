"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import {
  Controller,
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
  type RegisterOptions,
} from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";

/**
 * Fields that resolve themselves from the form context `AppForm` provides, so a
 * field is declared once by name instead of three times — as the label's `htmlFor`,
 * as the control's `id`, and again inside `errors.x?.message`. Those three drifting
 * apart used to be a silent bug: the label simply stopped focusing its control.
 */

interface FieldProps {
  /** Doubles as the control's `id`, which is what keeps the label wired up. */
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
}

/** This field's error message, read from the form it is rendered inside. */
function useFieldError(name: string) {
  const { getFieldState, formState } = useFormContext();
  // formState is read here rather than destructured lazily: RHF hands back a Proxy
  // that records which slices a component touched, and that is what re-renders it.
  return getFieldState(name, formState).error?.message;
}

/** The shell every field shares — label above, hint or error below. */
function Shell({
  name,
  label,
  error,
  hint,
  required,
  className,
  children,
}: FieldProps & { error?: string; children: ReactNode }) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>

      {children}

      {/* The hint stands down once there is something wrong to say instead. */}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      {error && (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

type TextFieldProps = FieldProps &
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
    <Shell {...{ name, label, error, hint, required, className }}>
      <Input
        id={name}
        aria-invalid={Boolean(error)}
        {...inputProps}
        {...register(name, registerOptions)}
      />
    </Shell>
  );
}

type PasswordFieldProps = FieldProps &
  Omit<ComponentProps<typeof Input>, "id" | "name" | "type"> & {
    /** Start revealed — for a password being handed to someone, not typed by its owner. */
    defaultVisible?: boolean;
  };

/**
 * A password box with a reveal toggle. Typing a password you cannot see is the
 * usual reason people get locked out of their own account on a phone keyboard.
 */
export function PasswordField({
  name,
  label,
  hint,
  required,
  className,
  defaultVisible = false,
  ...inputProps
}: PasswordFieldProps) {
  const { register } = useFormContext();
  const error = useFieldError(name);
  const [isVisible, setIsVisible] = useState(defaultVisible);

  return (
    <Shell {...{ name, label, error, hint, required, className }}>
      {/* An LTR island: passwords read left-to-right, and this keeps the toggle on the
          box's right edge without the surrounding RTL page flipping it under the text. */}
      <div className="relative" dir="ltr">
        <Input
          id={name}
          type={isVisible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          // Physical, not logical: this box is pinned to LTR, so `right` is the truth
          // here and a logical property would only obscure which edge is meant.
          className="pr-9"
          {...inputProps}
          {...register(name)}
        />

        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {isVisible ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
        </Button>
      </div>
    </Shell>
  );
}

type TextareaFieldProps = FieldProps & Omit<ComponentProps<typeof Textarea>, "id" | "name">;

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
    <Shell {...{ name, label, error, hint, required, className }}>
      <Textarea id={name} aria-invalid={Boolean(error)} {...textareaProps} {...register(name)} />
    </Shell>
  );
}

interface SelectFieldProps extends FieldProps {
  options: { value: string; label: string }[];
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
    <Shell {...{ name, label, error, hint, required, className }}>
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
    </Shell>
  );
}

/**
 * A switch reads as one line, not as a labelled block, so it skips the shell and
 * puts its label beside the control instead of above it.
 */
export function SwitchField({
  name,
  label,
  className,
}: Pick<FieldProps, "name" | "label" | "className">) {
  const { control } = useFormContext();

  return (
    <div className={cn("flex items-center gap-3", className)}>
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

/** Escape hatch for controls with their own value shape — the image pickers. */
export function ControlledField({
  name,
  label,
  hint,
  required,
  className,
  render,
}: Omit<FieldProps, "label"> & {
  /** Omit when the control draws its own label, as ProductImagesInput does. */
  label?: string;
  render: (field: ControllerRenderProps<FieldValues, string>) => ReactNode;
}) {
  const { control } = useFormContext();
  const error = useFieldError(name);

  const controlled = (
    <Controller control={control} name={name} render={({ field }) => <>{render(field)}</>} />
  );

  if (!label) return controlled;

  return <Shell {...{ name, label, error, hint, required, className }}>{controlled}</Shell>;
}
