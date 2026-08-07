"use client";

import Image from "next/image";
import { useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useImageUpload } from "@/shared/hooks/useImageUpload";

interface ProductImagesInputProps {
  value: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export function ProductImagesInput({ value, onChange, max = 6 }: ProductImagesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadMany, isUploading } = useImageUpload();

  const handleFiles = async (files: FileList | null) => {
    if (!files?.length) return;

    const room = max - value.length;
    const urls = await uploadMany(Array.from(files).slice(0, room));
    if (urls.length) onChange([...value, ...urls]);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <Label>صور المنتج</Label>

      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div key={url} className="relative size-24 overflow-hidden rounded-xl border">
            <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((image) => image !== url))}
              className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white"
              aria-label="حذف الصورة"
            >
              <X className="size-3" aria-hidden />
            </button>
          </div>
        ))}

        {value.length < max && (
          <Button
            type="button"
            variant="outline"
            className="size-24 flex-col gap-1 border-dashed"
            disabled={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            {isUploading ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="size-5" aria-hidden />
            )}
            <span className="text-xs">أضف صورة</span>
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(event) => handleFiles(event.target.files)}
      />
      <p className="text-xs text-muted-foreground">حتى {max} صور، كل صورة أقل من 5 ميجابايت.</p>
    </div>
  );
}
