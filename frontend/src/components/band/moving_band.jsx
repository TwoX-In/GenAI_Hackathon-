import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Heart, Star, Zap } from "lucide-react";

export default function MovingBand({ flag = 0 }) {
    const items = [
        { text: "AI Image Enhancement", icon: Sparkles },
        { text: "Smart Pricing", icon: Star },
        { text: "Heritage Stories", icon: Heart },
        { text: "Global Marketplace", icon: Zap },
        { text: "कलाकृति Enhancement", icon: Sparkles },
        { text: "Traditional Crafts", icon: Heart },
        { text: "Digital Success", icon: Star },
        { text: "Artisan Empowerment", icon: Zap }
    ];

    const duplicatedItems = [...items, ...items]; // Duplicate for seamless loop

    return (
        <div className="relative overflow-hidden bg-black border-y-4 border-black py-6">
            {/* Top Band */}
            <motion.div
                className="flex whitespace-nowrap"
                animate={{
                    x: flag === 0 ? [0, -1920] : [-1920, 0],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 20,
                        ease: "linear",
                    },
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <div
                        key={index}
                        className="flex items-center mx-8 bg-yellow-300 border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform"
                    >
                        <item.icon className="w-5 h-5 mr-3 text-black" />
                        <span className="text-xl font-black text-black uppercase tracking-wider">
                            {item.text}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Bottom Band - Opposite Direction */}
            <motion.div
                className="flex whitespace-nowrap mt-4"
                animate={{
                    x: flag === 0 ? [-1920, 0] : [0, -1920],
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 25,
                        ease: "linear",
                    },
                }}
            >
                {duplicatedItems.reverse().map((item, index) => (
                    <div
                        key={`bottom-${index}`}
                        className="flex items-center mx-8 bg-green-300 border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform"
                    >
                        <item.icon className="w-5 h-5 mr-3 text-black" />
                        <span className="text-xl font-black text-black uppercase tracking-wider">
                            {item.text}
                        </span>
                    </div>
                ))}
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-2 left-4 w-4 h-4 bg-pink-400 border-2 border-black transform rotate-45"></div>
            <div className="absolute bottom-2 right-4 w-4 h-4 bg-blue-400 border-2 border-black transform rotate-45"></div>
            <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-orange-400 border-2 border-black transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
        </div>
    );
}