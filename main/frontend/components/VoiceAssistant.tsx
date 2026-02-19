"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Volume2, X, Command } from "lucide-react"
import { useRouter } from "next/navigation"

export default function VoiceAssistant() {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const router = useRouter()

    const handleCommand = useCallback((command: string) => {
        const cmd = command.toLowerCase()

        if (cmd.includes("home") || cmd.includes("back")) {
            router.push("/")
        } else if (cmd.includes("medicine") || cmd.includes("tracker")) {
            router.push("/medicines")
        } else if (cmd.includes("telemedicine") || cmd.includes("doctor") || cmd.includes("consult")) {
            router.push("/telemedicine")
        } else if (cmd.includes("register") || cmd.includes("new patient")) {
            router.push("/register")
        } else if (cmd.includes("scheme") || cmd.includes("government")) {
            router.push("/schemes")
        } else if (cmd.includes("camp") || cmd.includes("location") || cmd.includes("map")) {
            router.push("/camps")
        } else if (cmd.includes("funding") || cmd.includes("donate") || cmd.includes("support")) {
            router.push("/funding")
        } else if (cmd.includes("dashboard") || cmd.includes("wallet") || cmd.includes("profile")) {
            router.push("/dashboard")
        }
    }, [router])

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window) && !("speechRecognition" in window)) {
            console.log("Speech recognition not supported")
            return
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition
        const recognition = new SpeechRecognition()

        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "en-IN" // Can be switched based on selected language

        recognition.onresult = (event: any) => {
            let interimTranscript = ""
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    const final = event.results[i][0].transcript
                    setTranscript(final)
                    handleCommand(final)
                    setIsListening(false)
                } else {
                    interimTranscript += event.results[i][0].transcript
                }
            }
            setTranscript(interimTranscript)
        }

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error)
            setIsListening(false)
        }

        if (isListening) {
            recognition.start()
        } else {
            recognition.stop()
        }

        return () => recognition.stop()
    }, [isListening, handleCommand])

    if (!isVisible) {
        return (
            <Button
                variant="secondary"
                size="icon"
                className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg border-2 border-primary/20 z-50 hover:scale-110 transition-transform"
                onClick={() => setIsVisible(true)}
            >
                <Mic className="h-6 w-6 text-primary" />
            </Button>
        )
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-primary/10 z-50 overflow-hidden animate-in slide-in-from-bottom-5">
            <div className="bg-primary p-3 flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Voice Assistant</span>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-white hover:bg-white/10" onClick={() => setIsVisible(false)}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className="p-6 flex flex-col items-center gap-4">
                <div className={`p-4 rounded-full ${isListening ? 'bg-red-100 animate-pulse' : 'bg-primary/10'}`}>
                    {isListening ? (
                        <Mic className="h-8 w-8 text-red-600" />
                    ) : (
                        <MicOff className="h-8 w-8 text-primary" />
                    )}
                </div>

                <div className="text-center">
                    <p className="text-sm font-medium text-slate-900 mb-1">
                        {isListening ? "Listening..." : "Tap to speak"}
                    </p>
                    <p className="text-xs text-muted-foreground min-h-[20px] italic">
                        {transcript || 'Try "Go to Medicines" or "Open Registration"'}
                    </p>
                </div>

                <Button
                    className={`w-full ${isListening ? 'bg-red-600 hover:bg-red-700' : ''}`}
                    onClick={() => setIsListening(!isListening)}
                >
                    {isListening ? "Stop Listening" : "Start Listening"}
                </Button>

                <div className="w-full pt-4 border-t border-slate-100">
                    <p className="text-[10px] text-muted-foreground uppercase mb-2 flex items-center gap-1">
                        <Command className="w-3 h-3" />
                        Quick Commands
                    </p>
                    <div className="flex flex-wrap gap-1">
                        {["Home", "Doctor", "Meds", "Camps", "Register"].map(cmd => (
                            <span key={cmd} className="text-[9px] bg-slate-100 px-2 py-1 rounded-md text-slate-600">"{cmd}"</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
