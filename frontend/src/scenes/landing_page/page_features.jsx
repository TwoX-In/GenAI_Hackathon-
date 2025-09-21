import React from "react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { 
    Palette, 
    Camera, 
    TrendingUp, 
    Users, 
    Sparkles, 
    Globe, 
    Heart, 
    Star,
    ArrowRight,
    Zap
} from "lucide-react";
import { motion } from "framer-motion";

function FeatureCard({ title, description, icon: Icon, bgColor, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ rotate: Math.random() > 0.5 ? 2 : -2 }}
            className={`${bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1`}
        >
            <div className="flex items-center mb-4">
                <div className="bg-black text-white p-3 border-2 border-black mr-4 transform rotate-3">
                    <Icon className="w-6 h-6" />
                </div>
                <Text as="h3" className="text-xl font-black uppercase">
                    {title}
                </Text>
            </div>
            <Text className="font-bold text-gray-800 leading-relaxed">
                {description}
            </Text>
        </motion.div>
    );
}

export default function Features() {
    const features = [
        {
            title: "AI Image Enhancement",
            description: "Transform your craft photos into stunning professional images with AI-powered enhancement and multiple angle generation.",
            icon: Camera,
            bgColor: "bg-yellow-300"
        },
        {
            title: "Smart Pricing",
            description: "Get AI-recommended pricing based on your craft style, materials, and market analysis to maximize your earnings.",
            icon: TrendingUp,
            bgColor: "bg-green-300"
        },
        {
            title: "Story Generation",
            description: "Create compelling product stories that connect with customers and showcase the heritage behind your craft.",
            icon: Sparkles,
            bgColor: "bg-pink-300"
        },
        {
            title: "Digital Marketplace",
            description: "Showcase your products in our curated marketplace designed specifically for local artisans and craft lovers.",
            icon: Globe,
            bgColor: "bg-blue-300"
        },
        {
            title: "Customer Insights",
            description: "Understand your audience better with AI-powered analytics and personalized customer recommendations.",
            icon: Users,
            bgColor: "bg-purple-300"
        },
        {
            title: "Heritage Preservation",
            description: "Document and share the rich history and cultural significance of your traditional crafts with the world.",
            icon: Heart,
            bgColor: "bg-orange-300"
        }
    ];

    return (
        <div className="bg-[#fdfbf6] py-16 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,219,51,1)] transform -rotate-2 inline-block mb-8">
                        <Text as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-wider">
                            Empower Your Craft
                        </Text>
                        <Text className="text-xl font-bold mt-2">
                            AI-Powered Tools for Modern Artisans
                        </Text>
                    </div>
                    
                    <Text className="text-xl font-bold max-w-3xl mx-auto text-gray-700">
                        From traditional crafts to digital success - our AI platform helps local artisans 
                        tell their stories, enhance their products, and reach global audiences.
                    </Text>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={feature.title}
                            {...feature}
                            index={index}
                        />
                    ))}
                </div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-yellow-300 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
                        <Text className="text-2xl font-black mb-4">
                            Ready to Transform Your Craft Business?
                        </Text>
                        <Button className="bg-black text-white font-bold text-lg px-8 py-3">
                            <Zap className="w-5 h-5 mr-2" />
                            Start Creating Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
