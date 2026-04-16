'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { DailyEntry, MOOD_CONFIG } from '@/types'
import { formatDateVi } from '@/lib/helpers'

// Custom heart marker
function createHeartIcon(mood?: string | null) {
  const emoji = mood && MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG]
    ? MOOD_CONFIG[mood as keyof typeof MOOD_CONFIG].emoji
    : '📍'
  return L.divIcon({
    html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.2));cursor:pointer">${emoji}</div>`,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

function FitBounds({ entries }: { entries: DailyEntry[] }) {
  const map = useMap()
  useEffect(() => {
    const pts = entries.filter(e => e.location_lat && e.location_lng)
    if (pts.length > 0) {
      const bounds = L.latLngBounds(pts.map(e => [e.location_lat!, e.location_lng!]))
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
    }
  }, [entries, map])
  return null
}

export default function MapView({ entries }: { entries: DailyEntry[] }) {
  const locEntries = entries.filter(e => e.location_lat && e.location_lng)

  const center: [number, number] = locEntries.length > 0
    ? [locEntries[0].location_lat!, locEntries[0].location_lng!]
    : [10.8231, 106.6297]  // Default: Ho Chi Minh City

  return (
    <MapContainer
      center={center}
      zoom={12}
      className="w-full h-full rounded-3xl"
      style={{ minHeight: '60vh' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {locEntries.length > 1 && <FitBounds entries={locEntries} />}
      {locEntries.map(entry => (
        <Marker
          key={entry.id}
          position={[entry.location_lat!, entry.location_lng!]}
          icon={createHeartIcon(entry.mood)}
        >
          <Popup className="memory-popup">
            <div className="p-2 max-w-[220px]">
              <p className="text-xs font-bold text-[#3D2C35] mb-1">
                {entry.mood && MOOD_CONFIG[entry.mood as keyof typeof MOOD_CONFIG]?.emoji}{' '}
                {formatDateVi(entry.date)}
              </p>
              {entry.location_name && (
                <p className="text-xs text-[#7A5C6B] mb-1.5">📍 {entry.location_name}</p>
              )}
              {entry.note && (
                <p className="text-xs text-[#3D2C35] leading-relaxed line-clamp-3">{entry.note}</p>
              )}
              {entry.images?.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {entry.images.slice(0, 3).map((url, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={url} alt="" className="w-14 h-14 rounded-lg object-cover" />
                  ))}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
