"use client";

import Image from "next/image";
import { useRef } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useImageUpload } from "@/shared/hooks/useImageUpload";

interface ImageUploadInputProps {
  value?: string;
  onChange: (url: string | undefined) => void;
  /** Square thumb by default; pass "wide" for banner-shaped images. */
  shape?: "square" | "wide";
}

/** Single-image picker: uploads through the API to Sirv and stores the URL. */
export function ImageUploadInput({ value, onChange, shape = "square" }: ImageUploadInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploadOne, isUploading } = useImageUpload();

  const handleFile = async (file?: File) => {
    if (!file) return;

    const url = await uploadOne(file);
    if (url) onChange(url);
    if (inputRef.current) inputRef.current.value = "";
  };

  const box = shape === "square" ? "size-24" : "h-24 w-40";

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <div className={`relative ${box} overflow-hidden rounded-xl border`}>
          <Image src={value} alt="" fill sizes="160px" className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute end-1 top-1 rounded-full bg-black/60 p-1 text-white"
            aria-label="حذف الصورة"
          >
            <X className="size-3" aria-hidden />
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className={`${box} flex-col gap-1 border-dashed`}
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-5" aria-hidden />
          )}
          <span className="text-xs">اختر صورة</span>
        </Button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <p className="text-xs text-muted-foreground">
        اختياري — بتظهر على كارت القسم في الصفحة الرئيسية.
      </p>
    </div>
  );
}
