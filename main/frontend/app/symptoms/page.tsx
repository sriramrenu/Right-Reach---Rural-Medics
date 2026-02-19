"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  Stethoscope,
  Brain,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Calendar,
  Activity,
  Thermometer,
  Heart,
  Zap,
  Sparkles,
  Building,
  MapPin,
  Coins,
  UserCheck,
} from "lucide-react"
import Link from "next/link"

// ── Types ─────────────────────────────────────────────────────────────────────
interface ModelSuggestion {
  disease: string
  category: string
  recommended_doctor: string
  health_camp: string
  government_scheme: string
  funding_support: string
  note: string
}

interface Assessment {
  urgencyLevel: string
  riskLevel: string
  recommendations: string[]
  possibleConditions: string[]
  careLevel: string
  aiSuggestion?: ModelSuggestion | null
  aiError?: string
}

export default function SymptomChecker() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [symptomDetails, setSymptomDetails] = useState({
    duration: "",
    severity: "",
    additionalInfo: "",
    age: "",
    gender: "",
    existingConditions: [] as string[],
  })
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
  ]

  const translations = {
    en: {
      title: "AI Symptom Checker",
      subtitle: "Get preliminary health guidance based on your symptoms",
      selectSymptoms: "Select Your Symptoms",
      symptomDetails: "Symptom Details",
      assessment: "Health Assessment",
      commonSymptoms: "Common Symptoms",
      bodyParts: "Body Parts",
      duration: "How long have you had these symptoms?",
      severity: "How severe are your symptoms?",
      mild: "Mild",
      moderate: "Moderate",
      severe: "Severe",
      additionalInfo: "Additional Information",
      age: "Age",
      gender: "Gender",
      male: "Male",
      female: "Female",
      existingConditions: "Existing Medical Conditions",
      analyze: "Analyze Symptoms",
      analyzing: "Analyzing...",
      next: "Next",
      previous: "Previous",
      back: "Back to Home",
      urgencyLevel: "Urgency Level",
      recommendations: "Recommendations",
      possibleConditions: "Possible Conditions",
      whenToSeek: "When to Seek Care",
      selfCare: "Self Care",
      clinicVisit: "Clinic Visit",
      emergency: "Emergency",
      bookConsultation: "Book Consultation",
      callEmergency: "Call Emergency",
      disclaimer: "This is not a substitute for professional medical advice",
      lowRisk: "Low Risk",
      moderateRisk: "Moderate Risk",
      highRisk: "High Risk",
    },
    hi: {
      title: "AI लक्षण जांचकर्ता",
      subtitle: "अपने लक्षणों के आधार पर प्रारंभिक स्वास्थ्य मार्गदर्शन प्राप्त करें",
      selectSymptoms: "अपने लक्षण चुनें",
      symptomDetails: "लक्षण विवरण",
      assessment: "स्वास्थ्य मूल्यांकन",
      commonSymptoms: "सामान्य लक्षण",
      bodyParts: "शरीर के अंग",
      duration: "आपको ये लक्षण कितने समय से हैं?",
      severity: "आपके लक्षण कितने गंभीर हैं?",
      mild: "हल्का",
      moderate: "मध्यम",
      severe: "गंभीर",
      additionalInfo: "अतिरिक्त जानकारी",
      age: "उम्र",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      existingConditions: "मौजूदा चिकित्सा स्थितियां",
      analyze: "लक्षणों का विश्लेषण करें",
      analyzing: "विश्लेषण कर रहे हैं...",
      next: "अगला",
      previous: "पिछला",
      back: "होम पर वापस",
      urgencyLevel: "तात्कालिकता स्तर",
      recommendations: "सिफारिशें",
      possibleConditions: "संभावित स्थितियां",
      whenToSeek: "कब देखभाल लें",
      selfCare: "स्व-देखभाल",
      clinicVisit: "क्लिनिक जाएं",
      emergency: "आपातकाल",
      bookConsultation: "परामर्श बुक करें",
      callEmergency: "आपातकाल कॉल करें",
      disclaimer: "यह पेशेवर चिकित्सा सलाह का विकल्प नहीं है",
      lowRisk: "कम जोखिम",
      moderateRisk: "मध्यम जोखिम",
      highRisk: "उच्च जोखिम",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const commonSymptoms = [
    { id: "fever", name: "Fever", icon: Thermometer },
    { id: "headache", name: "Headache", icon: Brain },
    { id: "cough", name: "Cough", icon: Activity },
    { id: "sore throat", name: "Sore Throat", icon: Activity },
    { id: "body ache", name: "Body Ache", icon: Activity },
    { id: "fatigue", name: "Fatigue", icon: Activity },
    { id: "nausea", name: "Nausea", icon: Activity },
    { id: "diarrhea", name: "Diarrhea", icon: Activity },
    { id: "chest pain", name: "Chest Pain", icon: Heart },
    { id: "shortness of breath", name: "Shortness of Breath", icon: Activity },
    { id: "dizziness", name: "Dizziness", icon: Brain },
    { id: "abdominal pain", name: "Abdominal Pain", icon: Activity },
  ]

  const medicalConditions = [
    "Diabetes",
    "High Blood Pressure",
    "Heart Disease",
    "Asthma",
    "Kidney Disease",
    "Liver Disease",
    "Thyroid Problems",
    "Arthritis",
  ]

  const durations = [
    { value: "few_hours", label: "A few hours" },
    { value: "1_day", label: "1 day" },
    { value: "2_3_days", label: "2-3 days" },
    { value: "1_week", label: "About a week" },
    { value: "more_week", label: "More than a week" },
  ]

  const handleSymptomToggle = (symptomId: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptomId) ? prev.filter((id) => id !== symptomId) : [...prev, symptomId],
    )
  }

  const handleConditionToggle = (condition: string) => {
    setSymptomDetails((prev) => ({
      ...prev,
      existingConditions: prev.existingConditions.includes(condition)
        ? prev.existingConditions.filter((c) => c !== condition)
        : [...prev.existingConditions, condition],
    }))
  }

  // ── Urgency logic (rule-based, instant) ───────────────────────────────────
  const computeUrgency = () => {
    if (selectedSymptoms.includes("chest pain") || selectedSymptoms.includes("shortness of breath")) {
      return {
        urgencyLevel: "high",
        riskLevel: t.highRisk,
        recommendations: ["Seek immediate medical attention", "Call emergency services if symptoms worsen"],
        possibleConditions: ["Heart condition", "Respiratory issue"],
        careLevel: "emergency",
      }
    } else if (selectedSymptoms.includes("fever") && selectedSymptoms.includes("cough")) {
      return {
        urgencyLevel: "moderate",
        riskLevel: t.moderateRisk,
        recommendations: ["Consider consulting a doctor", "Monitor symptoms closely", "Rest and stay hydrated"],
        possibleConditions: ["Viral infection", "Respiratory infection"],
        careLevel: "clinic",
      }
    } else {
      return {
        urgencyLevel: "low",
        riskLevel: t.lowRisk,
        recommendations: ["Self-care measures may be sufficient", "Monitor symptoms", "Consult doctor if symptoms persist"],
        possibleConditions: ["Minor illness", "Common cold"],
        careLevel: "self_care",
      }
    }
  }

  // ── Main analysis: calls real model API ───────────────────────────────────
  const analyzeSymptoms = async () => {
    setIsAnalyzing(true)

    const urgency = computeUrgency()

    // Build a disease query from selected symptom names
    const diseaseQuery = selectedSymptoms
      .map((id) => commonSymptoms.find((s) => s.id === id)?.name || id)
      .join(" ")
      .toLowerCase()

    let aiSuggestion: ModelSuggestion | null = null
    let aiError: string | undefined

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "")
      const response = await fetch(`${API_URL}/api/model/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease: diseaseQuery }),
      })

      if (response.ok) {
        aiSuggestion = await response.json()
      } else {
        const err = await response.json()
        aiError = err.error || "Model returned an error."
      }
    } catch {
      aiError = "Could not reach the AI model service right now."
    }

    setAssessment({ ...urgency, aiSuggestion, aiError })
    setIsAnalyzing(false)
    setCurrentStep(3)
  }

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "high": return "bg-red-100 text-red-800 border-red-200"
      case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "high": return <AlertTriangle className="w-4 h-4" />
      case "moderate": return <Clock className="w-4 h-4" />
      case "low": return <CheckCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {t.back}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Stethoscope className="w-6 h-6 text-primary" />
                <div>
                  <h1 className="text-xl font-bold text-foreground">{t.title}</h1>
                  <p className="text-sm text-muted-foreground">{t.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Language Selector */}
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
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                >
                  {step}
                </div>
                {step < 3 && <div className={`w-12 h-0.5 mx-2 ${currentStep > step ? "bg-primary" : "bg-muted"}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Select Symptoms */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.selectSymptoms}</CardTitle>
              <CardDescription>Select all symptoms you are currently experiencing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">{t.commonSymptoms}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {commonSymptoms.map((symptom) => {
                    const IconComponent = symptom.icon
                    return (
                      <Card
                        key={symptom.id}
                        className={`cursor-pointer transition-colors ${selectedSymptoms.includes(symptom.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                          }`}
                        onClick={() => handleSymptomToggle(symptom.id)}
                      >
                        <CardContent className="p-4 text-center">
                          <IconComponent className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <p className="text-sm font-medium">{symptom.name}</p>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setCurrentStep(2)} disabled={selectedSymptoms.length === 0}>
                  {t.next}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Symptom Details */}
        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>{t.symptomDetails}</CardTitle>
              <CardDescription>Provide additional details about your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Selected Symptoms Summary */}
              <div>
                <Label className="text-base font-medium">Selected Symptoms:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSymptoms.map((symptomId) => {
                    const symptom = commonSymptoms.find((s) => s.id === symptomId)
                    return (
                      <Badge key={symptomId} variant="secondary">
                        {symptom?.name}
                      </Badge>
                    )
                  })}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label>{t.duration}</Label>
                <Select
                  value={symptomDetails.duration}
                  onValueChange={(value) => setSymptomDetails((prev) => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((duration) => (
                      <SelectItem key={duration.value} value={duration.value}>
                        {duration.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Severity */}
              <div className="space-y-2">
                <Label>{t.severity}</Label>
                <RadioGroup
                  value={symptomDetails.severity}
                  onValueChange={(value) => setSymptomDetails((prev) => ({ ...prev, severity: value }))}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mild" id="mild" />
                    <Label htmlFor="mild">{t.mild}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderate" id="moderate" />
                    <Label htmlFor="moderate">{t.moderate}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="severe" id="severe" />
                    <Label htmlFor="severe">{t.severe}</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Personal Information */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">{t.age}</Label>
                  <Input
                    id="age"
                    type="number"
                    value={symptomDetails.age}
                    onChange={(e) => setSymptomDetails((prev) => ({ ...prev, age: e.target.value }))}
                    placeholder="Enter age"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t.gender}</Label>
                  <RadioGroup
                    value={symptomDetails.gender}
                    onValueChange={(value) => setSymptomDetails((prev) => ({ ...prev, gender: value }))}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male">{t.male}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female">{t.female}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {/* Existing Conditions */}
              <div className="space-y-2">
                <Label>{t.existingConditions}</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {medicalConditions.map((condition) => (
                    <div key={condition} className="flex items-center space-x-2">
                      <Checkbox
                        id={condition}
                        checked={symptomDetails.existingConditions.includes(condition)}
                        onCheckedChange={() => handleConditionToggle(condition)}
                      />
                      <Label htmlFor={condition} className="text-sm">
                        {condition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-2">
                <Label htmlFor="additional">{t.additionalInfo}</Label>
                <Textarea
                  id="additional"
                  value={symptomDetails.additionalInfo}
                  onChange={(e) => setSymptomDetails((prev) => ({ ...prev, additionalInfo: e.target.value }))}
                  placeholder="Any additional symptoms or information..."
                  rows={3}
                />
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  {t.previous}
                </Button>
                <Button onClick={analyzeSymptoms} disabled={isAnalyzing}>
                  {isAnalyzing ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-pulse" />
                      {t.analyzing}
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      {t.analyze}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Assessment Results */}
        {currentStep === 3 && assessment && (
          <div className="space-y-6">
            {/* Urgency Level */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {t.urgencyLevel}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${getUrgencyColor(assessment.urgencyLevel)} text-base px-4 py-2`}>
                  {getUrgencyIcon(assessment.urgencyLevel)}
                  <span className="ml-2">{assessment.riskLevel}</span>
                </Badge>
              </CardContent>
            </Card>

            {/* ── AI Health Suggestion Card ─────────────────────────────────── */}
            {assessment.aiSuggestion ? (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Sparkles className="w-5 h-5" />
                    AI Health Suggestion
                  </CardTitle>
                  <CardDescription className="text-purple-600">
                    Based on your symptoms: <strong>{assessment.aiSuggestion.disease}</strong>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Category */}
                    <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-purple-100">
                      <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <Activity className="w-4 h-4 text-purple-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-purple-500 tracking-wider">Category</p>
                        <p className="font-semibold text-sm text-slate-800 mt-0.5">{assessment.aiSuggestion.category}</p>
                      </div>
                    </div>

                    {/* Recommended Doctor */}
                    <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-blue-100">
                      <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <UserCheck className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-blue-500 tracking-wider">Recommended Doctor</p>
                        <p className="font-semibold text-sm text-slate-800 mt-0.5">{assessment.aiSuggestion.recommended_doctor}</p>
                      </div>
                    </div>

                    {/* Health Camp */}
                    <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-green-100">
                      <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-4 h-4 text-green-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-green-500 tracking-wider">Health Camp</p>
                        <p className="font-semibold text-sm text-slate-800 mt-0.5">{assessment.aiSuggestion.health_camp}</p>
                      </div>
                    </div>

                    {/* Government Scheme */}
                    <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-amber-100">
                      <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <Building className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider">Government Scheme</p>
                        <p className="font-semibold text-sm text-slate-800 mt-0.5">{assessment.aiSuggestion.government_scheme}</p>
                      </div>
                    </div>

                    {/* Funding Support */}
                    <div className="flex items-start gap-3 p-3 bg-white/70 rounded-xl border border-rose-100 md:col-span-2">
                      <div className="w-9 h-9 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                        <Coins className="w-4 h-4 text-rose-700" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-rose-500 tracking-wider">Funding Support</p>
                        <p className="font-semibold text-sm text-slate-800 mt-0.5">{assessment.aiSuggestion.funding_support}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-purple-500 mt-4 font-medium italic">{assessment.aiSuggestion.note}</p>
                </CardContent>
              </Card>
            ) : assessment.aiError ? (
              <Card className="border border-yellow-200 bg-yellow-50">
                <CardContent className="p-4 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong>AI Suggestion unavailable:</strong> {assessment.aiError}
                  </p>
                </CardContent>
              </Card>
            ) : null}

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>{t.recommendations}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {assessment.recommendations.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Possible Conditions */}
            <Card>
              <CardHeader>
                <CardTitle>{t.possibleConditions}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {assessment.possibleConditions.map((condition: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>{t.whenToSeek}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {assessment.careLevel === "emergency" && (
                  <Button variant="destructive" className="w-full" size="lg">
                    <Phone className="w-4 h-4 mr-2" />
                    {t.callEmergency}
                  </Button>
                )}

                {(assessment.careLevel === "clinic" || assessment.careLevel === "emergency") && (
                  <Link href="/telemedicine">
                    <Button className="w-full" size="lg">
                      <Calendar className="w-4 h-4 mr-2" />
                      {t.bookConsultation}
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCurrentStep(1)
                    setSelectedSymptoms([])
                    setAssessment(null)
                    setSymptomDetails({
                      duration: "",
                      severity: "",
                      additionalInfo: "",
                      age: "",
                      gender: "",
                      existingConditions: [],
                    })
                  }}
                >
                  Check New Symptoms
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> {t.disclaimer}. Always consult with a healthcare professional for proper
                    diagnosis and treatment.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}
