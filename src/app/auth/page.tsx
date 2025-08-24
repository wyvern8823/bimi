'use client';

import { signInWithGoogle, doSignOut, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';

export default function AuthPage() {
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);
  return (
    <main className="mx-auto max-w-screen-sm px-3">
      <h1 className="py-4 text-lg font-bold">認証</h1>
      {user ? (
        <div className="rounded-2xl border p-3">
          <div className="text-sm">こんにちは、{user.displayName}</div>
          <button onClick={doSignOut} className="mt-2 rounded-lg border px-3 py-1 text-sm">
            サインアウト
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border p-3">
          <button onClick={signInWithGoogle} className="rounded-lg border px-3 py-1 text-sm">
            Googleでサインイン
          </button>
        </div>
      )}
    </main>
  );
}
