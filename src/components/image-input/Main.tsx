"use client";

import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  Controller,
  FieldValues,
  useFormContext,
  useFormState,
} from "react-hook-form";

import { Button } from "../button";
import { IProps } from "./types";

/**
 * `react-hook-form`-connected image field. Uploads the picked file to
 * `/api/upload/image` (Cloudinary) and stores the returned URL as the
 * field value. Must be used inside a `<Form>`.
 *
 * Validates file type (image only) and max size (5MB) client-side before
 * uploading.
 *
 * @example
 * <ImageInput<ProductForm> name="image" label="Product image" />
 */
const ImageInput = <T extends FieldValues>({
  name,
  label,
  placeholder = "اختر صورة من الجهاز",
  className,
  disabled = false,
}: IProps<T>) => {
  const { control } = useFormContext<T>();
  const { errors } = useFormState({ control, name });

  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const error = errors[name];

  const errorMessage =
    typeof error?.message === "string" && error.message
      ? error.message
      : error?.type === "required"
        ? "This field is required"
        : uploadError || undefined;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const imageUrl = typeof field.value === "string" ? field.value : "";

        const openFilePicker = () => {
          if (disabled || uploading) return;

          inputRef.current?.click();
        };

        const handleFileChange = async (
          event: React.ChangeEvent<HTMLInputElement>,
        ) => {
          const file = event.target.files?.[0];

          if (!file) return;

          setUploadError("");

          if (!file.type.startsWith("image/")) {
            setUploadError("يرجى اختيار صورة صحيحة");
            event.target.value = "";
            return;
          }

          const maxSize = 5 * 1024 * 1024;

          if (file.size > maxSize) {
            setUploadError("حجم الصورة يجب ألا يتجاوز 5 ميجابايت");
            event.target.value = "";
            return;
          }

          setUploading(true);

          try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await fetch("/api/upload/image", {
              method: "POST",
              body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
              setUploadError(result.message || "فشل رفع الصورة");
              return;
            }

            field.onChange(result.url);
            field.onBlur();
          } catch {
            setUploadError("حدث خطأ أثناء رفع الصورة");
          } finally {
            setUploading(false);
            event.target.value = "";
          }
        };

        const handleRemove = () => {
          if (disabled || uploading) return;

          field.onChange("");
          field.onBlur();
          setUploadError("");
        };

        return (
          <div className={`flex flex-col gap-1 ${className ?? ""}`}>
            {label && (
              <label
                htmlFor={name}
                className={`text-sm font-medium ${error ? "text-danger" : "text-foreground"}`}
              >
                {label}
              </label>
            )}

            <input
              ref={inputRef}
              id={name}
              type="file"
              accept="image/*"
              disabled={disabled || uploading}
              className="hidden"
              onChange={handleFileChange}
            />

            {imageUrl ? (
              <div className="relative overflow-hidden border border-main/20 bg-background">
                <div className="relative flex min-h-48 items-center justify-center bg-muted/20 p-3">
                  <div className="relative h-64 w-full">
                    <Image
                      src={imageUrl}
                      alt="معاينة الصورة"
                      fill
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-contain"
                    />
                  </div>

                  <Button
                    type="button"
                    color="DANGER"
                    size="icon"
                    disabled={disabled || uploading}
                    onClick={handleRemove}
                    className="absolute left-2 top-2"
                  >
                    <X className="size-4" />
                  </Button>

                  {uploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-background/70 backdrop-blur-sm">
                      <Loader2 className="size-7 animate-spin text-main" />

                      <span className="text-sm font-medium text-foreground">
                        جاري رفع الصورة...
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-main/20 p-2">
                  <span className="truncate text-xs text-muted-foreground">
                    تم رفع الصورة بنجاح
                  </span>

                  <Button
                    type="button"
                    color="INFO"
                    variant="soft"
                    size="sm"
                    disabled={disabled || uploading}
                    onClick={openFilePicker}
                  >
                    تغيير
                  </Button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={openFilePicker}
                className={`flex min-h-36 w-full flex-col items-center justify-center gap-2 border border-dashed bg-background px-4 py-6 text-center outline-none transition-all duration-200 hover:border-main/50 hover:bg-main/5 focus:border-main/60 focus:ring-2 focus:ring-main/15 disabled:cursor-not-allowed disabled:opacity-50 ${error ? "border-danger" : "border-main/20"}`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="size-7 animate-spin text-main" />

                    <span className="text-sm font-medium text-foreground">
                      جاري رفع الصورة...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex size-10 items-center justify-center bg-main/10 text-main">
                      <ImagePlus className="size-5" />
                    </div>

                    <span className="text-sm font-medium text-foreground">
                      {placeholder}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP — بحد أقصى 5 ميجابايت
                    </span>
                  </>
                )}
              </button>
            )}

            {errorMessage && (
              <span className="text-xs font-medium text-danger">
                {errorMessage}
              </span>
            )}
          </div>
        );
      }}
    />
  );
};

export default ImageInput;
