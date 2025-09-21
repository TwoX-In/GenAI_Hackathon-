import React from "react";
import { Text } from "@/components/retroui/Text";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
    const testimonials = [
        {
            name: "Priya Sharma",
            craft: "Pottery Artist",
            location: "Jaipur, Rajasthan",
            quote: "फनकार.ai transformed my pottery business! The AI pricing helped me value my work properly, and the enhanced photos brought in customers from across India.",
            rating: 5,
            bgColor: "bg-pink-300"
        },
        {
            name: "Ravi Kumar",
            craft: "Textile Weaver",
            location: "Varanasi, UP",
            quote: "The story generation feature beautifully captured the 300-year history of our family weaving tradition. Now customers understand the true value of our handloom sarees.",
            rating: 5,
            bgColor: "bg-blue-300"
        },
        {
            name: "Meera Devi",
            craft: "Jewelry Maker",
            location: "Pushkar, Rajasthan",
            quote: "I was struggling to sell online, but this platform made it so easy! The AI enhanced my jewelry photos and I got my first international order within a week.",
            rating: 5,
            bgColor: "bg-yellow-300"
        }
    ];

    return (
        <div className="bg-gradient-to-br from-green-200 via-blue-200 to-purple-200 py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[12px_12px_0px_0px_rgba(255,105,180,1)] transform rotate-1 inline-block">
                        <Text as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-wider">
                            Artisan Success Stories
                        </Text>
                        <Text className="text-xl font-bold mt-2">
                            Real results from real craftspeople
                        </Text>
                    </div>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.name}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            whileHover={{ rotate: Math.random() > 0.5 ? 2 : -2 }}
                            className={`${testimonial.bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1`}
                        >
                            {/* Quote Icon */}
                            <div className="flex justify-center mb-4">
                                <div className="bg-black text-white p-3 border-2 border-black transform rotate-12">
                                    <Quote className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Quote */}
                            <Text className="font-bold text-gray-800 leading-relaxed mb-6 text-center italic">
                                "{testimonial.quote}"
                            </Text>

                            {/* Rating */}
                            <div className="flex justify-center mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 stroke-black stroke-2" />
                                ))}
                            </div>

                            {/* Author Info */}
                            <div className="text-center">
                                <Text className="font-black text-lg text-black">
                                    {testimonial.name}
                                </Text>
                                <Text className="font-bold text-gray-700">
                                    {testimonial.craft}
                                </Text>
                                <Text className="font-bold text-gray-600 text-sm">
                                    {testimonial.location}
                                </Text>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Stats */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-center mt-16"
                >
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 inline-block">
                        <Text className="text-2xl font-black text-black mb-4">
                            Join 500+ Artisans Already Growing Their Business
                        </Text>
                        <div className="flex justify-center gap-8 text-center">
                            <div>
                                <Text className="text-3xl font-black text-green-600">95%</Text>
                                <Text className="font-bold text-gray-700">Increased Sales</Text>
                            </div>
                            <div>
                                <Text className="text-3xl font-black text-blue-600">3x</Text>
                                <Text className="font-bold text-gray-700">Better Pricing</Text>
                            </div>
                            <div>
                                <Text className="text-3xl font-black text-purple-600">24/7</Text>
                                <Text className="font-bold text-gray-700">AI Support</Text>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}