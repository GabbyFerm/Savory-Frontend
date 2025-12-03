import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  maxSizeMB?: number;
  disabled?: boolean;
}

export default function ImageUpload({
  currentImage,
  onImageSelect,
  onImageRemove,
  maxSizeMB = 5,
  disabled = false,
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError("");

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPG, PNG, or WebP)");
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Notify parent
    onImageSelect(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageRemove?.();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {preview ? (
        /* Image Preview */
        <div className="relative w-full h-64 rounded-lg overflow-hidden border-2 border-primary/40">
          <img
            src={preview}
            alt="Recipe preview"
            className="w-full h-full object-cover"
          />
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full transition-colors shadow-lg"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ) : (
        /* Upload Area */
        <div
          onClick={disabled ? undefined : handleClick}
          className={`w-full h-64 border-2 border-dashed border-primary/40 rounded-lg flex flex-col items-center justify-center transition-colors ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-primary/5 hover:bg-primary/10 cursor-pointer"
          }`}
        >
          <div className="bg-primary/20 p-4 rounded-full mb-4">
            <Upload size={40} className="text-primary" />
          </div>
          <p className="text-darkTeal font-semibold mb-1">
            Click to upload image
          </p>
          <p className="text-darkTeal/60 text-sm">
            JPG, PNG or WebP (max {maxSizeMB}MB)
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
