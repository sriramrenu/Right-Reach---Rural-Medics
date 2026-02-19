"use client"

import dynamic from "next/dynamic"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft, MapPin, Clock, Phone, Users, Navigation,
    Activity, Search, CheckCircle2, Calendar,
} from "lucide-react"
import Link from "next/link"
import type { CampLocation } from "@/components/CampMap"

// Dynamic import prevents SSR issues with Leaflet
const CampMap = dynamic(() => import("@/components/CampMap"), { ssr: false })

const camps: CampLocation[] = [
    {
        id: "1",
        name: "Mega Eye Checkup Camp",
        location: "Government Hospital, Coimbatore",
        lat: 11.0168,
        lng: 76.9558,
        date: "Active Now",
        time: "09:00 AM – 05:00 PM",
        organizer: "Health Dept & Rotary Club",
        services: ["Eye testing", "Free glasses", "Cataract screening"],
        status: "active",
        distance: "2.1 km",
        contact: "tel:+919876543210",
    },
    {
        id: "2",
        name: "Maternal & Child Health Camp",
        location: "PHC Adyar, Chennai",
        lat: 13.0067,
        lng: 80.2560,
        date: "Active Now",
        time: "08:00 AM – 04:00 PM",
        organizer: "District Health Society",
        services: ["Vaccination", "Prenatal checkup", "Nutrition advice"],
        status: "active",
        distance: "3.5 km",
        contact: "tel:+918765432109",
    },
    {
        id: "3",
        name: "Diabetes Awareness & Testing",
        location: "Community Hall, Madurai",
        lat: 9.9252,
        lng: 78.1198,
        date: "Active Now",
        time: "09:00 AM – 02:00 PM",
        organizer: "Lions Club International",
        services: ["Sugar testing", "Diet planning", "Cardio screening"],
        status: "active",
        distance: "1.8 km",
        contact: "tel:+917654321098",
    },
    {
        id: "4",
        name: "Blood Donation Drive",
        location: "Government Medical College, Trichy",
        lat: 10.7905,
        lng: 78.7047,
        date: "Feb 25, 2026",
        time: "09:00 AM – 03:00 PM",
        organizer: "Red Cross Society",
        services: ["Blood donation", "Haemoglobin test", "Free refreshments"],
        status: "upcoming",
        distance: "5.0 km",
        contact: "tel:+916543210987",
    },
    {
        id: "5",
        name: "Dental & ENT Health Camp",
        location: "Rajaji Hospital, Salem",
        lat: 11.6643,
        lng: 78.1460,
        date: "Mar 2, 2026",
        time: "10:00 AM – 04:00 PM",
        organizer: "Tamil Nadu Health Mission",
        services: ["Dental checkup", "ENT screening", "Free medicines"],
        status: "upcoming",
        distance: "3.2 km",
        contact: "tel:+915432109876",
    },
    {
        id: "6",
        name: "Orthopaedic & Bone Health Camp",
        location: "Tirunelveli Medical College",
        lat: 8.7139,
        lng: 77.7567,
        date: "Active Now",
        time: "08:30 AM – 01:00 PM",
        organizer: "Apollo Reach Foundation",
        services: ["Bone density test", "Joint pain clinic", "Physiotherapy"],
        status: "active",
        distance: "4.7 km",
        contact: "tel:+914321098765",
    },
]

const languages = [
    { code: "en", native: "English" },
    { code: "ta", native: "தமிழ்" },
    { code: "hi", native: "हिंदी" },
]

const translations: Record<string, Record<string, string>> = {
    en: { title: "Health Camp Locator", active: "Active Camps", upcoming: "Upcoming Camps", search: "Search by village or service...", navigate: "Directions", contact: "Call", back: "Home" },
    ta: { title: "சுகாதார முகாம் லொக்கேட்டர்", active: "செயலில் உள்ள முகாம்கள்", upcoming: "வரவிருக்கும் முகாம்கள்", search: "கிராமம் மூலம் தேடுங்கள்", navigate: "திசைகள்", contact: "அழைக்கவும்", back: "முகப்பு" },
    hi: { title: "स्वास्थ्य शिविर लोकेटर", active: "सक्रिय शिविर", upcoming: "आगामी शिविर", search: "गांव या सेवा खोजें", navigate: "दिशाएं", contact: "कॉल करें", back: "होम" },
}

export default function HealthCampsPage() {
    const [lang, setLang] = useState("en")
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCamp, setSelectedCamp] = useState<CampLocation>(camps[0])
    const t = translations[lang] || translations.en

    const filtered = camps.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.services.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="border-b bg-white sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="w-4 h-4 mr-2" />{t.back}</Button></Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-primary" />{t.title}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {languages.map(l => (
                            <Button key={l.code} variant={lang === l.code ? "default" : "outline"} size="sm" onClick={() => setLang(l.code)} className="text-xs">
                                {l.native}
                            </Button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6" style={{ alignItems: 'start' }}>
                    {/* Left panel */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" placeholder={t.search} value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm" />
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.active}</p>
                            {filtered.filter(c => c.status === "active").map(camp => (
                                <Card key={camp.id} onClick={() => setSelectedCamp(camp)}
                                    className={`cursor-pointer transition-all border-2 shadow-sm ${selectedCamp?.id === camp.id ? "border-primary shadow-md" : "border-transparent hover:border-primary/40"}`}>
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-1">
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200 text-xs">
                                                <Activity className="w-2.5 h-2.5 mr-1 inline" />{camp.date}
                                            </Badge>
                                            <span className="text-xs font-bold text-primary">{camp.distance}</span>
                                        </div>
                                        <h4 className="font-bold text-sm mt-1">{camp.name}</h4>
                                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{camp.location}</p>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                            {camp.services.map((s, i) => <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>)}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mt-4">{t.upcoming}</p>
                            {filtered.filter(c => c.status === "upcoming").map(camp => (
                                <Card key={camp.id} onClick={() => setSelectedCamp(camp)}
                                    className={`cursor-pointer transition-all opacity-80 border-2 ${selectedCamp?.id === camp.id ? "border-primary opacity-100 shadow-md" : "border-transparent hover:border-primary/40 hover:opacity-100"}`}>
                                    <CardContent className="p-4">
                                        <Badge variant="outline" className="text-xs mb-1"><Calendar className="w-2.5 h-2.5 mr-1 inline" />{camp.date}</Badge>
                                        <h4 className="font-bold text-sm">{camp.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-0.5">{camp.location}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Right: Real Map */}
                    <div className="lg:col-span-2">
                        <Card className="overflow-hidden shadow-lg border-0" style={{ height: "580px" }}>
                            <CardContent className="p-0 h-full relative">
                                <CampMap
                                    camps={camps}
                                    selectedId={selectedCamp?.id ?? null}
                                    onSelect={setSelectedCamp}
                                />

                                {/* Detail overlay */}
                                {selectedCamp && (
                                    <div className="absolute bottom-4 right-4 z-[1000] w-72">
                                        <Card className="bg-white/95 backdrop-blur shadow-2xl border">
                                            <CardHeader className="p-3 pb-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <CheckCircle2 className={`w-3.5 h-3.5 ${selectedCamp.status === "active" ? "text-green-500" : "text-amber-500"}`} />
                                                        <span className="text-xs font-semibold uppercase text-muted-foreground">
                                                            {selectedCamp.status === "active" ? "Active Now" : "Upcoming"}
                                                        </span>
                                                    </div>
                                                    <Badge variant="secondary" className="text-xs">{selectedCamp.distance}</Badge>
                                                </div>
                                                <CardTitle className="text-sm mt-1 leading-tight">{selectedCamp.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-3 pt-0 space-y-1.5">
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3 h-3" />{selectedCamp.location}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" />{selectedCamp.date} · {selectedCamp.time}</p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Users className="w-3 h-3" />{selectedCamp.organizer}</p>
                                                <div className="flex flex-wrap gap-1 pt-1">
                                                    {selectedCamp.services.map((s, i) => <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>)}
                                                </div>
                                                <div className="grid grid-cols-2 gap-2 pt-2">
                                                    <Button size="sm" className="gap-1 text-xs"
                                                        onClick={() => window.open(`https://www.google.com/maps?q=${selectedCamp.lat},${selectedCamp.lng}`, "_blank")}>
                                                        <Navigation className="w-3 h-3" />{t.navigate}
                                                    </Button>
                                                    <Button size="sm" variant="outline" className="gap-1 text-xs"
                                                        onClick={() => window.open(selectedCamp.contact)}>
                                                        <Phone className="w-3 h-3" />{t.contact}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
