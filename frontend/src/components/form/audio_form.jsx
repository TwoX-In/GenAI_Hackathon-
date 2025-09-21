import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Mic,
    MicOff,
    Play,
    Pause,
    RotateCcw,
    Upload,
    Sparkles,
    Volume2,
    FileAudio,
    CheckCircle,
    AlertCircle
} from "lucide-react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { ImageUpload } from "./image_upload.jsx/image_upload.jsx";
import StarFigure from "@/components/figures/star_figure";

export function AudioFormPage() {
    const [isRecording, setIsRecording] = useState(false);
    const [audioBlob, setAudioBlob] = useState(null);
    const [audioUrl, setAudioUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [parsedData, setParsedData] = useState(null);
    const [images, setImages] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const mediaRecorderRef = useRef(null);
    const audioRef = useRef(null);
    const timerRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;

            const chunks = [];
            mediaRecorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'audio/wav' });
                setAudioBlob(blob);
                setAudioUrl(URL.createObjectURL(blob));
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
            setRecordingTime(0);

            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(timerRef.current);
        }
    };

    const playAudio = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const resetRecording = () => {
        setAudioBlob(null);
        setAudioUrl(null);
        setIsPlaying(false);
        setRecordingTime(0);
        setParsedData(null);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    };

    const processAudio = async () => {
        if (!audioBlob) return;

        setIsProcessing(true);

        // Simulate AI processing (replace with actual API call)
        setTimeout(() => {
            setParsedData({
                name: "राज कुमार",
                state: "Rajasthan",
                artform: "Blue Pottery",
                market: "International",
                story: "I learned this traditional art from my grandfather. Our family has been making blue pottery for over 100 years in Jaipur.",
                description: "Handcrafted blue pottery vase with traditional Rajasthani patterns, made using natural dyes and traditional firing techniques."
            });
            setIsProcessing(false);
        }, 3000);
    };

    const submitForm = async () => {
        if (!parsedData || !audioBlob) return;

        const formData = new FormData();
        formData.append("artistName", parsedData.name);
        formData.append("state", parsedData.state);
        formData.append("artForm", parsedData.artform);
        formData.append("targetRegion", parsedData.market);
        formData.append("artistDescription", parsedData.story);
        formData.append("productDescription", parsedData.description);
        formData.append("language", "en");
        formData.append("audioFile", audioBlob, "recording.wav");

        if (images && images.length > 0) {
            formData.append("image", images[0]);
        }

        try {
            // Replace with actual API call
            console.log("Submitting audio form data:", parsedData);
            // const response = await Request.postByUrl("/artisan/generateContentFromAudio", formData);
        } catch (error) {
            console.error("Error submitting audio form:", error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#fdfbf6] py-8 px-4">
            {/* Decorative Elements */}
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10" />

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] transform -rotate-1 inline-block">
                        <Text as="h1" className="text-3xl font-black uppercase tracking-wider">
                            Voice Message
                        </Text>
                        <Text className="text-lg font-bold mt-2">
                            आवाज़ संदेश
                        </Text>
                    </div>
                </motion.div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-blue-200 border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8 transform rotate-1"
                >
                    <Text as="h3" className="text-xl font-black mb-4 uppercase">
                        How to Record / रिकॉर्ड कैसे करें
                    </Text>
                    <div className="space-y-2 font-bold text-gray-800">
                        <div>• Tell us your name and which state you're from</div>
                        <div>• Describe your art form and craft</div>
                        <div>• Share your story and inspiration</div>
                        <div>• Describe your product in detail</div>
                        <div>• Mention your target market</div>
                    </div>
                    <Text className="text-sm font-bold text-gray-600 mt-4 italic">
                        You can speak in Hindi, English, or mix both languages!
                    </Text>
                </motion.div>

                {/* Recording Interface */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-8"
                >
                    <div className="text-center">
                        {/* Recording Button */}
                        <div className="mb-8">
                            <button
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isProcessing}
                                className={`w-32 h-32 rounded-full border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:scale-105 ${isRecording
                                    ? 'bg-red-500 animate-pulse'
                                    : 'bg-green-400 hover:bg-green-500'
                                    }`}
                            >
                                {isRecording ? (
                                    <MicOff className="w-16 h-16 text-white mx-auto" />
                                ) : (
                                    <Mic className="w-16 h-16 text-black mx-auto" />
                                )}
                            </button>
                        </div>

                        {/* Recording Status */}
                        <div className="mb-6">
                            {isRecording && (
                                <div className="bg-red-500 text-white px-6 py-3 border-4 border-black inline-block transform -rotate-1">
                                    <Text className="font-black text-lg">
                                        Recording... {formatTime(recordingTime)}
                                    </Text>
                                </div>
                            )}

                            {audioBlob && !isRecording && (
                                <div className="bg-green-400 text-black px-6 py-3 border-4 border-black inline-block transform rotate-1">
                                    <Text className="font-black text-lg">
                                        Recording Complete! {formatTime(recordingTime)}
                                    </Text>
                                </div>
                            )}
                        </div>

                        {/* Audio Controls */}
                        {audioUrl && (
                            <div className="flex justify-center gap-4 mb-6">
                                <Button
                                    onClick={playAudio}
                                    className="bg-blue-400 text-black font-bold"
                                >
                                    {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                                    {isPlaying ? 'Pause' : 'Play'}
                                </Button>

                                <Button
                                    onClick={resetRecording}
                                    variant="outline"
                                    className="bg-white font-bold"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Reset
                                </Button>

                                <Button
                                    onClick={processAudio}
                                    disabled={isProcessing}
                                    className="bg-yellow-400 text-black font-bold"
                                >
                                    {isProcessing ? (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Parse Audio
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}

                        <audio
                            ref={audioRef}
                            src={audioUrl}
                            onEnded={() => setIsPlaying(false)}
                            style={{ display: 'none' }}
                        />
                    </div>
                </motion.div>

                {/* Parsed Data Display */}
                {parsedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transform -rotate-1"
                    >
                        <div className="flex items-center mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600 mr-4" />
                            <Text as="h3" className="text-2xl font-black uppercase">
                                Parsed Information / पार्स की गई जानकारी
                            </Text>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div className="bg-white border-2 border-black p-4">
                                    <Text className="font-black text-sm uppercase mb-2">Name / नाम:</Text>
                                    <Text className="font-bold">{parsedData.name}</Text>
                                </div>
                                <div className="bg-white border-2 border-black p-4">
                                    <Text className="font-black text-sm uppercase mb-2">State / राज्य:</Text>
                                    <Text className="font-bold">{parsedData.state}</Text>
                                </div>
                                <div className="bg-white border-2 border-black p-4">
                                    <Text className="font-black text-sm uppercase mb-2">Art Form / कला रूप:</Text>
                                    <Text className="font-bold">{parsedData.artform}</Text>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="bg-white border-2 border-black p-4">
                                    <Text className="font-black text-sm uppercase mb-2">Target Market / लक्षित बाज़ार:</Text>
                                    <Text className="font-bold">{parsedData.market}</Text>
                                </div>
                                <div className="bg-white border-2 border-black p-4">
                                    <Text className="font-black text-sm uppercase mb-2">Story / कहानी:</Text>
                                    <Text className="font-bold text-sm">{parsedData.story}</Text>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="bg-white border-2 border-black p-4">
                                <Text className="font-black text-sm uppercase mb-2">Product Description / उत्पाद विवरण:</Text>
                                <Text className="font-bold text-sm">{parsedData.description}</Text>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Image Upload */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-pink-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transform rotate-1"
                >
                    <div className="flex items-center mb-6">
                        <Upload className="w-8 h-8 mr-4" />
                        <div>
                            <Text as="h3" className="text-2xl font-black uppercase">Product Images</Text>
                            <Text className="text-lg font-bold text-gray-600">उत्पाद चित्र</Text>
                        </div>
                    </div>

                    <ImageUpload
                        images={images}
                        setImages={setImages}
                        isDragging={isDragging}
                        setIsDragging={setIsDragging}
                        inputRef={inputRef}
                    />
                </motion.div>

                {/* Submit Button */}
                {parsedData && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <Button
                            onClick={submitForm}
                            className="bg-black text-white font-black text-xl px-12 py-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all"
                        >
                            <Sparkles className="w-6 h-6 mr-3" />
                            Create Asset / संपत्ति बनाएं
                        </Button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}