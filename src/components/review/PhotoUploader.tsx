'use client';

import { useState } from 'react';

export function PhotoUploader({
  max = 3,
  onUploaded,
}: {
  max?: number;
  onUploaded: (urls: string[]) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  async function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    const list = Array.from(files).slice(0, max);
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const f of list) {
        const form = new FormData();
        form.append('file', f);
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        uploaded.push(data.url);
      }
      const next = [...urls, ...uploaded].slice(0, max);
      setUrls(next);
      onUploaded(next);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-xl border p-3">
      <div className="mb-2 text-sm">写真アップロード（最大 {max} 枚）</div>
      <input type="file" accept="image/*" multiple onChange={handleSelect} />
      {uploading && <div className="mt-2 text-xs text-gray-500">アップロード中...</div>}
      {!!urls.length && (
        <div className="mt-2 flex flex-wrap gap-2">
          {urls.map((u) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={u} src={u} alt="" className="h-20 w-20 rounded-lg object-cover" />
          ))}
        </div>
      )}
    </div>
  );
}
