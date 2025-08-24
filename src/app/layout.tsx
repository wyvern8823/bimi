import './globals.css';
import { ReactNode, useEffect } from 'react';
import { Toaster } from 'sonner';

export const metadata = {
  title: 'Gourmet Record',
  description: 'Map & JAN-based gourmet reviews',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-background text-foreground">
        <div className="mx-auto max-w-screen-2xl px-2 sm:px-4">
          <header className="flex items-center justify-between py-3">
            <a href="/" className="text-xl font-bold">🍣 GourmetRecord</a>
            <nav className="flex items-center gap-3 text-sm">
              <a href="/lists" className="hover:underline">My Lists</a>
              <a href="/products/new" className="hover:underline">Product Review</a>
              <a href="/reviews/new" className="hover:underline">Store Review</a>
              <a href="/campaigns" className="hover:underline">Campaigns</a>
              <a href="/admin" className="hover:underline">Admin</a>
              <a href="/auth" className="rounded-lg border px-2 py-1">Sign In</a>
            </nav>
          </header>
        </div>
        {children}
        <Toaster richColors />
        <a
          href="/reviews/new"
          className="fixed bottom-6 right-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl"
          aria-label="Add Review"
        >
          +
        </a>
      </body>
    </html>
  );
}
