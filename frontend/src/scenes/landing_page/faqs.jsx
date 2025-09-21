import React from "react";
import { Accordion } from "@/components/retroui/Accordion";
import { Text } from "@/components/retroui/Text";
import { motion } from "framer-motion";
import StarFigure from "@/components/figures/star_figure";

export function Faqs() {
    const faqs = [
        {
            question: "How does the AI image enhancement work?",
            answer: "Our AI analyzes your craft photos and automatically enhances lighting, colors, and composition. It can also generate multiple angles and create professional product shots from a single image, helping your crafts look their absolute best online."
        },
        {
            question: "Is the platform suitable for traditional artisans?",
            answer: "Absolutely! फनकार.ai is specifically designed for local artisans working with traditional crafts like pottery, textiles, jewelry, woodwork, and more. We understand the unique needs of heritage crafts and provide tools that respect and celebrate traditional techniques."
        },
        {
            question: "How does the AI pricing recommendation work?",
            answer: "Our AI analyzes factors like your craft type, materials used, time investment, local market conditions, and similar products to suggest optimal pricing. This helps ensure you're fairly compensated while remaining competitive in the market."
        },
        {
            question: "Can I sell my products directly through the platform?",
            answer: "Yes! Our integrated marketplace allows you to showcase and sell your crafts directly to customers. We handle the digital storefront while you focus on creating beautiful, authentic pieces."
        },
        {
            question: "What kind of stories does the AI generate?",
            answer: "The AI creates compelling narratives about your craft's history, cultural significance, creation process, and personal journey as an artisan. These stories help customers connect emotionally with your work and understand its true value."
        },
        {
            question: "Do I need technical skills to use the platform?",
            answer: "Not at all! फनकार.ai is designed to be user-friendly for artisans of all technical backgrounds. Simply upload your photos, provide basic information about your craft, and our AI handles the rest. We also provide support in multiple languages."
        }
    ];

    return (
        <div className="relative bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 py-16 px-4 overflow-hidden">
            {/* Decorative Elements */}
            <StarFigure color="#FFD93D" stroke="black" className="absolute top-10 left-10 w-12 h-12 z-10" />
            <StarFigure color="#A8E6CF" stroke="black" className="absolute top-20 right-20 w-8 h-8 z-10" />
            <StarFigure color="#FF6B6B" stroke="black" className="absolute bottom-20 left-20 w-10 h-10 z-10" />
            <StarFigure color="#4ECDC4" stroke="black" className="absolute bottom-10 right-10 w-14 h-14 z-10" />

            <div className="max-w-4xl mx-auto relative z-20">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-2 inline-block">
                        <Text as="h2" className="text-4xl md:text-5xl font-black uppercase tracking-wider text-black">
                            Got Questions?
                        </Text>
                        <Text className="text-xl font-bold mt-2 text-gray-700">
                            We've got answers for artisans like you!
                        </Text>
                    </div>
                </motion.div>

                {/* FAQ Accordion */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Accordion type="single" collapsible className="space-y-4 w-full">
                        {faqs.map((faq, index) => (
                            <Accordion.Item 
                                key={index} 
                                value={`item-${index}`}
                                className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1"
                            >
                                <Accordion.Header className="text-left font-black text-lg px-6 py-4 hover:bg-yellow-100 transition-colors">
                                    {faq.question}
                                </Accordion.Header>
                                <Accordion.Content className="px-6 py-4 bg-gray-50 border-t-2 border-black">
                                    <Text className="font-bold text-gray-700 leading-relaxed">
                                        {faq.answer}
                                    </Text>
                                </Accordion.Content>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <div className="bg-yellow-300 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 inline-block">
                        <Text className="text-xl font-black text-black">
                            Still have questions? We're here to help! 
                        </Text>
                        <Text className="text-lg font-bold text-gray-700 mt-2">
                            Contact our artisan support team anytime.
                        </Text>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}