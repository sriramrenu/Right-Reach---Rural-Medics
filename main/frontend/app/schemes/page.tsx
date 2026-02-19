"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Search,
    Briefcase,
    Heart,
    MapPin,
    ExternalLink,
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from "lucide-react"
import Link from "next/link"

export default function SchemesPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en")
    const [matchedSchemes, setMatchedSchemes] = useState<any[]>([])
    const [user, setUser] = useState<any>(null)

    const languages = [
        { code: "en", name: "English", native: "English" },
        { code: "ta", name: "Tamil", native: "தமிழ்" },
        { code: "hi", name: "Hindi", native: "हिंदी" },
    ]

    const translations: any = {
        en: {
            title: "Scheme Matcher",
            subtitle: "Government health schemes tailored for you",
            matched: "Schemes you are eligible for",
            all: "All Health Schemes",
            apply: "Apply Now",
            eligibility: "Eligibility",
            back: "Home",
            scan: "Scan Documents to Match",
            noUser: "Connect your UHID for personalized matching",
        },
        ta: {
            title: "திட்டப் பொருத்தம்",
            subtitle: "உங்களுக்காக வடிவமைக்கப்பட்ட அரசு சுகாதாரத் திட்டங்கள்",
            matched: "நீங்கள் தகுதியுள்ள திட்டங்கள்",
            all: "அனைத்து சுகாதாரத் திட்டங்கள்",
            apply: "இப்பொழுதே விண்ணப்பிக்கவும்",
            eligibility: "தகுதி",
            back: "முகப்பு",
            scan: "பொருந்துவதற்கு ஆவணங்களை ஸ்கேன் செய்யவும்",
            noUser: "தனிப்பயனாக்கப்பட்ட பொருத்தத்திற்கு உங்கள் UHID ஐ இணைக்கவும்",
        }
    }

    const t = translations[selectedLanguage] || translations.en

    const allSchemes = [
        {
            id: "1",
            name: "Ayushman Bharat (PM-JAY)",
            description: "Provides coverage of up to ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
            category: "Central Government",
            coverage: "₹5,00,000",
            link: "https://pmjay.gov.in/",
            criteria: ["Income below threshold", "Rural background"],
        },
        {
            id: "2",
            name: "Janani Suraksha Yojana",
            description: "Direct cash transfer scheme for pregnant women to encourage institutional delivery.",
            category: "Maternal Health",
            coverage: "Cash Benefit",
            link: "https://nhm.gov.in/",
            criteria: ["Pregnant women", "BPL/SC/ST"],
        },
        {
            id: "3",
            name: "Tamil Nadu Chief Minister's Comprehensive Health Insurance Scheme",
            description: "Specially for people in Tamil Nadu with family income less than ₹1,20,000 per annum.",
            category: "State Government",
            coverage: "₹5,00,000",
            link: "https://www.cmchistn.com/",
            criteria: ["Tamil Nadu Resident", "Low Income"],
        },
    ]

    const getMatchedSchemes = useCallback((patient: any) => {
        return allSchemes.filter(scheme => {
            if (scheme.name.includes("Tamil Nadu") && patient.state?.toLowerCase() !== 'tamil nadu' && patient.state?.toLowerCase() !== 'tn') {
                return false; // Filter out state-specific if not matching
            }
            return true
        })
    }, [allSchemes])

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null')
        if (currentUser) {
            setUser(currentUser)
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

            fetch(`${API_URL}/api/patients/${currentUser.id}`)
                .then(res => res.json())
                .then(patientData => {
                    setMatchedSchemes(getMatchedSchemes(patientData))
                })
                .catch(() => {
                    setMatchedSchemes(allSchemes)
                })
        } else {
            setMatchedSchemes(allSchemes)
        }
    }, [getMatchedSchemes, allSchemes])

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="border-b bg-white">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                {t.back}
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-primary" />
                            {t.title}
                        </h1>
                    </div>
                    <div className="flex gap-2">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                variant={selectedLanguage === lang.code ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedLanguage(lang.code)}
                                className="text-xs"
                            >
                                {lang.native}
                            </Button>
                        ))}
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 bg-primary rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-2">{t.subtitle}</h2>
                        <p className="text-primary-foreground/90 max-w-xl">
                            Our AI engine analyzes your health profile and socioeconomic status to find the best government benefits for your family.
                        </p>
                        {!user && (
                            <div className="mt-6 flex gap-4">
                                <Link href="/register">
                                    <Button className="bg-white text-primary hover:bg-white/90">
                                        Register to Match
                                    </Button>
                                </Link>
                                <Button variant="outline" className="border-white/40 text-white hover:bg-white/10">
                                    <Search className="w-4 h-4 mr-2" />
                                    {t.scan}
                                </Button>
                            </div>
                        )}
                    </div>
                    <Heart className="absolute -bottom-10 -right-10 w-64 h-64 text-white/5" />
                </div>

                {user && (
                    <div className="mb-6 flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-lg">
                        <div className="bg-green-100 p-2 rounded-full">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-green-800">Direct Match Found</p>
                            <p className="text-xs text-green-700">Matched with your UHID: <span className="font-mono">{user.id}</span></p>
                        </div>
                    </div>
                )}

                <div className="grid gap-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-primary" />
                        {user ? t.matched : t.all}
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {matchedSchemes.map((scheme) => (
                            <Card key={scheme.id} className="group hover:border-primary/50 transition-all">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                                            {scheme.category}
                                        </Badge>
                                        <Badge variant="secondary" className="font-bold">
                                            {scheme.coverage}
                                        </Badge>
                                    </div>
                                    <CardTitle className="mt-4">{scheme.name}</CardTitle>
                                    <CardDescription className="line-clamp-2">{scheme.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                                                {t.eligibility}
                                            </h4>
                                            <ul className="grid grid-cols-2 gap-2">
                                                {scheme.criteria.map((c: string, idx: number) => (
                                                    <li key={idx} className="text-sm flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                        {c}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button className="flex-1">
                                                {t.apply}
                                            </Button>
                                            <Link href={scheme.link} target="_blank">
                                                <Button variant="outline" size="icon">
                                                    <ExternalLink className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {!user && (
                    <Card className="mt-12 bg-amber-50 border-amber-200">
                        <CardContent className="p-6 flex items-center gap-4">
                            <AlertCircle className="w-8 h-8 text-amber-600" />
                            <div>
                                <p className="font-bold text-amber-800">Missing Profile Data</p>
                                <p className="text-sm text-amber-700">{t.noUser}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    )
}
