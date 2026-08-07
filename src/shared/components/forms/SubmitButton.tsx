import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  isSubmitting: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({ isSubmitting, children, className }: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={isSubmitting} className={className}>
      {isSubmitting && <Loader2 className="size-4 animate-spin" aria-hidden />}
      {children}
    </Button>
  );
}
