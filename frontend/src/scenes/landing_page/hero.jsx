import React from "react";
import { Link } from "react-router-dom";

import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button.jsx";
import { ArrowBigRight, Sparkles, Camera, TrendingUp } from "lucide-react";
import sampleImage from "../../assets/image.png";
import Features from "./page_features";
import MovingBand from "@/components/band/moving_band";
import { Faqs } from "./faqs";
import { Testimonials } from "./testimonials";
import { HowItWorks } from "./how_it_works";
import { Logo } from "./icons/logo";
import StarFigure from "@/components/figures/star_figure";
import { Arrow } from "./icons/arrow";
import { Clover } from "./icons/clover";
import { motion } from "framer-motion";
export function LandingPageHero() {
    return (
        <div className="">
            {/* Aesthetic Hindi Text Underlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
                <span
                    className="font-black transform"
                    style={{
                        fontSize: 'clamp(8rem, 20vw, 24rem)', // Really massive text
                        fontFamily: "'Devanagari', 'Noto Sans Devanagari', serif",
                        lineHeight: '0.8',
                        color: 'rgba(0, 0, 0, 0.2)',
                        letterSpacing: '-0.02em',
                        whiteSpace: 'nowrap'
                    }}
                >
                    कलाकृति
                </span>
            </div>
            <div className="relative overflow-hidden flex items-center justify-center min-h-screen bg-[#2979FF] hindi-underlay"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.5)" }}>



                <StarFigure color="#FF6B35" stroke="black" className="absolute top-[44%] left-[43%] w-7 h-7 z-10" />
                <StarFigure color="#D8B4FE" stroke="black" className="absolute top-[42%] left-[44%] w-7 h-7 z-10" />

                <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
                    <div className="space-y-6">
                        <Text className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight" as="h1">
                            Turn Your Local Product <br /> into a{" "}
                            <span className="inline-block bg-green-300 px-2 rotate-[-4deg] border-2 border-black">Masterpiece.</span>
                        </Text>
                        <p className="text-lg text-gray-800">
                            | Watch us take your product from zero to hero.
                        </p>

                        {/* Feature Highlights */}
                        <div className="flex flex-wrap gap-3 my-6">
                            <div className="bg-pink-300 border-2 border-black px-4 py-2 transform rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-2">
                                    <Camera className="w-4 h-4" />
                                    <span className="font-bold text-sm">AI Image Enhancement</span>
                                </div>
                            </div>
                            <div className="bg-green-300 border-2 border-black px-4 py-2 transform -rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="font-bold text-sm">Smart Pricing</span>
                                </div>
                            </div>
                            <div className="bg-blue-300 border-2 border-black px-4 py-2 transform rotate-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-bold text-sm">Story Generation</span>
                                </div>
                            </div>
                        </div>

                        {/* Buttons*/}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/form">
                                <Button className="bg-yellow-300 px-8 py-4 font-black text-lg border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Creating Now
                                    <ArrowBigRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/products">
                                <Button variant="secondary" className="px-8 py-4 font-black text-lg">
                                    Browse Artisan Products
                                </Button>
                            </Link>
                        </div>

                        {/* Users */}
                        <div className="flex items-center gap-3 text-sm font-bold">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 bg-blue-400 border-3 border-black transform rotate-12"></div>
                                <div className="w-8 h-8 bg-green-400 border-3 border-black transform -rotate-12"></div>
                                <div className="w-8 h-8 bg-yellow-400 border-3 border-black transform rotate-6"></div>
                                <div className="w-8 h-8 bg-pink-400 border-3 border-black transform -rotate-6"></div>
                            </div>
                            <span className="text-lg">
                                For a pre-generated <span className="bg-yellow-200 px-2 border-2 border-black font-black">Demo</span> Go to the Products Page
                            </span>
                        </div>
                    </div>

                    <div className="relative scale-75">
                        <div className="absolute inset-0 bg-yellow-200 border-2 border-black transform -rotate-4"></div>

                        <motion.div
                            initial={{ rotate: -3 }}
                            whileHover={{ rotate: 1 }}
                            className="relative w-full h-full"
                        >
                            <div className="border-2 border-black shadow-lg bg-white p-2 inline-block transform rotate-2">
                                <img
                                    src={sampleImage}
                                    alt="Transformed example"
                                    className="rounded-md"
                                />
                                <span className="absolute bottom-2 right-2 bg-yellow-200 border border-black text-xs px-2 py-1">
                                    Instant Results!
                                </span>
                            </div>
                            <Clover
                                color="#0088FF"
                                stroke="black"
                                className="w-10 h-10 absolute top-0.5 right-0 flex flex-col items-center space-y-1"
                            />
                            <Clover
                                color="#FF8800"
                                stroke="black"
                                className="w-10 h-10 absolute bottom-0.5 left-0 flex flex-col items-center "
                            />
                        </motion.div>
                    </div>
                </div>
            </div>

            <MovingBand />
            <Features />
            <HowItWorks />
            <MovingBand flag={1} />
            <Testimonials />
            <Faqs />
            <MovingBand />
        </div>
    );
}