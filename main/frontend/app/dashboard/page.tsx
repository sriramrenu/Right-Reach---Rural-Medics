"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    User,
    QrCode,
    FileText,
    Pill,
    Calendar,
    ArrowLeft,
    LogOut,
    Shield,
    Activity,
    ChevronRight,
    PlusCircle,
    Search,
    CheckCircle2,
    Users,
    Building,
    TrendingUp,
    AlertCircle,
    Stethoscope,
    MapPin,
    Coins
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { QRCodeSVG } from "qrcode.react"

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null)
    const router = useRouter()
    const qrRef = useRef<HTMLDivElement>(null)
    const [appointments, setAppointments] = useState<any[]>([])
    const [prescriptions, setPrescriptions] = useState<any[]>([])
    const [stats, setStats] = useState<any>({ patient: 0, doctor: 0, admin: 0 })

    // Doctor/Admin states
    const [uhidSearch, setUhidSearch] = useState("")
    const [searchedPatient, setSearchedPatient] = useState<any>(null)
    const [newPrescription, setNewPrescription] = useState({ name: "", dosage: "", frequency: "" })

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('current_user') || 'null')
        const token = localStorage.getItem('token')

        if (!currentUser || !token) {
            router.push('/login')
            return
        }

        setUser(currentUser)
        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')

        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            const headers = {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            };

            try {
                const aptRes = await fetch(`${API_URL}/api/appointments/${currentUser.id}`, { headers });
                if (aptRes.ok) setAppointments(await aptRes.json());

                const preRes = await fetch(`${API_URL}/api/prescriptions/${currentUser.id}`, { headers });
                if (preRes.ok) setPrescriptions(await preRes.json());

                if (currentUser.role === 'admin') {
                    const statsRes = await fetch(`${API_URL}/api/stats`, { headers });
                    if (statsRes.ok) setStats(await statsRes.json());
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            }
        };
        fetchData();
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('current_user')
        localStorage.removeItem('token')
        router.replace('/')
    }

    const handleDownloadQR = () => {
        if (!qrRef.current) return;
        const svg = qrRef.current.querySelector('svg');
        if (!svg) return;
        const serializer = new XMLSerializer();
        const svgStr = serializer.serializeToString(svg);
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 340;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 300, 340);
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 25, 20, 250, 250);
            ctx.fillStyle = '#0f172a';
            ctx.font = 'bold 14px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('Right Reach Health ID', 150, 295);
            ctx.font = '12px monospace';
            ctx.fillStyle = '#64748b';
            ctx.fillText(`UHID: ${user?.id}`, 150, 318);
            const a = document.createElement('a');
            a.download = `RightReach_UHID_${user?.id}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgStr);
    };

    const handlePatientSearch = async () => {
        const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/patients/${uhidSearch}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                setSearchedPatient(await response.json());
            } else {
                alert("UHID not found or access denied.")
            }
        } catch (err) {
            alert("Search failed. Server error.")
        }
    }

    const handleAddPrescription = async () => {
        if (searchedPatient && newPrescription.name) {
            const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_URL}/api/prescriptions`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        patientUhid: searchedPatient.uhid,
                        doctorUhid: user.id,
                        medicineName: newPrescription.name,
                        dosage: newPrescription.dosage,
                        frequency: newPrescription.frequency
                    })
                });

                if (response.ok) {
                    alert(`Prescription for ${newPrescription.name} added to ${searchedPatient.firstName}'s record.`)
                    setNewPrescription({ name: "", dosage: "", frequency: "" })
                } else {
                    alert("Failed to add prescription.")
                }
            } catch (err) {
                alert("Server error adding prescription.")
            }
        }
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>Please register or login to view your personalized dashboard</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col sm:flex-row justify-center gap-3">
                        <Link href="/login" className="flex-1">
                            <Button className="w-full">Sign In</Button>
                        </Link>
                        <Link href="/register" className="flex-1">
                            <Button variant="secondary" className="w-full">Register</Button>
                        </Link>
                        <Link href="/" className="flex-1">
                            <Button variant="outline" className="w-full">Home</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="border-b border-border bg-white sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Home
                            </Button>
                        </Link>
                        <h1 className="text-xl font-bold flex items-center gap-2">
                            <Shield className="w-5 h-5 text-primary" />
                            Right Reach {user.role === 'patient' ? 'Wallet' : 'Staff Portal'}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="capitalize font-mono px-3 py-1">Role: {user.role}</Badge>
                        <Button variant="ghost" size="sm" onClick={handleLogout} className="text-destructive hover:text-destructive">
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* PATIENT VIEW */}
                {user.role === 'patient' && (
                    <div className="space-y-8">
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="md:col-span-2 overflow-hidden border-2 border-primary/20">
                                <div className="bg-primary/5 p-6 flex flex-col md:flex-row items-center gap-6">
                                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-white shadow-sm font-bold text-4xl text-primary uppercase">
                                        {user.name?.[0] || 'P'}
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h2 className="text-2xl font-bold">{user.name}</h2>
                                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-mono">
                                                UHID: {user.id}
                                            </Badge>
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                Verified Patient
                                            </Badge>
                                            {user.bloodGroup && (
                                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                                    Blood: {user.bloodGroup}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-3 flex items-center justify-center md:justify-start gap-2">
                                            <MapPin className="w-4 h-4" />
                                            {user.village}, {user.district}, {user.state}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1 flex items-center justify-center md:justify-start gap-2">
                                            <Activity className="w-4 h-4" />
                                            Encrypted health record active
                                        </p>
                                    </div>
                                    <div ref={qrRef} className="bg-white p-3 rounded-xl shadow-sm border border-border flex flex-col items-center gap-1">
                                        <QRCodeSVG
                                            value={user.id || 'UHID_NOT_SET'}
                                            size={90}
                                            bgColor="#ffffff"
                                            fgColor="#0f172a"
                                            level="H"
                                            includeMargin={false}
                                        />
                                        <p className="text-[9px] text-center font-mono uppercase tracking-tighter text-muted-foreground">Your Health ID</p>
                                        <button
                                            onClick={handleDownloadQR}
                                            className="text-[9px] text-primary underline hover:no-underline mt-0.5"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="bg-primary text-white border-none shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="grid gap-3">
                                    <Link href="/telemedicine">
                                        <Button className="w-full bg-white text-primary hover:bg-white/90 justify-between">
                                            Speak to Doctor
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/medicines">
                                        <Button className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 justify-between">
                                            Track My Meds
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Upcoming Visits
                                </h3>
                                {appointments.length > 0 ? appointments.map((apt: any) => (
                                    <Card key={apt.id}>
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{apt.doctorName}</p>
                                                <p className="text-sm text-muted-foreground">{apt.date} at {apt.time}</p>
                                            </div>
                                            <Badge>Confirmed</Badge>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="border-dashed bg-muted/50 p-8 text-center text-muted-foreground italic">
                                        No appointments scheduled
                                    </Card>
                                )}
                            </section>

                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <Pill className="w-5 h-5 text-green-600" />
                                    Current Prescriptions
                                </h3>
                                {prescriptions.length > 0 ? prescriptions.map((p: any, i: number) => (
                                    <Card key={i}>
                                        <CardContent className="p-4 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold">{p.name}</p>
                                                <p className="text-sm text-muted-foreground">{p.dosage} • {p.frequency}</p>
                                            </div>
                                            <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                                        </CardContent>
                                    </Card>
                                )) : (
                                    <Card className="border-dashed bg-muted/50 p-8 text-center text-muted-foreground italic">
                                        No active prescriptions found
                                    </Card>
                                )}
                            </section>
                        </div>

                        {/* Health Services Grid */}
                        <section className="space-y-6 pt-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold flex items-center gap-2 text-[#0f172a]">
                                    <Activity className="w-6 h-6 text-primary" />
                                    Health Services & Tools
                                </h3>
                            </div>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { href: "/telemedicine", title: "Consultation", desc: "Speak to Doctors", icon: <Stethoscope className="w-6 h-6" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
                                    { href: "/medicines", title: "Pharmacy", desc: "Track Medicines", icon: <Pill className="w-6 h-6" />, color: "bg-green-50 text-green-600 border-green-100" },
                                    { href: "/symptoms", title: "Symptoms", desc: "AI Health Check", icon: <Activity className="w-6 h-6" />, color: "bg-purple-50 text-purple-600 border-purple-100" },
                                    { href: "/schemes", title: "Govt Schemes", desc: "Benefit Matching", icon: <Building className="w-6 h-6" />, color: "bg-amber-50 text-amber-600 border-amber-100" },
                                    { href: "/camps", title: "NGO Camps", desc: "Find Local Clinics", icon: <MapPin className="w-6 h-6" />, color: "bg-rose-50 text-rose-600 border-rose-100" },
                                    { href: "/funding", title: "Crowd Funding", desc: "Financial Support", icon: <Coins className="w-6 h-6" />, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
                                ].map((service, i) => (
                                    <Link key={i} href={service.href}>
                                        <Card className={`hover:shadow-lg transition-all cursor-pointer border-none ${service.color} group`}>
                                            <CardContent className="p-6">
                                                <div className="flex flex-col gap-4 text-center items-center">
                                                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                                                        {service.icon}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold block">{service.title}</p>
                                                        <p className="text-[10px] opacity-70 uppercase font-semibold mt-1">{service.desc}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    </div>
                )}

                {/* DOCTOR VIEW */}
                {user.role === 'doctor' && (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 space-y-6">
                                <Card className="border-primary/20 shadow-sm overflow-hidden">
                                    <div className="bg-primary/5 p-6 flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-2xl uppercase">
                                            {user.firstName?.[0] || user.name?.[0] || 'D'}
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold">Dr. {user.firstName || user.name} {user.lastName || ''}</h2>
                                            <div className="flex gap-2 items-center mt-1">
                                                <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                                                    {user.specialization || 'Medical Practitioner'}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">License: {user.licenseNumber || 'Verified'}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                                <Building className="w-3 h-3" />
                                                {user.hospitalName || 'Right Reach Health Center'}
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {/* Patient Lookup */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-lg flex items-center gap-2">
                                            <Search className="w-5 h-5" />
                                            Patient Lookup
                                        </CardTitle>
                                        <CardDescription>Enter patient UHID to access encrypted records</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="12-digit UHID"
                                                value={uhidSearch}
                                                onChange={(e) => setUhidSearch(e.target.value)}
                                                className="font-mono"
                                            />
                                            <Button onClick={handlePatientSearch}>Access Record</Button>
                                        </div>

                                        {searchedPatient && (
                                            <div className="mt-6 p-6 rounded-xl bg-slate-100 border-2 border-primary/20 animate-in fade-in slide-in-from-top-2">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{searchedPatient.firstName} {searchedPatient.lastName}</h3>
                                                        <p className="text-sm text-muted-foreground">Age: 34 • Gender: {searchedPatient.gender}</p>
                                                    </div>
                                                    <Badge className="font-mono">UHID: {searchedPatient.uhid}</Badge>
                                                </div>

                                                <div className="mt-6 grid grid-cols-2 gap-4">
                                                    <Card className="bg-white/50 border-none shadow-none">
                                                        <CardHeader className="p-3">
                                                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Allergies</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-3 pt-0 text-sm font-medium">
                                                            {searchedPatient.allergies || "None reported"}
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="bg-white/50 border-none shadow-none">
                                                        <CardHeader className="p-3">
                                                            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">Conditions</CardTitle>
                                                        </CardHeader>
                                                        <CardContent className="p-3 pt-0 text-sm font-medium">
                                                            {searchedPatient.chronicConditions || "None"}
                                                        </CardContent>
                                                    </Card>
                                                </div>

                                                {/* Prescription Form */}
                                                <div className="mt-8 space-y-4 pt-6 border-t border-slate-200">
                                                    <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                                                        <Pill className="w-4 h-4" />
                                                        Write Prescription
                                                    </h4>
                                                    <div className="grid md:grid-cols-3 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px]">Medicine Name</Label>
                                                            <Input
                                                                placeholder="e.g. Paracetamol"
                                                                value={newPrescription.name}
                                                                onChange={(e) => setNewPrescription({ ...newPrescription, name: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px]">Dosage</Label>
                                                            <Input
                                                                placeholder="e.g. 500mg"
                                                                value={newPrescription.dosage}
                                                                onChange={(e) => setNewPrescription({ ...newPrescription, dosage: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-[10px]">Frequency</Label>
                                                            <Input
                                                                placeholder="e.g. 1-0-1"
                                                                value={newPrescription.frequency}
                                                                onChange={(e) => setNewPrescription({ ...newPrescription, frequency: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <Button className="w-full gap-2" variant="secondary" onClick={handleAddPrescription}>
                                                        <PlusCircle className="w-4 h-4" />
                                                        Sign and Add to Record
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="w-full md:w-80 space-y-6">
                                <Card className="bg-slate-900 text-white border-none">
                                    <CardHeader>
                                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                                            <Activity className="w-4 h-4" />
                                            Queue Status
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center text-xs">
                                            <span>Total Consultations</span>
                                            <span className="font-bold">24</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs">
                                            <span>Avg Session Time</span>
                                            <span className="font-bold text-green-400">12m</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full w-[65%]"></div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4" />
                                            Staff Tools
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="grid gap-2">
                                        <Link href="/telemedicine">
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <Activity className="w-3.5 h-3.5 mr-2" />
                                                Telemedicine Portal
                                            </Button>
                                        </Link>
                                        <Link href="/camps">
                                            <Button variant="outline" className="w-full justify-start text-xs h-9" size="sm">
                                                <MapPin className="w-3.5 h-3.5 mr-2" />
                                                Camp Management
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="pb-3">
                                        <CardTitle className="text-sm">Today&apos;s Appointments</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">P{i}</div>
                                                <div className="flex-1">
                                                    <p className="text-xs font-bold">Patient ID #81920</p>
                                                    <p className="text-[10px] text-muted-foreground">General Consult • 10:30 AM</p>
                                                </div>
                                                <ChevronRight className="w-3 h-3 text-muted-foreground" />
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADMIN VIEW */}
                {user.role === 'admin' && (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                                <Building className="w-8 h-8 text-primary" />
                                Regional Health Command Center
                            </h2>
                            <div className="flex gap-2">
                                <Link href="/camps">
                                    <Button variant="outline" size="sm">Manage Camps</Button>
                                </Link>
                                <Link href="/funding">
                                    <Button variant="outline" size="sm">Funding Logs</Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-4 gap-4">
                            {[
                                { label: "Total Patients", val: (stats.patient || 0).toLocaleString(), icon: <FileText className="w-4 h-4" />, color: "text-blue-600" },
                                { label: "Active Doctors", val: (stats.doctor || 0).toString(), icon: <Users className="w-4 h-4" />, color: "text-primary" },
                                { label: "System Admins", val: (stats.admin || 0).toString(), icon: <Shield className="w-4 h-4" />, color: "text-green-600" },
                                { label: "Offline Sync Rate", val: "98.2%", icon: <Activity className="w-4 h-4" />, color: "text-amber-600" },
                            ].map((stat, i) => (
                                <Card key={i} className="shadow-sm">
                                    <CardContent className="p-4 flex flex-col gap-1">
                                        <div className={`p-2 w-fit rounded-lg bg-slate-100 ${stat.color}`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-2">{stat.label}</p>
                                        <p className="text-xl font-bold">{stat.val}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Verification Queue */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-primary" />
                                    Verification Queue
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { name: "Mega Health Camp - Bhatinda", type: "Camp", provider: "Rotary NGO" },
                                        { name: "Med Ledger: CASE-902", type: "Funding", provider: "Patient P." },
                                        { name: "Dr. Ananya Sharma", type: "Staff", provider: "License #MH-221" },
                                    ].map((item, i) => (
                                        <Card key={i} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                        {item.type === 'Camp' ? <MapPin className="w-5 h-5" /> : item.type === 'Funding' ? <Coins className="w-5 h-5" /> : <User className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-sm">{item.name}</p>
                                                            <Badge variant="outline" className="text-[8px] h-4 uppercase">{item.type}</Badge>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{item.provider}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="ghost" className="text-destructive">Reject</Button>
                                                    <Button size="sm">Approve</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </section>

                            {/* System Health */}
                            <section className="space-y-4">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5 text-amber-600" />
                                    Region Health Trends
                                </h3>
                                <Card className="h-[400px] flex items-center justify-center bg-slate-100 border-dashed">
                                    <div className="text-center space-y-2 opacity-40">
                                        <TrendingUp className="w-12 h-12 mx-auto" />
                                        <p className="text-sm font-medium font-mono uppercase tracking-widest">Aggregate Data Visualization</p>
                                        <p className="text-xs">Connecting to District Health Hub...</p>
                                    </div>
                                </Card>
                            </section>
                        </div>
                    </div>
                )}

            </main>
        </div>
    )
}
