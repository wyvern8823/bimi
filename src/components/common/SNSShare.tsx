'use client';

export function SNSShare({ url, text }: { url: string; text: string }) {
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(text);
  return (
    <div className="flex flex-wrap gap-2">
      <a
        className="rounded-lg border px-2 py-1 text-sm"
        href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        X で共有
      </a>
      <a
        className="rounded-lg border px-2 py-1 text-sm"
        href={`https://www.instagram.com/`}
        target="_blank"
        rel="noreferrer"
      >
        Instagram（リンク）
      </a>
      <a
        className="rounded-lg border px-2 py-1 text-sm"
        href={`https://line.me/R/msg/text/?${encodedText}%0D%0A${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        LINE で共有
      </a>
    </div>
  );
}
