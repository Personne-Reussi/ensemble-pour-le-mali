"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string | null;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(path, file);

    if (uploadError) {
      setError(`Échec de l'envoi : ${uploadError.message}`);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("project-images").getPublicUrl(path);
    setValue(data.publicUrl);
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <label className="cursor-pointer bg-gray-50 border border-gray-200 hover:border-green text-gray-600 text-[13px] font-medium px-4 py-2 rounded-lg transition">
          {uploading ? "Envoi..." : "Choisir un fichier"}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {value && !uploading && (
          <span className="text-[12px] text-green">✓ Image prête</span>
        )}
      </div>

      {error && <p className="text-[12px] text-red-500">{error}</p>}

      {value && (
        <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      <input
        type="text"
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://... (ou choisis un fichier ci-dessus)"
        className="w-full border border-gray-200 rounded-lg px-3.5 py-2 text-[12px] text-gray-500 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
      />
    </div>
  );
}
