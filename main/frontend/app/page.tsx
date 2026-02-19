"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  Video,
  FileText,
  Pill,
  Stethoscope,
  Users,
  QrCode,
  Globe,
  Phone,
  Calendar,
  Activity,
  UserPlus,
  Coins,
  Map as MapIcon,
  CheckCircle,
  Shield,
} from "lucide-react"
import Link from "next/link"

export default function RightReachHome() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
  ]

  const translations = {
    en: {
      title: "Right Reach",
      subtitle: "Inclusive Digital Healthcare for All",
      telemedicine: "Telemedicine",
      telemedicineDesc: "Video consultations with doctors",
      healthRecords: "Health Records",
      healthRecordsDesc: "Access encrypted medical history",
      medicineTracker: "Medicine Tracker",
      medicineTrackerDesc: "Your prescribed medicine schedule",
      symptomChecker: "Symptom Checker",
      symptomCheckerDesc: "AI-powered health insights",
      emergencyContact: "Emergency",
      qrAccess: "QR Retrieval",
      offlineMode: "Offline Sync",
      multiLanguage: "Multilingual",
      registerPatient: "New Registration",
      registerPatientDesc: "Create UHID & secure health profile",
      schemes: "Health Schemes",
      schemesDesc: "Personalized benefit matching",
      funding: "Crowd Funding",
      fundingDesc: "Secure financial support",
      camps: "Health Camps",
      campsDesc: "Locate nearby NGO/Gov clinics",
    },
    ta: {
      title: "ரைட் ரீச் (Right Reach)",
      subtitle: "அனைவருக்குமான உள்ளடக்கிய டிஜிட்டல் சுகாதாரம்",
      telemedicine: "தூர மருத்துவ சேவை",
      telemedicineDesc: "மருத்துவர்களுடன் வீடியோ ஆலோசனை",
      healthRecords: "சுகாதார பதிவுகள்",
      healthRecordsDesc: "உங்கள் மருத்துவ வரலாற்றை அணுகவும்",
      medicineTracker: "மருந்து கண்காணிப்பு",
      medicineTrackerDesc: "உங்கள் மருந்து அட்டவணை",
      symptomChecker: "அறிகுறி சரிபார்ப்பு",
      symptomCheckerDesc: "AI-ஆல் இயங்கும் சுகாதார நுண்ணறிவு",
      emergencyContact: "அவசரம்",
      qrAccess: "QR மீட்டெடுப்பு",
      offlineMode: "ஆஃப்லைன் ஒத்திசைவு",
      multiLanguage: "பல மொழி ஆதரவு",
      registerPatient: "புதிய பதிவு",
      registerPatientDesc: "UHID மற்றும் பாதுகாப்பு சுயவிவரத்தை உருவாக்கவும்",
      schemes: "சுகாதார திட்டங்கள்",
      schemesDesc: "தனிப்பயனாக்கப்பட்ட திட்டங்கள்",
      funding: "நிதி உதவி",
      fundingDesc: "வெளிப்படையான பிளாக்செயின ஆதரவு",
      camps: "சுகாதார முகாம்கள்",
      campsDesc: "அருகிலுள்ள முகாம்களைக் கண்டறியவும்",
    },
    hi: {
      title: "राइट रीच (Right Reach)",
      subtitle: "सभी के लिए समावेशी डिजिटल स्वास्थ्य सेवा",
      telemedicine: "टेलीमेडिसिन",
      telemedicineDesc: "डॉक्टरों के साथ वीडियो परामर्श",
      healthRecords: "स्वास्थ्य रिकॉर्ड",
      healthRecordsDesc: "एन्क्रिप्टेड चिकित्सा इतिहास तक पहुंच",
      medicineTracker: "दवा ट्रैकर",
      medicineTrackerDesc: "आपकी निर्धारित दवा अनुसूची",
      symptomChecker: "लक्षण जांचकर्ता",
      symptomCheckerDesc: "AI-संचालित स्वास्थ्य अंतर्दृष्टि",
      emergencyContact: "आपातकाल",
      qrAccess: "QR पहुंच",
      offlineMode: "ऑफलाइन सिंक",
      multiLanguage: "बहुभाषी",
      registerPatient: "नया पंजीकरण",
      registerPatientDesc: "UHID और सुरक्षित प्रोफ़ाइल बनाएं",
      schemes: "स्वास्थ्य योजनाएं",
      schemesDesc: "व्यक्तिगत योजना मिलान",
      funding: "क्राउड फंडिंग",
      fundingDesc: "पारदर्शी ब्लॉकचेन समर्थन",
      camps: "स्वास्थ्य शिविर",
      campsDesc: "पास के शिविर खोजें",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-indigo-100 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl shadow-lg ring-4 ring-primary/10">
                <Heart className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight text-foreground">{t.title}</h1>
                <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">{t.subtitle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              {/* Language Selector */}
              <div className="hidden md:flex bg-muted rounded-lg p-1">
                {languages.map((lang) => (
                  <Button
                    key={lang.code}
                    variant={selectedLanguage === lang.code ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedLanguage(lang.code)}
                    className="text-xs h-8 px-3"
                  >
                    {lang.native}
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-primary hover:bg-primary/5">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="font-semibold shadow-md active:scale-95 transition-transform">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-20 lg:pt-24 lg:pb-32">
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider animate-in fade-in slide-in-from-bottom-4">
              <Activity className="w-3 h-3" />
              Revolutionizing Rural Healthcare
            </div>
            <h2 className="text-4xl md:text-6xl font-extrabold text-[#0f172a] leading-tight animate-in fade-in slide-in-from-bottom-8 duration-500">
              Accessible Medicine for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Every Single Citizen.</span>
            </h2>
            <p className="text-lg text-[#64748b] max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-12 duration-700">
              Right Reach bridges the gap between urban medical expertise and rural accessibility using secure identity tracking, offline-first syncing, and community-driven funding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-in fade-in slide-in-from-bottom-16 duration-1000">
              <Link href="/register">
                <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-95 transition-all">
                  Register Now (Free)
                </Button>
              </Link>
              <Link href="/telemedicine">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg font-bold border-2 hover:bg-muted">
                  <Video className="w-5 h-5 mr-2" />
                  Telemedicine Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-10 pb-20">
        {/* Status Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Card className="text-center shadow-sm hover:shadow-md transition-all border-none bg-white">
            <CardContent className="pt-6">
              <Globe className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-semibold">{t.multiLanguage}</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-all border-none bg-white">
            <CardContent className="pt-6">
              <Activity className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-sm font-semibold">{t.offlineMode}</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-all border-none bg-white">
            <CardContent className="pt-6">
              <QrCode className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-sm font-semibold">{t.qrAccess}</p>
            </CardContent>
          </Card>
          <Card className="text-center shadow-sm hover:shadow-md transition-all border-none bg-white">
            <CardContent className="pt-6">
              <Phone className="w-8 h-8 mx-auto mb-2 text-destructive" />
              <p className="text-sm font-semibold">{t.emergencyContact}</p>
            </CardContent>
          </Card>
        </div>

        {/* Mission & About Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-8 border-none shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            <div className="flex flex-col h-full space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Secure Digital Identity</h3>
              <p className="text-[#64748b] leading-relaxed">
                Every citizen receives a unique 12-digit UHID. All medical records are protected with industry-standard security, ensuring privacy and ownership of health data.
              </p>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
            <div className="flex flex-col h-full space-y-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Rural Accessibility</h3>
              <p className="text-[#64748b] leading-relaxed">
                Designed for low-connectivity environments. Our offline-first architecture allows doctors and patients to draft consultations and records without active internet.
              </p>
            </div>
          </Card>

          <Card className="p-8 border-none shadow-xl hover:shadow-2xl transition-all bg-white relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent" />
            <div className="flex flex-col h-full space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f172a]">Smart Distribution</h3>
              <p className="text-[#64748b] leading-relaxed">
                Integrated AI matching for government health schemes and transparent funding for critical surgeries and medications.
              </p>
            </div>
          </Card>
        </div>

        {/* Detailed Description */}
        <section className="max-w-4xl mx-auto space-y-16 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-[#0f172a]">What is Right Reach?</h2>
            <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-lg text-[#64748b] leading-relaxed">
                Right Reach is a comprehensive health-equity platform. We believe that distance from a city shouldn&apos;t mean a lower standard of care.
              </p>
              <ul className="space-y-4">
                {[
                  "Instant 12-digit UHID generation",
                  "Encrypted QR-based record retrieval",
                  "Multi-language support (Tamil, Hindi)",
                  "Direct-to-patient scheme matching",
                  "Transparent Peer-to-Peer medical funding"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 font-medium text-[#334155]">
                    <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-primary" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-8 bg-card border-none shadow-2xl rounded-3xl relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-3xl" />
              <div className="relative text-center space-y-4">
                <QrCode className="w-24 h-24 mx-auto text-primary animate-pulse" />
                <h4 className="text-lg font-bold">Your Health, Your Identity</h4>
                <p className="text-sm text-muted-foreground italic">&quot;Generating millions of secure identities for the next billion users.&quot;</p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="mt-20 p-12 bg-[#0f172a] rounded-[2.5rem] text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px]" />
          <div className="relative space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">Ready to access better healthcare?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-white text-[#0f172a] hover:bg-white/90 px-8 h-14 text-lg font-bold">
                  Register Account
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="ghost" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 h-14 text-lg font-bold">
                  Login to Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}