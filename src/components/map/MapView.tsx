'use client';

import { useEffect, useRef } from 'react';

type Marker = { id: string; lat: number; lng: number; title: string; rating: number };

declare global {
  interface Window {
    initGmap?: () => void;
  }
}

export default function MapView({ markers }: { markers: Marker[] }) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    function load() {
      if (!mapRef.current) return;
      // @ts-ignore
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 35.681236, lng: 139.767125 },
        zoom: 11,
        mapId: 'GOURMET_RECORD',
      });
      const info = new google.maps.InfoWindow();
      markers.forEach((m) => {
        // @ts-ignore
        const marker = new google.maps.Marker({
          position: { lat: m.lat, lng: m.lng },
          map,
          title: m.title,
        });
        marker.addListener('click', () => {
          info.setContent(
            `<div style="min-width:160px"><strong>${m.title}</strong><br/>⭐ ${m.rating.toFixed(
              1,
            )}<br/><a href="/reviews/new?storeId=${m.id}">レビューする</a></div>`,
          );
          info.open({ map, anchor: marker });
        });
      });
    }

    // Google Maps JS API を動的ロード
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hasGoogle = (globalThis as any).google && (globalThis as any).google.maps;
    if (!hasGoogle) {
      script = document.createElement('script');
      const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
      script.async = true;
      script.onload = load;
      document.body.appendChild(script);
    } else {
      load();
    }

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, [markers]);

  return <div ref={mapRef} className="h-full w-full rounded-2xl" />;
}
