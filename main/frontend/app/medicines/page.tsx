"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Pill,
  Search,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Truck,
  Star,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

interface Location {
  location: string;
  type: string;
  status: string;
  price: number;
  stock: number;
  distance: string;
  phone: string;
  address: string;
  lastUpdated: string;
}

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  availability: Location[];
}

export default function MedicineTracker() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [searchResults, setSearchResults] = useState<Medicine[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "ta", name: "Tamil", native: "தமிழ்" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
  ]

  const translations = {
    en: {
      title: "Health Wallet & Tracker",
      subtitle: "Personalized medicine availability for your prescriptions",
      searchMedicine: "Search Medicine",
      searchPlaceholder: "Enter medicine name...",
      category: "Category",
      allCategories: "All Categories",
      search: "Search",
      availability: "Availability",
      pharmacies: "Pharmacies",
      hospitalDispensary: "Right Reach Dispensary",
      inStock: "In Stock",
      outOfStock: "Out of Stock",
      lowStock: "Low Stock",
      price: "Price",
      distance: "Distance",
      contact: "Contact",
      directions: "Get Directions",
      call: "Call",
      lastUpdated: "Last Updated",
      refresh: "Refresh",
      noResults: "No medicines found in your prescription list",
      back: "Home",
      nabhaHospital: "Nabha Civil Hospital",
      pharmacy: "Pharmacy",
      available: "Available",
      notAvailable: "Not Available",
      limited: "Limited Stock",
      myPrescriptions: "My Prescriptions",
    },
    ta: {
      title: "சுகாதார பணப்பை மற்றும் கண்காணிப்பு",
      subtitle: "உங்கள் மருந்துச் சீட்டுகளுக்கான தனிப்பயனாக்கப்பட்ட மருந்து கிடைக்கும் தன்மை",
      searchMedicine: "மருந்தைத் தேடுங்கள்",
      searchPlaceholder: "மருந்து பெயரை உள்ளிடவும்...",
      category: "வகை",
      allCategories: "அனைத்து வகைகள்",
      search: "தேடு",
      availability: "கிடைக்கும் தன்மை",
      pharmacies: "மருந்தகங்கள்",
      hospitalDispensary: "ரைட் ரீச் மருந்தகம்",
      inStock: "இருப்பில் உள்ளது",
      outOfStock: "இருப்பு இல்லை",
      lowStock: "குறைந்த இருப்பு",
      price: "விலை",
      distance: "தூரம்",
      contact: "தொடர்பு",
      directions: "திசைகளைப் பெறுங்கள்",
      call: "அழைப்பு",
      lastUpdated: "கடைசியாக புதுப்பிக்கப்பட்டது",
      refresh: "புதுப்பி",
      noResults: "உங்கள் மருந்துச் சீட்டு பட்டியலில் மருந்துகள் எதுவும் இல்லை",
      back: "முகப்பு",
      nabhaHospital: "நாபா சிவில் மருத்துவமனை",
      pharmacy: "மருந்தகம்",
      available: "கிடைக்கிறது",
      notAvailable: "கிடைக்கவில்லை",
      limited: "வரையறுக்கப்பட்ட இருப்பு",
      myPrescriptions: "எனது மருந்துச் சீட்டுகள்",
    },
    hi: {
      title: "स्वास्थ्य वॉलेट और ट्रैकर",
      subtitle: "आपके नुस्खे के लिए व्यक्तिगत दवा उपलब्धता",
      searchMedicine: "दवा खोजें",
      searchPlaceholder: "दवा का नाम दर्ज करें...",
      category: "श्रेणी",
      allCategories: "सभी श्रेணियां",
      search: "खोजें",
      availability: "उपलब्धता",
      pharmacies: "फार्मेसियां",
      hospitalDispensary: "राइट रीच डिस्पेंसरी",
      inStock: "स्टॉक में",
      outOfStock: "स्टॉक खत्म",
      lowStock: "कम स्टॉक",
      price: "कीमत",
      distance: "दूरी",
      contact: "संपर्क",
      directions: "दिशा निर्देश",
      call: "कॉल करें",
      lastUpdated: "अंतिम अपडेट",
      refresh: "रिफ्रेश",
      noResults: "आपकी नुस्खा सूची में कोई दवा नहीं मिली",
      back: "होम",
      nabhaHospital: "नाभा सिविल अस्पताल",
      pharmacy: "फार्मेसी",
      available: "उपलब्ध",
      notAvailable: "उपलब्ध नहीं",
      limited: "सीमित स्टॉक",
      myPrescriptions: "मेरे नुस्खे",
    },
  }

  const t = translations[selectedLanguage as keyof typeof translations] || translations.en

  const categories = [
    "Antibiotics",
    "Pain Relief",
    "Diabetes",
    "Blood Pressure",
    "Heart Disease",
    "Respiratory",
    "Digestive",
    "Vitamins",
    "First Aid",
    "Chronic Care",
  ]

  // Mock medicine data
  const mockMedicines = [
    {
      id: "1",
      name: "Paracetamol 500mg",
      genericName: "Acetaminophen",
      category: "Pain Relief",
      manufacturer: "Sun Pharma",
      availability: [
        {
          location: "Nabha Civil Hospital",
          type: "hospital",
          status: "available",
          price: 15,
          stock: 150,
          distance: "0 km",
          phone: "+91-1765-222333",
          address: "Civil Hospital Road, Nabha",
          lastUpdated: "2 hours ago",
        },
        {
          location: "Sharma Medical Store",
          type: "pharmacy",
          status: "available",
          price: 18,
          stock: 45,
          distance: "0.5 km",
          phone: "+91-98765-43210",
          address: "Main Market, Nabha",
          lastUpdated: "1 hour ago",
        },
        {
          location: "City Pharmacy",
          type: "pharmacy",
          status: "limited",
          price: 20,
          stock: 8,
          distance: "1.2 km",
          phone: "+91-98765-43211",
          address: "Bus Stand Road, Nabha",
          lastUpdated: "3 hours ago",
        },
      ],
    },
    {
      id: "2",
      name: "Metformin 500mg",
      genericName: "Metformin HCl",
      category: "Diabetes",
      manufacturer: "Cipla",
      availability: [
        {
          location: "Nabha Civil Hospital",
          type: "hospital",
          status: "available",
          price: 25,
          stock: 200,
          distance: "0 km",
          phone: "+91-1765-222333",
          address: "Civil Hospital Road, Nabha",
          lastUpdated: "2 hours ago",
        },
        {
          location: "Sharma Medical Store",
          type: "pharmacy",
          status: "unavailable",
          price: 0,
          stock: 0,
          distance: "0.5 km",
          phone: "+91-98765-43210",
          address: "Main Market, Nabha",
          lastUpdated: "1 hour ago",
        },
      ],
    },
    {
      id: "3",
      name: "Amoxicillin 250mg",
      genericName: "Amoxicillin",
      category: "Antibiotics",
      manufacturer: "Ranbaxy",
      availability: [
        {
          location: "Nabha Civil Hospital",
          type: "hospital",
          status: "limited",
          price: 35,
          stock: 12,
          distance: "0 km",
          phone: "+91-1765-222333",
          address: "Civil Hospital Road, Nabha",
          lastUpdated: "2 hours ago",
        },
        {
          location: "City Pharmacy",
          type: "pharmacy",
          status: "available",
          price: 42,
          stock: 30,
          distance: "1.2 km",
          phone: "+91-98765-43211",
          address: "Bus Stand Road, Nabha",
          lastUpdated: "3 hours ago",
        },
      ],
    },
  ]

  const handleSearch = useCallback(async () => {
    setIsSearching(true)

    try {
      let results = mockMedicines
      const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}')
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

      // If patient is logged in, ONLY show prescribed medicines (as requested)
      if (currentUser.id && currentUser.role === 'patient') {
        const response = await fetch(`${API_URL}/api/prescriptions/${currentUser.id}`);
        if (response.ok) {
          const prescribedMedicines = await response.json();
          results = results.filter(medicine =>
            prescribedMedicines.some((p: { medicine_name: string }) =>
              p.medicine_name.toLowerCase().includes(medicine.name.toLowerCase()) ||
              medicine.name.toLowerCase().includes(p.medicine_name.toLowerCase())
            )
          )
        }
      }

      if (searchQuery) {
        results = results.filter(
          (medicine) =>
            medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      }

      if (selectedCategory && selectedCategory !== "all") {
        results = results.filter((medicine) => medicine.category === selectedCategory)
      }

      setSearchResults(results)
    } catch (err) {
      console.error("Error fetching prescribed medicines:", err);
    } finally {
      setIsSearching(false)
      setLastUpdated(new Date())
    }
  }, [searchQuery, selectedCategory])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "limited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "unavailable":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4" />
      case "limited":
        return <AlertTriangle className="w-4 h-4" />
      case "unavailable":
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return t.available
      case "limited":
        return t.limited
      case "unavailable":
        return t.notAvailable
      default:
        return status
    }
  }

  // Auto-search on component mount
  useEffect(() => {
    handleSearch()
  }, [handleSearch])

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
                <Pill className="w-6 h-6 text-primary" />
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
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              {t.searchMedicine}
            </CardTitle>
            <CardDescription>Find medicines across local pharmacies and hospital dispensary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">{t.searchMedicine}</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">{t.category}</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t.allCategories} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.allCategories}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full" disabled={isSearching}>
                  {isSearching ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  {t.search}
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {t.lastUpdated}: {lastUpdated.toLocaleTimeString()}
              </span>
              <Button variant="ghost" size="sm" onClick={handleSearch}>
                <RefreshCw className="w-4 h-4 mr-2" />
                {t.refresh}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <div className="space-y-6">
          {searchResults.length === 0 && !isSearching && (
            <Card>
              <CardContent className="py-8 text-center">
                <Pill className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">{t.noResults}</p>
              </CardContent>
            </Card>
          )}

          {searchResults.map((medicine) => (
            <Card key={medicine.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{medicine.name}</CardTitle>
                    <CardDescription>
                      {medicine.genericName} • {medicine.manufacturer}
                    </CardDescription>
                    <Badge variant="secondary" className="mt-2">
                      {medicine.category}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold">{t.availability}</h4>

                  <div className="grid gap-4">
                    {medicine.availability.map((location: Location, index: number) => (
                      <Card key={index} className="border-l-4 border-l-primary/20">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  {location.type === "hospital" ? (
                                    <Star className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Pill className="w-4 h-4 text-primary" />
                                  )}
                                </div>
                                <div>
                                  <h5 className="font-medium">{location.location}</h5>
                                  <p className="text-sm text-muted-foreground">
                                    {location.type === "hospital" ? t.nabhaHospital : t.pharmacy}
                                  </p>
                                </div>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">{t.price}</p>
                                  <p className="font-medium">
                                    {location.status === "unavailable" ? "N/A" : `₹${location.price}`}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-muted-foreground">{t.distance}</p>
                                  <p className="font-medium">{location.distance}</p>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground mt-2">
                                {t.lastUpdated}: {location.lastUpdated}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(location.status)}>
                                {getStatusIcon(location.status)}
                                <span className="ml-1">{getStatusText(location.status)}</span>
                              </Badge>

                              {location.status !== "unavailable" && (
                                <p className="text-xs text-muted-foreground">Stock: {location.stock}</p>
                              )}

                              <div className="flex gap-2">
                                <Button size="sm" variant="outline">
                                  <Phone className="w-3 h-3 mr-1" />
                                  {t.call}
                                </Button>
                                <Button size="sm" variant="outline">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {t.directions}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              Medicine Supply Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">1</div>
                <div className="text-sm text-muted-foreground">Hospital Dispensary</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-secondary">15</div>
                <div className="text-sm text-muted-foreground">Partner Pharmacies</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-accent">500+</div>
                <div className="text-sm text-muted-foreground">Medicines Tracked</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Availability Updates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
