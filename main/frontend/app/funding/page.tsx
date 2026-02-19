"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    ArrowLeft,
    Coins,
    ShieldCheck,
    ExternalLink,
    Heart,
    History,
    TrendingUp,
    User,
    CheckCircle2,
    Lock
} from "lucide-react"
import Link from "next/link"

export default function FundingPage() {
    const [selectedLanguage, setSelectedLanguage] = useState("en")
    const [isDonating, setIsDonating] = useState<string | null>(null)

    const languages = [
        { code: "en", name: "English", native: "English" },
        { code: "ta", name: "Tamil", native: "தமிழ்" },
        { code: "hi", name: "Hindi", native: "हिंदी" },
    ]

    const translations: any = {
        en: {
            title: "Direct Support Ledger",
            subtitle: "Transparent blockchain-backed funding for medication",
            ledger: "Transparent Transaction Ledger",
            verified: "Admin Verified Cases",
            donate: "Support Case",
            hash: "Block Hash",
            amount: "Amount",
            status: "Status",
            back: "Home",
            tagline: "100% of funds go to the pharmaceutical provider directly",
        },
        ta: {
            title: "நேரடி ஆதரவு லெட்ஜர்",
            subtitle: "மருந்துகளுக்கான வெளிப்படையான பிளாக்செயின ஆதரவு நிதி",
            ledger: "வெளிப்படையான பரிவர்த்தனை லெட்ஜர்",
            verified: "நிர்வாகி சரிபார்க்கப்பட்ட வழக்குகள்",
            donate: "ஆதரவு வழக்கு",
            hash: "பிளாக் ஹாஷ்",
            amount: "தொகை",
            status: "நிலை",
            back: "முகப்பு",
            tagline: "100% நிதி நேரடியாக மருந்து வழங்குநருக்குச் செல்கிறது",
        }
    }

    const t = translations[selectedLanguage] || translations.en

    const cases = [
        {
            id: "CASE-902",
            patient: "Anonymous P. (UHID: 1029...)",
            condition: "Chronic Kidney Disease",
            medication: "Erythropoietin Injections",
            goal: 25000,
            raised: 18500,
            donors: 42,
            urgency: "High",
        },
        {
            id: "CASE-441",
            patient: "Child A. (UHID: 8821...)",
            condition: "Type 1 Diabetes",
            medication: "Insulin Supply (6 Months)",
            goal: 12000,
            raised: 4000,
            donors: 12,
            urgency: "Medium",
        }
    ]

    const ledgerEntries = [
        { hash: "0x7b21...9a2e", from: "Donor #922", case: "CASE-902", amount: "₹500", time: "2 mins ago" },
        { hash: "0x1a8c...2c1f", from: "Donor #104", case: "CASE-902", amount: "₹1,200", time: "15 mins ago" },
        { hash: "0x9d4e...bb01", from: "Donor #882", case: "CASE-441", amount: "₹300", time: "1 hour ago" },
    ]

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
                            <Coins className="w-5 h-5 text-amber-600" />
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
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Active Cases */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShieldCheck className="w-6 h-6 text-primary" />
                                {t.verified}
                            </h2>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                Admin Secure
                            </Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {cases.map((c) => (
                                <Card key={c.id} className="overflow-hidden border-2 border-transparent hover:border-primary/20 transition-all">
                                    <div className="p-1 bg-gradient-to-r from-amber-200 to-primary/30"></div>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={c.urgency === 'High' ? 'destructive' : 'default'} className="text-[10px]">
                                                {c.urgency} Urgency
                                            </Badge>
                                            <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                                        </div>
                                        <CardTitle className="text-lg mt-2">{c.condition}</CardTitle>
                                        <CardDescription>{c.medication}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Raised: ₹{c.raised}</span>
                                                <span className="font-bold">Goal: ₹{c.goal}</span>
                                            </div>
                                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-primary h-full transition-all duration-1000"
                                                    style={{ width: `${(c.raised / c.goal) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-y border-slate-100">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-xs">{c.patient}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px]">{c.donors} Donors</Badge>
                                        </div>
                                        <Button className="w-full gap-2" onClick={() => setIsDonating(c.id)}>
                                            <Heart className="w-4 h-4" />
                                            {t.donate}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Blockchain Explanation */}
                        <Card className="bg-slate-900 text-white border-none overflow-hidden">
                            <CardContent className="p-8 relative">
                                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                                    <div className="flex-1 space-y-4">
                                        <h3 className="text-xl font-bold flex items-center gap-2 text-amber-400">
                                            <Lock className="w-5 h-5" />
                                            Transparent Smart Contracts
                                        </h3>
                                        <p className="text-slate-400 text-sm leading-relaxed">
                                            Unlike traditional platforms, Right Reach uses a mock blockchain ledger to ensure
                                            that every rupee donated is locked to a specific pharmacy invoice. Funds are only
                                            released to the verified drug provider, never as cash to the patient, preventing misuse.
                                        </p>
                                        <div className="flex gap-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                Verified Invoices
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-300">
                                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                Zero Cash Policy
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-32 h-32 md:w-48 md:h-48 border-4 border-slate-800 rounded-2xl flex items-center justify-center bg-slate-800/50">
                                        <Coins className="w-16 h-16 md:w-24 md:h-24 text-amber-500 opacity-50 animate-pulse" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ledger Section */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <History className="w-5 h-5 text-primary" />
                            {t.ledger}
                        </h2>
                        <div className="space-y-3">
                            {ledgerEntries.map((entry, idx) => (
                                <Card key={idx} className="bg-white border-none shadow-sm hover:shadow-md transition-shadow">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Badge variant="outline" className="text-[9px] font-mono border-slate-200">
                                                {entry.hash}
                                            </Badge>
                                            <span className="text-[10px] text-muted-foreground">{entry.time}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-slate-500">{entry.from} → {entry.case}</p>
                                                <p className="text-lg font-bold text-slate-900">{entry.amount}</p>
                                            </div>
                                            <TrendingUp className="w-5 h-5 text-green-500 opacity-50" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                            <Button variant="ghost" className="w-full text-xs text-muted-foreground hover:bg-slate-100">
                                Load more transactions
                                <ExternalLink className="w-3 h-3 ml-2" />
                            </Button>
                        </div>

                        {/* Impact Box */}
                        <Card className="bg-amber-50 border-amber-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-amber-200 p-2 rounded-lg">
                                        <TrendingUp className="w-5 h-5 text-amber-700" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm">System Transparency</h4>
                                        <p className="text-[10px] text-amber-700 uppercase tracking-wider">Live Network Health</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-amber-800">Verified Contracts</span>
                                        <span className="font-bold">1,204</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-amber-800">Success Rate</span>
                                        <span className="font-bold">100%</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Donation Modal (Mock) */}
            {isDonating && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <Card className="w-full max-w-md shadow-2xl">
                        <CardHeader>
                            <CardTitle>Contribute to {isDonating}</CardTitle>
                            <CardDescription>Your contribution will be locked to the pharmacy invoice.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant="outline" onClick={() => setIsDonating(null)}>₹500</Button>
                                <Button variant="outline" onClick={() => setIsDonating(null)}>₹1,000</Button>
                                <Button variant="outline" onClick={() => setIsDonating(null)}>₹2,000</Button>
                            </div>
                            <Button className="w-full py-6 text-lg" onClick={() => setIsDonating(null)}>
                                Confirm Contribution
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground uppercase">
                                Encrypted via Bank-Grade SSL • Verified by Right Reach
                            </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
