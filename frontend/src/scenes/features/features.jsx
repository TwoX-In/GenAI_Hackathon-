import React from "react";
import { motion } from "framer-motion";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { 
    Camera, 
    Palette, 
    TrendingUp, 
    FileText, 
    Calendar, 
    Share2,
    Mail,
    Smile,
    Image as ImageIcon,
    BookOpen,
    Zap,
    Search,
    Sparkles,
    ArrowRight,
    Star,
    Heart,
    Globe
} from "lucide-react";
import StarFigure from "@/components/figures/star_figure";
import { Link } from "react-router-dom";

export function Features() {
    const features = [
        {
            title: "Smart Asset Generation",
            description: "Auto-generate product images with improved lighting and presentation using advanced AI algorithms.",
            icon: Camera,
            bgColor: "bg-yellow-300",
            category: "AI Enhancement"
        },
        {
            title: "Custom Model for Art Classification",
            description: "Trained on 50,000+ artwork images to classify and enhance art-based products with precision.",
            icon: Palette,
            bgColor: "bg-pink-300",
            category: "AI Classification"
        },
        {
            title: "Smart Price Recommender",
            description: "AI-powered pricing suggestions trained on ecommerce data to maximize your earnings.",
            icon: TrendingUp,
            bgColor: "bg-green-300",
            category: "Business Intelligence"
        },
        {
            title: "Product Story Generator",
            description: "Automatically write product stories that highlight uniqueness and cultural context.",
            icon: FileText,
            bgColor: "bg-blue-300",
            category: "Content Creation"
        },
        {
            title: "Festival-Aware Inventory Planning",
            description: "Smart recommendations that adapt to upcoming Indian festivals and seasonal demands.",
            icon: Calendar,
            bgColor: "bg-purple-300",
            category: "Smart Planning"
        },
        {
            title: "Direct Social Media Connect",
            description: "Post generated images/videos directly to Facebook, YouTube, X, TikTok, and WhatsApp.",
            icon: Share2,
            bgColor: "bg-orange-300",
            category: "Social Integration"
        },
        {
            title: "Smart Email Bot",
            description: "Send curated emails to preloaded or user-provided mailing lists with personalized content.",
            icon: Mail,
            bgColor: "bg-red-300",
            category: "Marketing Automation"
        },
        {
            title: "AI Meme/Comics Generator",
            description: "Create Gen Z–friendly memes and comics for better product engagement and viral marketing.",
            icon: Smile,
            bgColor: "bg-cyan-300",
            category: "Viral Content"
        },
        {
            title: "Traditional Ad Banners",
            description: "Ready-to-use professional ad banners optimized for different platforms and formats.",
            icon: ImageIcon,
            bgColor: "bg-lime-300",
            category: "Advertising"
        },
        {
            title: "Historical & Contextual Product Data",
            description: "Adds product history and cultural context automatically to enhance storytelling.",
            icon: BookOpen,
            bgColor: "bg-indigo-300",
            category: "Cultural Heritage"
        },
        {
            title: "Powered by Google AI Agent Kit",
            description: "Underlying AI agent framework for all content generation with enterprise-grade reliability.",
            icon: Zap,
            bgColor: "bg-rose-300",
            category: "AI Infrastructure"
        },
        {
            title: "SEO Optimization Built-In",
            description: "All generated assets and text are optimized for search engines to maximize visibility.",
            icon: Search,
            bgColor: "bg-teal-300",
            category: "Digital Marketing"
        }
    ];

    const categories = [...new Set(features.map(f => f.category))];

    const FeatureCard = ({ feature, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ rotate: Math.random() > 0.5 ? 2 : -2 }}
            className={`${feature.bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1 h-full`}
        >
            {/* Category Badge */}
            <div className="bg-black text-white px-3 py-1 border-2 border-black inline-block transform -rotate-2 mb-4">
                <Text className="font-bold text-xs uppercase">{feature.category}</Text>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-4">
                <div className="bg-black text-white p-4 border-4 border-black transform rotate-6 hover:rotate-0 transition-transform">
                    <feature.icon className="w-8 h-8" />
                </div>
            </div>

            {/* Content */}
            <Text as="h3" className="text-xl font-black text-center mb-4 uppercase leading-tight">
                {feature.title}
            </Text>
            <Text className="font-bold text-gray-800 text-center leading-relaxed">
                {feature.description}
            </Text>
        </motion.div>
    );

    const StatCard = ({ number, label, bgColor }) => (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ rotate: Math.random() > 0.5 ? 3 : -3 }}
            className={`${bgColor} border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:scale-105 transition-all`}
        >
            <Text className="text-4xl font-black text-black mb-2">{number}</Text>
            <Text className="font-bold text-gray-800 text-sm uppercase">{label}</Text>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-[#fdfbf6] py-16 px-4">
            {/* Decorative Elements */}
            <StarFigure color="#FF6B35" stroke="black" className="absolute top-20 left-10 w-12 h-12 z-10" />
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-8 h-8 z-10" />
            <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-10 h-10 z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,219,51,1)] transform -rotate-2 inline-block mb-8">
                        <Text as="h1" className="text-5xl md:text-6xl font-black uppercase tracking-wider">
                            Platform Features
                        </Text>
                        <Text className="text-2xl font-bold mt-4">
                            AI-Powered Tools for Artisan Success
                        </Text>
                    </div>
                    
                    <Text className="text-xl font-bold max-w-4xl mx-auto text-gray-700 leading-relaxed">
                        Discover the comprehensive suite of AI-powered features designed to transform 
                        your traditional crafts into digital success stories. From image enhancement 
                        to smart pricing, we've got everything covered.
                    </Text>
                </motion.div>

                {/* Stats Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
                >
                    <StatCard number="12+" label="AI Features" bgColor="bg-yellow-200" />
                    <StatCard number="50K+" label="Training Images" bgColor="bg-green-200" />
                    <StatCard number="5+" label="Social Platforms" bgColor="bg-pink-200" />
                    <StatCard number="100%" label="SEO Optimized" bgColor="bg-blue-200" />
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </div>

                {/* Categories Overview */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-16 transform rotate-1"
                >
                    <Text as="h2" className="text-3xl font-black text-center mb-8 uppercase">
                        Feature Categories
                    </Text>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <div 
                                key={category}
                                className="bg-gray-100 border-2 border-black p-4 text-center transform hover:rotate-1 transition-transform"
                            >
                                <Text className="font-black text-sm uppercase">{category}</Text>
                                <Text className="text-xs text-gray-600 mt-1">
                                    {features.filter(f => f.category === category).length} features
                                </Text>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Integration Showcase */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-16 transform -rotate-1"
                >
                    <div className="text-center text-white">
                        <Text as="h2" className="text-4xl font-black mb-6 uppercase tracking-wider">
                            Powered by Google AI
                        </Text>
                        <Text className="text-xl font-bold mb-8 max-w-3xl mx-auto">
                            Our platform leverages Google's AI Agent Kit and advanced machine learning 
                            models to deliver enterprise-grade AI capabilities specifically designed 
                            for artisan businesses.
                        </Text>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white text-black p-6 border-4 border-black transform rotate-2">
                                <Zap className="w-12 h-12 mx-auto mb-4" />
                                <Text className="font-black text-lg">Lightning Fast</Text>
                                <Text className="font-bold text-sm">Process images in seconds</Text>
                            </div>
                            <div className="bg-white text-black p-6 border-4 border-black transform -rotate-2">
                                <Star className="w-12 h-12 mx-auto mb-4" />
                                <Text className="font-black text-lg">Enterprise Grade</Text>
                                <Text className="font-bold text-sm">99.9% uptime guarantee</Text>
                            </div>
                            <div className="bg-white text-black p-6 border-4 border-black transform rotate-1">
                                <Heart className="w-12 h-12 mx-auto mb-4" />
                                <Text className="font-black text-lg">Artisan Focused</Text>
                                <Text className="font-bold text-sm">Built for traditional crafts</Text>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-yellow-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
                        <Text className="text-3xl font-black mb-4 uppercase tracking-wider">
                            Ready to Experience These Features?
                        </Text>
                        <Text className="text-xl font-bold mb-6 text-gray-700">
                            Start creating amazing assets for your craft business today!
                        </Text>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/form">
                                <Button className="bg-black text-white font-bold text-lg px-8 py-4">
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Start Creating
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/products">
                                <Button variant="outline" className="bg-white font-bold text-lg px-8 py-4">
                                    <Globe className="w-5 h-5 mr-2" />
                                    Browse Products
                                </Button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}