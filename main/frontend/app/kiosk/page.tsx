"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Mic,
    UserPlus,
    Stethoscope,
    Pill,
    Globe,
    HelpCircle,
    Phone,
    ArrowRight
} from "lucide-react"
import Link from "next/link"

export default function KioskModePage() {
    const [language, setLanguage] = useState<string | null>(null)

    const languages = [
        { code: "en", name: "English", native: "English", icon: "🇬🇧" },
        { code: "ta", name: "Tamil", native: "தமிழ்", icon: "🇮🇳" },
        { code: "hi", name: "Hindi", native: "हिंदी", icon: "🇮🇳" },
    ]

    const menuItems = [
        {
            title: { en: "New Registration", ta: "புதிய பதிவு", hi: "नया पंजीकरण" },
            icon: <UserPlus className="w-12 h-12" />,
            href: "/register",
            color: "bg-blue-600"
        },
        {
            title: { en: "Talk to Doctor", ta: "மருத்துவரிடம் பேசுங்கள்", hi: "डॉक्टर से बात करें" },
            icon: <Stethoscope className="w-12 h-12" />,
            href: "/telemedicine",
            color: "bg-green-600"
        },
        {
            title: { en: "Medicine Help", ta: "மருந்து உதவி", hi: "दवा सहायता" },
            icon: <Pill className="w-12 h-12" />,
            href: "/medicines",
            color: "bg-amber-600"
        },
        {
            title: { en: "Emergency", ta: "அவசரம்", hi: "आपातकालीन" },
            icon: <Phone className="w-12 h-12" />,
            href: "tel:108",
            color: "bg-destructive"
        }
    ]

    if (!language) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
                <div className="max-w-4xl w-full text-center space-y-12">
                    <div className="space-y-4">
                        <h1 className="text-5xl font-black text-white tracking-tight">RIGHT REACH KIOSK</h1>
                        <p className="text-xl text-slate-400">Please select your language to begin</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {languages.map((lang) => (
                            <Button
                                key={lang.code}
                                onClick={() => setLanguage(lang.code)}
                                className="h-48 rounded-3xl text-3xl font-bold flex flex-col gap-4 bg-white text-slate-900 hover:bg-primary hover:text-white transition-all shadow-2xl border-none"
                            >
                                <span className="text-6xl">{lang.icon}</span>
                                {lang.native}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Kiosk Header */}
            <header className="bg-white border-b-4 border-primary p-6 flex justify-between items-center shadow-md">
                <h2 className="text-3xl font-black text-primary flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                        <Globe className="w-6 h-6" />
                    </div>
                    RIGHT REACH
                </h2>
                <Button variant="outline" size="lg" onClick={() => setLanguage(null)} className="rounded-full border-2 text-xl font-bold px-8">
                    Change Language
                </Button>
            </header>

            {/* Main Grid */}
            <main className="flex-1 container mx-auto p-8 grid md:grid-cols-2 gap-8">
                {menuItems.map((item, idx) => (
                    <Link key={idx} href={item.href} className="flex">
                        <Card className={`w-full ${item.color} text-white rounded-3xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border-none overflow-hidden group`}>
                            <CardContent className="h-full p-8 flex items-center gap-8">
                                <div className="bg-white/20 p-6 rounded-2xl">
                                    {item.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-4xl font-black mb-2">{(item.title as any)[language] || (item.title as any).en}</h3>
                                    <div className="flex items-center gap-2 text-white/80 font-bold">
                                        Tap to start <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </main>

            {/* Voice Help Footer */}
            <footer className="p-8 bg-white border-t-2">
                <div className="max-w-4xl mx-auto bg-primary/5 rounded-3xl p-8 flex items-center justify-between border-2 border-dashed border-primary/20">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white animate-pulse">
                            <Mic className="w-10 h-10" />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold">Need help? Just speak to the machine</h4>
                            <p className="text-lg text-muted-foreground">The computer is listening for your commands in your native language.</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full h-16 w-16">
                        <HelpCircle className="w-12 h-12 text-primary" />
                    </Button>
                </div>
            </footer>
        </div>
    )
}
