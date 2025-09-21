import React from "react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { motion } from "framer-motion";
import { Upload, Sparkles, TrendingUp, Globe, ArrowRight } from "lucide-react";

export function HowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Upload Your Craft",
            description: "Simply take a photo of your handmade product and upload it to our platform. No professional photography needed!",
            icon: Upload,
            bgColor: "bg-yellow-300",
            borderColor: "border-yellow-600"
        },
        {
            step: "02",
            title: "AI Enhancement Magic",
            description: "Our AI analyzes your craft, enhances the images, generates compelling stories, and suggests optimal pricing.",
            icon: Sparkles,
            bgColor: "bg-pink-300",
            borderColor: "border-pink-600"
        },
        {
            step: "03",
            title: "Smart Optimization",
            description: "Get AI-powered insights on pricing, market trends, and customer preferences to maximize your success.",
            icon: TrendingUp,
            bgColor: "bg-green-300",
            borderColor: "border-green-600"
        },
        {
            step: "04",
            title: "Reach Global Markets",
            description: "Your enhanced products go live on our marketplace, reaching craft lovers worldwide while preserving your heritage.",
            icon: Globe,
            bgColor: "bg-blue-300",
            borderColor: "border-blue-600"
        }
    ];

    return (
        <div className="bg-[#fdfbf6] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(34,197,94,1)] transform -rotate-1 inline-block">
                        <Text as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-wider">
                            How It Works
                        </Text>
                        <Text className="text-xl font-bold mt-2">
                            From Traditional Craft to Digital Success in 4 Simple Steps
                        </Text>
                    </div>
                </motion.div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="relative"
                        >
                            {/* Step Number */}
                            <div className="absolute -top-4 -left-4 z-10">
                                <div className="bg-black text-white w-12 h-12 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-12">
                                    <Text className="font-black text-lg">{step.step}</Text>
                                </div>
                            </div>

                            {/* Step Card */}
                            <div className={`${step.bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1 h-full`}>
                                {/* Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="bg-black text-white p-4 border-2 border-black transform -rotate-6">
                                        <step.icon className="w-8 h-8" />
                                    </div>
                                </div>

                                {/* Content */}
                                <Text as="h3" className="text-xl font-black text-center mb-4 uppercase">
                                    {step.title}
                                </Text>
                                <Text className="font-bold text-gray-800 text-center leading-relaxed">
                                    {step.description}
                                </Text>
                            </div>


                        </motion.div>
                    ))}
                </div>

                {/* Process Flow Visualization */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1"
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <Text className="text-3xl font-black text-white mb-4 uppercase tracking-wider">
                            Ready to Transform Your Craft Business?
                        </Text>
                        <Text className="text-xl font-bold text-white mb-6">
                            Join thousands of artisans already using AI to grow their traditional crafts
                        </Text>
                        <div className="flex justify-center">
                            <Button className="bg-yellow-300 text-black font-black text-lg px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
                                Start Your Journey Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </div>
                    </div>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12"
                >
                    {[
                        { label: "Active Artisans", value: "500+" },
                        { label: "Products Enhanced", value: "2,000+" },
                        { label: "Success Rate", value: "95%" },
                        { label: "Countries Reached", value: "25+" }
                    ].map((stat, index) => (
                        <div key={stat.label} className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-center transform hover:rotate-1 transition-transform">
                            <Text className="text-2xl font-black text-black">{stat.value}</Text>
                            <Text className="font-bold text-gray-700 text-sm">{stat.label}</Text>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}