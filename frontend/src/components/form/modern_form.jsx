import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Upload,
    Mic,
    User,
    MapPin,
    Palette,
    Globe,
    FileText,
    Image as ImageIcon,
    Sparkles,
    MicOff
} from "lucide-react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Select } from "@/components/retroui/Select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUpload } from "./image_upload.jsx/image_upload.jsx";
import StarFigure from "@/components/figures/star_figure";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Request } from "@/request/request";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

// Indian states array
const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
    "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
    "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters."),
    state: z.string().min(1, "Please select your state."),
    artform: z.string().min(0, "Please enter your art form."),
    market: z.string().min(0, "Please select your target market."),
    story: z.string().min(0, "Story must be at least 10 characters."),
    description: z.string().min(0, "Description must be at least 10 characters."),
});

export function ModernFormPage() {
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [currentField, setCurrentField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef(null);
    const lastTranscriptRef = useRef("");
    const baseValueRef = useRef("");

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            state: "",
            artform: "",
            market: "",
            story: "",
            description: "",
        },
    });

    const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

    // Handle voice recording
    const handleVoiceRecord = (field) => {
        if (listening && currentField === field) {
            SpeechRecognition.stopListening();
            setCurrentField(null);
            lastTranscriptRef.current = "";
            baseValueRef.current = "";
        } else {
            resetTranscript();
            lastTranscriptRef.current = "";
            baseValueRef.current = form.getValues(field) || "";
            setCurrentField(field);
            SpeechRecognition.startListening({ continuous: true, interimResults: false });
        }
    };

    useEffect(() => {
        if (!currentField) return;
        const base = baseValueRef.current || "";
        const spoken = transcript || "";
        const updatedValue = (base + (base && spoken ? " " : "") + spoken).trim();
        form.setValue(currentField, updatedValue);
        lastTranscriptRef.current = transcript || "";
    }, [transcript, currentField, form]);

    // Handle form submission
    const onSubmit = async (values) => {
        setIsSubmitting(true);
        console.log("Form Values:", values);

        const formData = new FormData();
        formData.append("artistName", values.name || "");
        formData.append("state", values.state || "");
        formData.append("artForm", values.artform || "");
        formData.append("targetRegion", values.market || "");
        formData.append("artistDescription", values.story || "");
        formData.append("productDescription", values.description || "");
        formData.append("language", "en");

        if (images && images.length > 0) {
            formData.append("image", images[0]);
        }

        try {
            console.log("Submitting form data:", {
                artistName: values.name,
                state: values.state,
                artForm: values.artform,
                targetRegion: values.market,
                artistDescription: values.story,
                productDescription: values.description,
                language: "en",
                hasImage: images && images.length > 0
            });
            
            const resp = await Request.postByUrl("/artisan/generateContent", formData, true);
            console.log("=== BACKEND RESPONSE DEBUG ===");
            console.log("Response type:", typeof resp);
            console.log("Response keys:", Object.keys(resp || {}));
            console.log("Response.success:", resp?.success);
            console.log("Response.id:", resp?.id);
            console.log("Response.message:", resp?.message);
            console.log("Response.data type:", typeof resp?.data);
            console.log("Response.data keys:", Object.keys(resp?.data || {}));
            console.log("Response size:", JSON.stringify(resp).length + " chars");
            console.log("=== END DEBUG ===");

            // Check if the response is successful and has an ID
            if (resp && resp.success && resp.id) {
                console.log("✅ Form submitted successfully, navigating to asset generation page with ID:", resp.id);
                navigate(`/asset_gen/${resp.id}`);
            } else {
                console.error("❌ Form submission failed:", resp);
                console.error("❌ Success check:", resp?.success);
                console.error("❌ ID check:", resp?.id);
                alert(`Form submission failed: ${resp?.message || 'Unknown error'}. Please try again.`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            // Show more detailed error message
            const errorMessage = error.response?.data?.detail || error.message || 'Network error';
            alert(`Failed to submit form: ${errorMessage}. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const FormSection = ({ title, titleHindi, children, bgColor = "bg-white" , icon: Icon}) => (
        <div className={`${bgColor} border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 hover:rotate-1`}>
            <div className="flex items-center mb-6">
                <div className="bg-black text-white p-3 border-2 border-black mr-4 transform rotate-3">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <Text as="h3" className="text-2xl font-black uppercase">{title}</Text>
                    <Text className="text-lg font-bold text-gray-600">{titleHindi}</Text>
                </div>
            </div>
            {children}
        </div>
    );

    const VoiceInput = ({ field, placeholder, isTextarea = false }) => (
        <div className="relative">
            <FormControl>
                {isTextarea ? (
                    <Textarea
                        placeholder={placeholder}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pr-16"
                        rows={4}
                        {...field}
                        disabled={isSubmitting || (listening && currentField !== field.name)}
                    />
                ) : (
                    <Input
                        placeholder={placeholder}
                        className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] pr-16"
                        {...field}
                        disabled={isSubmitting || (listening && currentField !== field.name)}
                    />
                )}
            </FormControl>
            {browserSupportsSpeechRecognition && (
                <button
                    type="button"
                    onClick={() => handleVoiceRecord(field.name)}
                    disabled={isSubmitting}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 border-2 border-black ${
                        isSubmitting 
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : listening && currentField === field.name
                                ? "bg-red-500 text-white animate-pulse"
                                : "bg-yellow-300 text-black hover:bg-yellow-400"
                        }`}
                >
                    {listening && currentField === field.name ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
            )}
        </div>
    );

    if (!browserSupportsSpeechRecognition) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#fdfbf6]">
                <div className="bg-red-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <Text className="font-bold text-xl">Browser does not support speech recognition.</Text>
                </div>
            </div>
        );
    }

    // Loading Screen
    if (isSubmitting) {
        return (
            <div className="min-h-screen bg-[#fdfbf6] flex items-center justify-center relative overflow-hidden">
                {/* Decorative Elements */}
                <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10 animate-spin" />
                <StarFigure color="#FFD700" stroke="black" className="absolute bottom-32 left-16 w-8 h-8 z-10 animate-bounce" />
                <StarFigure color="#FF6B6B" stroke="black" className="absolute top-1/2 right-32 w-4 h-4 z-10 animate-pulse" />
                
                <div className="text-center max-w-2xl mx-auto px-4">
                    {/* Main Loading Card */}
                    <div className="bg-yellow-400 border-6 border-black p-8 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transform rotate-2 mb-8">
                        <div className="bg-black text-white p-4 border-4 border-white inline-block transform -rotate-3 mb-6 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                            <Text as="h1" className="text-4xl font-black uppercase tracking-widest">
                                PROCESSING
                            </Text>
                        </div>
                        
                        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                            <div className="flex items-center justify-center mb-4">
                                <Sparkles className="w-12 h-12 text-black animate-spin mr-4" />
                                <Text className="text-2xl font-black uppercase">Creating Your Assets</Text>
                                <Sparkles className="w-12 h-12 text-black animate-spin ml-4" />
                            </div>
                            
                            <Text className="text-lg font-bold text-gray-700 mb-6">
                                आपकी संपत्ति बनाई जा रही है...
                            </Text>
                            
                            {/* Progress Steps */}
                            <div className="space-y-3">
                                <div className="bg-green-300 border-4 border-black p-3 transform rotate-1">
                                    <Text className="font-black uppercase">🎨 Analyzing Your Craft</Text>
                                </div>
                                <div className="bg-blue-300 border-4 border-black p-3 transform -rotate-1">
                                    <Text className="font-black uppercase">📸 Processing Images</Text>
                                </div>
                                <div className="bg-pink-300 border-4 border-black p-3 transform rotate-1">
                                    <Text className="font-black uppercase">✨ Generating Content</Text>
                                </div>
                                <div className="bg-purple-300 border-4 border-black p-3 transform -rotate-1">
                                    <Text className="font-black uppercase">🚀 Preparing Results</Text>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Warning Message */}
                    <div className="bg-red-400 border-4 border-black p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                        <Text className="font-black uppercase text-lg">
                            ⚠️ Please Wait - Do Not Refresh or Navigate Away!
                        </Text>
                        <Text className="font-bold mt-2">
                            कृपया प्रतीक्षा करें - रीफ्रेश न करें या दूसरे पेज पर न जाएं!
                        </Text>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf6] py-8 px-4">
            {/* Decorative Elements */}
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] transform -rotate-1 inline-block">
                        <Text as="h1" className="text-3xl font-black uppercase tracking-wider">
                            Craft Details Form
                        </Text>
                        <Text className="text-lg font-bold mt-2">
                            शिल्प विवरण फॉर्म
                        </Text>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                        {/* Personal Information */}
                        <FormSection title="Personal Information" titleHindi="व्यक्तिगत जानकारी" icon={User} bgColor="bg-yellow-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                Name / नाम
                                            </FormLabel>
                                            <VoiceInput field={field} placeholder="Enter your name / अपना नाम दर्ज करें" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="state"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                State / राज्य
                                            </FormLabel>
                                            <FormControl>
                                                <Select value={field.value} onValueChange={field.onChange} disabled={isSubmitting}>
                                                    <Select.Trigger className="w-full border-4 border-black p-4 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                                        <Select.Value placeholder="Select your state / अपना राज्य चुनें" />
                                                    </Select.Trigger>
                                                    <Select.Content>
                                                        <Select.Group>
                                                            {indianStates.map((state) => (
                                                                <Select.Item key={state} value={state}>
                                                                    {state}
                                                                </Select.Item>
                                                            ))}
                                                        </Select.Group>
                                                    </Select.Content>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormSection>

                        {/* Craft Details */}
                        <FormSection title="Craft Details" titleHindi="शिल्प विवरण" icon={Palette} bgColor="bg-green-200">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="artform"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                Art Form / कला रूप
                                            </FormLabel>
                                            <VoiceInput field={field} placeholder="e.g., Pottery, Weaving / जैसे मिट्टी के बर्तन, बुनाई" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="market"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                Target Market / लक्षित बाज़ार
                                            </FormLabel>
                                            <VoiceInput field={field} placeholder="Local, National, International / स्थानीय, राष्ट्रीय, अंतर्राष्ट्रीय" />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormSection>

                        {/* Story & Description */}
                        <FormSection title="Your Story" titleHindi="आपकी कहानी" icon={FileText} bgColor="bg-pink-200">
                            <div className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="story"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                Artisan Story / कारीगर की कहानी
                                            </FormLabel>
                                            <VoiceInput
                                                field={field}
                                                placeholder="Tell us about your journey, inspiration, and techniques / अपनी यात्रा, प्रेरणा और तकनीकों के बारे में बताएं"
                                                isTextarea={true}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-lg font-black">
                                                Product Description / उत्पाद विवरण
                                            </FormLabel>
                                            <VoiceInput
                                                field={field}
                                                placeholder="Describe your product in detail / अपने उत्पाद का विस्तृत विवरण दें"
                                                isTextarea={true}
                                            />
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </FormSection>

                        {/* Image Upload */}
                        <FormSection title="Product Images" titleHindi="उत्पाद चित्र" icon={ImageIcon} bgColor="bg-blue-200">
                            <ImageUpload
                                images={images}
                                setImages={setImages}
                                isDragging={isDragging}
                                setIsDragging={setIsDragging}
                                inputRef={inputRef}
                            />
                        </FormSection>

                        {/* Submit Button */}
                        <div className="text-center">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black text-white font-black text-xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,219,51,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 "
                            >
                                {isSubmitting ? (
                                    <>
                                        <Sparkles className="w-6 h-6 mr-3 animate-spin" />
                                        Processing... / प्रसंस्करण...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-6 h-6 mr-3" />
                                        Create Asset / संपत्ति बनाएं
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}