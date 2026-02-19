"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, User, Phone, MapPin, QrCode, Save, UserPlus, Heart, AlertCircle, Shield } from "lucide-react"
import Link from "next/link"

export default function PatientRegistration() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [formData, setFormData] = useState({
    role: "patient",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    fatherName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    alternatePhone: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    aadharNumber: "",
    // Patient specific
    bloodGroup: "",
    allergies: "",
    chronicConditions: "",
    emergencyContact: "",
    emergencyRelation: "",
    // Doctor specific
    specialization: "",
    licenseNumber: "",
    hospitalName: "",
    experience: "",
    consentTelehealth: false,
    consentDataSharing: false,
  })

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
  ]

  const translations = {
    en: {
      title: "Right Reach Registration",
      subtitle: "Secure account creation for healthcare services",
      personalInfo: "Personal Information",
      role: "Registration Type",
      patient: "Patient",
      doctor: "Doctor / Healthcare Professional",
      username: "Username / Email",
      password: "Security Password",
      firstName: "First Name",
      lastName: "Last Name",
      fatherName: "Father's Name",
      dateOfBirth: "Date of Birth",
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      contactInfo: "Contact Information",
      phoneNumber: "Phone Number",
      alternatePhone: "Alternate Phone",
      address: "Address Information",
      village: "Village",
      district: "District *",
      state: "State *",
      pincode: "PIN Code",
      aadharNumber: "Aadhar Number",
      professionalInfo: "Professional Information",
      specialization: "Specialization",
      licenseNumber: "Medical License Number",
      hospitalName: "Hospital/Clinic Name",
      experience: "Years of Experience",
      medicalInfo: "Medical Information",
      bloodGroup: "Blood Group",
      allergies: "Known Allergies",
      chronicConditions: "Chronic Conditions",
      emergencyContact: "Emergency Contact",
      emergencyRelation: "Relation",
      consent: "Consent & Permissions",
      consentTelehealth: "I consent to telehealth consultations",
      consentDataSharing: "I consent to sharing medical data with healthcare providers",
      register: "Create Account",
      generateQR: "Download ID カード",
      back: "Back to Home",
      required: "Required field",
    },
    ta: {
      title: "ரைட் ரீச் பதிவு",
      subtitle: "சுகாதார சேவைகளுக்கான பாதுகாப்பான கணக்கு உருவாக்கம்",
      personalInfo: "தனிப்பட்ட தகவல்",
      role: "பதிவு வகை",
      patient: "நோயாளி",
      doctor: "மருத்துவர் / சுகாதார நிபுணர்",
      username: "பயனர் பெயர்",
      password: "ரகசிய கடவுச்சொல்",
      firstName: "முதல் பெயர்",
      lastName: "பழைய பெயர்",
      fatherName: "தந்தை பெயர்",
      dateOfBirth: "பிறந்த தேதி",
      gender: "பாலினம்",
      male: "ஆண்",
      female: "பெண்",
      other: "மற்றவை",
      contactInfo: "தொடர்பு தகவல்",
      phoneNumber: "தொலைபேசி எண்",
      alternatePhone: "மாற்றுத் தொலைபேசி",
      address: "முகவரி தகவல்",
      village: "கிராமம்",
      district: "மாவட்டம் *",
      state: "மாநிலம் *",
      pincode: "பின்கோடு",
      aadharNumber: "ஆதார் எண்",
      professionalInfo: "தொழில்முறை தகவல்",
      specialization: "சிறப்பு",
      licenseNumber: "மருத்துவ உரிம எண்",
      hospitalName: "மருத்துவமனை/கிளினிக் பெயர்",
      experience: "அனுபவம் (ஆண்டுகள்)",
      medicalInfo: "மருத்துவ தகவல்",
      bloodGroup: "இரத்த வகை",
      allergies: "அறியப்பட்ட ஒவ்வாமை",
      chronicConditions: "நீண்ட கால நிலைமைகள்",
      emergencyContact: "அவசர தொடர்பு",
      emergencyRelation: "உறவு",
      consent: "சம்மதம் மற்றும் அனுமதிகள்",
      consentTelehealth: "தூர மருத்துவ ஆலோசனைகளுக்கு நான் சம்மதிக்கிறேன்",
      consentDataSharing: "மருத்துவத் தரவை சுகாதார வழங்குநர்களுடன் பகிர்ந்து கொள்ள நான் சம்மதிக்கிறேன்",
      register: "கணக்கை உருவாக்கு",
      generateQR: "கணக்கை உருவாக்கு",
      back: "முகப்புக்குத் திரும்பு",
      required: "தேவையான புலம்",
    },
    hi: {
      title: "राइट रीच पंजीकरण",
      subtitle: "स्वास्थ्य सेवाओं के लिए सुरक्षित खाता निर्माण",
      personalInfo: "व्यक्तिगत जानकारी",
      role: "पंजीकरण का प्रकार",
      patient: "रोगी",
      doctor: "डॉक्टर / स्वास्थ्य पेशेवर",
      username: "यूज़रनेम",
      password: "पासवर्ड",
      firstName: "पहला नाम",
      lastName: "अंतिम नाम",
      fatherName: "पिता का नाम",
      dateOfBirth: "जन्म तिथि",
      gender: "लिंग",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      contactInfo: "संपर्क जानकारी",
      phoneNumber: "फोन नंबर",
      alternatePhone: "वैकल्पिक फोन",
      address: "पता जानकारी",
      village: "गांव",
      district: "जिला *",
      state: "राज्य *",
      pincode: "पिन कोड",
      aadharNumber: "आधार नंबर",
      professionalInfo: "पेशेवर जानकारी",
      specialization: "विशेषज्ञता",
      licenseNumber: "चिकित्सा लाइसेंस नंबर",
      hospitalName: "अस्पताल/क्लिनिक का नाम",
      experience: "अनुभव (वर्ष)",
      medicalInfo: "चिकित्सा जानकारी",
      bloodGroup: "रक्त समूह",
      allergies: "ज्ञात एलर्जी",
      chronicConditions: "पुरानी बीमारियां",
      emergencyContact: "आपातकालीन संपर्क",
      emergencyRelation: "रिश्ता",
      consent: "सहमति और अनुमतियां",
      consentTelehealth: "मैं टेलीहेल्थ परामर्श के लिए सहमति देता हूं",
      consentDataSharing: "मैं स्वास्थ्य प्रदाताओं के साथ चिकित्सा डेटा साझा करने की सहमति देता हूं",
      register: "खाता बनाएं",
      generateQR: "QR प्राप्त करें",
      back: "होम पर वापस",
      required: "आवश्यक फील्ड",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const relations = ["Father", "Mother", "Spouse", "Son", "Daughter", "Brother", "Sister", "Other"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userData: formData })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Account Created! Your 12-digit UHID is: ${data.uhid}\nWelcome to Right Reach.`)

        // Auto-login after registration
        const loginResponse = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: formData.username, password: formData.password })
        });

        const loginData = await loginResponse.json();
        if (loginResponse.ok) {
          localStorage.setItem("current_user", JSON.stringify(loginData.user))
          localStorage.setItem("token", loginData.token)
          window.location.href = "/dashboard"
        } else {
          window.location.href = "/login"
        }
      } else {
        alert(data.message || "Registration failed. Please try again.")
      }
    } catch (err) {
      alert("Cannot connect to server. Please try again later.")
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
                <UserPlus className="w-6 h-6 text-primary" />
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

      {/* Registration Form */}
      <main className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">

          {/* Account Type & Role */}
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                {t.role}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value)}
                className="grid md:grid-cols-2 gap-4"
              >
                <Label
                  htmlFor="role-patient"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer ${formData.role === 'patient' ? 'border-primary bg-primary/10' : ''}`}
                >
                  <RadioGroupItem value="patient" id="role-patient" className="sr-only" />
                  <User className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">{t.patient}</span>
                </Label>
                <Label
                  htmlFor="role-doctor"
                  className={`flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer ${formData.role === 'doctor' ? 'border-primary bg-primary/10' : ''}`}
                >
                  <RadioGroupItem value="doctor" id="role-doctor" className="sr-only" />
                  <Heart className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">{t.doctor}</span>
                </Label>
              </RadioGroup>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-primary/10">
                <div className="space-y-2">
                  <Label htmlFor="username">{t.username} *</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                    placeholder="e.g. sriram_doctor"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{t.password} *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                {t.personalInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">{t.firstName} *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">{t.lastName} *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fatherName">{t.fatherName} *</Label>
                  <Input
                    id="fatherName"
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange("fatherName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t.dateOfBirth} *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>{t.gender} *</Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange("gender", value)}
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
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">{t.other}</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Doctor Specific Info */}
          {formData.role === 'doctor' && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  {t.professionalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialization">{t.specialization} *</Label>
                    <Input
                      id="specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange("specialization", e.target.value)}
                      required={formData.role === 'doctor'}
                      placeholder="e.g. Cardiology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">{t.licenseNumber} *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
                      required={formData.role === 'doctor'}
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospitalName">{t.hospitalName} *</Label>
                    <Input
                      id="hospitalName"
                      value={formData.hospitalName}
                      onChange={(e) => handleInputChange("hospitalName", e.target.value)}
                      required={formData.role === 'doctor'}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="experience">{t.experience}</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {t.contactInfo}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">{t.phoneNumber} *</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternatePhone">{t.alternatePhone}</Label>
                  <Input
                    id="alternatePhone"
                    type="tel"
                    value={formData.alternatePhone}
                    onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {t.address}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="village">{t.village} *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">{t.pincode} *</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district">{t.district}</Label>
                  <Input
                    id="district"
                    value={formData.district}
                    onChange={(e) => handleInputChange("district", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{t.state}</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="aadharNumber">{t.aadharNumber}</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => handleInputChange("aadharNumber", e.target.value)}
                  placeholder="XXXX XXXX XXXX"
                  maxLength={12}
                />
              </div>
            </CardContent>
          </Card>

          {/* Medical Information (Patient Only) */}
          {formData.role === 'patient' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  {t.medicalInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodGroup">{t.bloodGroup}</Label>
                    <Select value={formData.bloodGroup} onValueChange={(value) => handleInputChange("bloodGroup", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        {bloodGroups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyRelation">{t.emergencyRelation}</Label>
                    <Select
                      value={formData.emergencyRelation}
                      onValueChange={(value) => handleInputChange("emergencyRelation", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select relation" />
                      </SelectTrigger>
                      <SelectContent>
                        {relations.map((relation) => (
                          <SelectItem key={relation} value={relation}>
                            {relation}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">{t.emergencyContact}</Label>
                  <Input
                    id="emergencyContact"
                    type="tel"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies">{t.allergies}</Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="List any known allergies..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chronicConditions">{t.chronicConditions}</Label>
                  <Textarea
                    id="chronicConditions"
                    value={formData.chronicConditions}
                    onChange={(e) => handleInputChange("chronicConditions", e.target.value)}
                    placeholder="List any chronic conditions..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consent */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {t.consent}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentTelehealth"
                  checked={formData.consentTelehealth}
                  onCheckedChange={(checked) => handleInputChange("consentTelehealth", checked as boolean)}
                />
                <Label htmlFor="consentTelehealth" className="text-sm">
                  {t.consentTelehealth}
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consentDataSharing"
                  checked={formData.consentDataSharing}
                  onCheckedChange={(checked) => handleInputChange("consentDataSharing", checked as boolean)}
                />
                <Label htmlFor="consentDataSharing" className="text-sm">
                  {t.consentDataSharing}
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {t.register}
            </Button>
            <Button type="button" variant="outline" size="lg">
              <QrCode className="w-4 h-4 mr-2" />
              {t.generateQR}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
