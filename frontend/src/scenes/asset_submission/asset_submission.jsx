import React, { useState } from "react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Mic, FileText, Sparkles, ArrowRight } from "lucide-react";
import StarFigure from "@/components/figures/star_figure";
import { ModernFormPage } from "@/components/form/modern_form";
import { AudioFormPage } from "@/components/form/audio_form";

export function AssetSubmission() {
    const [inputMode, setInputMode] = useState(null); // null, 'form', 'audio'

    if (!inputMode) {
        return (
            <div className="min-h-screen bg-[#fdfbf6] py-16 px-4">
                {/* Decorative Elements */}
                <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-8 h-8 z-10" />
                <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-10 h-10 z-10" />

                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="bg-black text-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,219,51,1)] transform -rotate-2 inline-block mb-8">
                            <Text as="h1" className="text-4xl md:text-5xl font-black uppercase tracking-wider">
                                Create Your Asset
                            </Text>
                            <Text className="text-xl font-bold mt-4">
                                Turn Your Craft into Digital Success
                            </Text>
                        </div>

                        <Text className="text-xl font-bold max-w-3xl mx-auto text-gray-700 leading-relaxed">
                            Choose how you'd like to share your craft details with us.
                            We'll use AI to enhance your product and create compelling stories.
                        </Text>
                    </div>

                    {/* Input Method Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Form Input Option */}
                        <div
                            className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-x-2 hover:-translate-y-2 cursor-pointer hover:rotate-2"
                            onClick={() => setInputMode('form')}
                        >
                            <div className="text-center">
                                <div className="bg-black text-white p-6 border-4 border-black mx-auto mb-6 w-fit transform rotate-3">
                                    <FileText className="w-12 h-12" />
                                </div>

                                <Text as="h3" className="text-2xl font-black uppercase mb-4">
                                    Fill Form
                                </Text>
                                <Text as="h4" className="text-lg font-bold mb-4 text-gray-700">
                                    फॉर्म भरें
                                </Text>

                                <Text className="font-bold text-gray-800 leading-relaxed mb-6">
                                    Use our structured form to provide details about your craft,
                                    story, and upload images. Perfect for detailed information.
                                </Text>

                                <div className="space-y-2 text-sm font-bold text-gray-700 mb-6">
                                    <div>✓ Step-by-step guidance</div>
                                    <div>✓ Image upload support</div>
                                    <div>✓ Voice input for text fields</div>
                                    <div>✓ Bilingual interface</div>
                                </div>

                                <Button className="bg-black text-white font-bold w-full">
                                    Start Form
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>

                        {/* Audio Input Option */}
                        <div
                            className="bg-green-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-x-2 hover:-translate-y-2 cursor-pointer hover:-rotate-2"
                            onClick={() => setInputMode('audio')}
                        >
                            <div className="text-center">
                                <div className="bg-black text-white p-6 border-4 border-black mx-auto mb-6 w-fit transform -rotate-3">
                                    <Mic className="w-12 h-12" />
                                </div>

                                <Text as="h3" className="text-2xl font-black uppercase mb-4">
                                    Voice Message
                                </Text>
                                <Text as="h4" className="text-lg font-bold mb-4 text-gray-700">
                                    आवाज़ संदेश
                                </Text>

                                <Text className="font-bold text-gray-800 leading-relaxed mb-6">
                                    Simply record an audio message describing your craft.
                                    Our AI will parse it and auto-fill the form for you.
                                </Text>

                                <div className="space-y-2 text-sm font-bold text-gray-700 mb-6">
                                    <div>✓ Natural conversation</div>
                                    <div>✓ AI-powered parsing</div>
                                    <div>✓ Auto-form filling</div>
                                    <div>✓ Hindi & English support</div>
                                </div>

                                <Button className="bg-black text-white font-bold w-full">
                                    Start Recording
                                    <Mic className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Features Preview */}
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                        <Text as="h3" className="text-2xl font-black text-center mb-6 uppercase">
                            What Happens Next?
                        </Text>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="bg-pink-300 border-2 border-black p-4 mb-4 transform rotate-2">
                                    <Sparkles className="w-8 h-8 mx-auto" />
                                </div>
                                <Text className="font-bold">AI Enhancement</Text>
                                <Text className="text-sm text-gray-600">Your images get professionally enhanced</Text>
                            </div>

                            <div className="text-center">
                                <div className="bg-blue-300 border-2 border-black p-4 mb-4 transform -rotate-2">
                                    <FileText className="w-8 h-8 mx-auto" />
                                </div>
                                <Text className="font-bold">Story Generation</Text>
                                <Text className="text-sm text-gray-600">Compelling product stories are created</Text>
                            </div>

                            <div className="text-center">
                                <div className="bg-orange-300 border-2 border-black p-4 mb-4 transform rotate-1">
                                    <ArrowRight className="w-8 h-8 mx-auto" />
                                </div>
                                <Text className="font-bold">Smart Pricing</Text>
                                <Text className="text-sm text-gray-600">AI suggests optimal pricing for your craft</Text>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fdfbf6]">
            {/* Back Button */}
            <div className="p-4">
                <Button
                    variant="outline"
                    className="bg-white"
                    onClick={() => setInputMode(null)}
                >
                    ← Back to Options
                </Button>
            </div>

            {/* Render Selected Input Method */}
            {inputMode === 'form' && <ModernFormPage />}
            {inputMode === 'audio' && <AudioFormPage />}
        </div>
    );
}