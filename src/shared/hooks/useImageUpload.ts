"use client";

import { useState } from "react";
import { toast } from "sonner";
import { apiClient, getErrorMessage } from "@/shared/lib/apiClient";

export function useImageUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadOne = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("image", file);

    setIsUploading(true);
    try {
      const { data } = await apiClient.post<{ url: string }>("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.url;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMany = async (files: File[]): Promise<string[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    setIsUploading(true);
    try {
      const { data } = await apiClient.post<{ urls: string[] }>("/upload/multiple", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data.urls;
    } catch (error) {
      toast.error(getErrorMessage(error));
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadOne, uploadMany, isUploading };
}
