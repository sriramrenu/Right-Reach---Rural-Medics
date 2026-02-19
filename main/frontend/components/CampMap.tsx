    "use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export interface CampLocation {
    id: string
    name: string
    location: string
    lat: number
    lng: number
    status: "active" | "upcoming"
    date: string
    time: string
    distance: string
    organizer: string
    services: string[]
    contact: string
}

interface CampMapProps {
    camps: CampLocation[]
    selectedId: string | null
    onSelect: (camp: CampLocation) => void
}

function makeIcon(status: "active" | "upcoming", isSelected: boolean) {
    const bg = isSelected ? "#7c3aed" : status === "active" ? "#3b82f6" : "#f59e0b"
    const size = isSelected ? 40 : status === "active" ? 34 : 30
    const emoji = status === "active" ? "⚕" : "📅"
    return L.divIcon({
        className: "",
        html: `<div style="
            background:${bg};
            width:${size}px;height:${size}px;
            border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);
            border:${isSelected ? 4 : 3}px solid white;
            box-shadow:0 3px 14px ${bg}88;
            display:flex;align-items:center;justify-content:center;
        ">
            <span style="transform:rotate(45deg);color:white;font-size:${isSelected ? 16 : 13}px;">${emoji}</span>
        </div>`,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -(size + 4)],
    })
}

export default function CampMap({ camps, selectedId, onSelect }: CampMapProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mapRef = useRef<L.Map | null>(null)
    const markersRef = useRef<Record<string, L.Marker>>({})

    // Initialise map once
    useEffect(() => {
        if (!containerRef.current) return
        // Guard: if already initialized (e.g. StrictMode double-mount), destroy first
        if (mapRef.current) {
            mapRef.current.remove()
            mapRef.current = null
        }

        const map = L.map(containerRef.current, {
            center: [11.5, 78.5], // Tamil Nadu center
            zoom: 7,
            zoomControl: true,
        })

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 18,
        }).addTo(map)

        mapRef.current = map

        // Add markers
        camps.forEach((camp) => {
            const marker = L.marker([camp.lat, camp.lng], {
                icon: makeIcon(camp.status, camp.id === selectedId),
            })
                .addTo(map)
                .bindPopup(`
                    <div style="min-width:160px;font-family:sans-serif">
                        <p style="font-weight:700;font-size:13px;margin:0 0 3px">${camp.name}</p>
                        <p style="font-size:11px;color:#64748b;margin:0 0 4px">${camp.location}</p>
                        <p style="font-size:11px;margin:0 0 6px">
                            <span style="color:${camp.status === 'active' ? '#16a34a' : '#d97706'};font-weight:600">
                                ${camp.date}
                            </span> · ${camp.time}
                        </p>
                        <p style="font-size:11px;color:#64748b;margin:0 0 8px">
                            ${camp.services.slice(0, 2).join(" · ")}
                        </p>
                        <button id="camp-btn-${camp.id}"
                            style="background:#2563eb;color:white;border:none;border-radius:6px;padding:5px 8px;font-size:11px;width:100%;cursor:pointer">
                            View Details
                        </button>
                    </div>
                `)
                .on("click", () => onSelect(camp))

            marker.on("popupopen", () => {
                const btn = document.getElementById(`camp-btn-${camp.id}`)
                if (btn) btn.onclick = () => onSelect(camp)
            })

            markersRef.current[camp.id] = marker
        })

        return () => {
            map.remove()
            mapRef.current = null
            markersRef.current = {}
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Update marker icons when selection changes
    useEffect(() => {
        camps.forEach((camp) => {
            const marker = markersRef.current[camp.id]
            if (marker) {
                marker.setIcon(makeIcon(camp.status, camp.id === selectedId))
            }
        })
    }, [selectedId, camps])

    // Fly to selected camp
    useEffect(() => {
        const camp = camps.find(c => c.id === selectedId)
        if (camp && mapRef.current) {
            mapRef.current.flyTo([camp.lat, camp.lng], 13, { animate: true, duration: 1.0 })
        }
    }, [selectedId, camps])

    return <div ref={containerRef} style={{ height: "100%", width: "100%", borderRadius: "inherit" }} />
}
