import React from "react";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import {motion} from "framer-motion"
import { 
    Linkedin, 
    Mail, 
    GraduationCap, 
    Briefcase, 
    Code, 
    Heart,
    Star,
    Zap,
    Coffee,
    Lightbulb
} from "lucide-react";
import StarFigure from "@/components/figures/star_figure";
import shishirImage from "../../assets/shishir.jpg";
import vihanImage from "../../assets/vihan.jpg";
import vineetImage from "../../assets/vineet.jpg";
import shlokImage from "../../assets/shlok.jpg";

export function Team() {
    const teamMembers = [
        {
            name: "Shishir Shahi",
            role: "Founder & Engineer",
            description: "Passionate about bridging traditional crafts with modern technology. Building AI solutions to empower local artisans and preserve cultural heritage.",
            education: "Student at IIIT Bangalore",
            experience: "Ex-Intern at Wells Fargo",
            linkedin: "https://www.linkedin.com/in/shishir-shahi-3b1a26220/",
            email: "shishir.shahi@iiitb.ac.in",
            bgColor: "bg-yellow-300",
            image: shishirImage,
            skills: ["Full-Stack Development", "AI/ML", "Product Strategy", "Fintech"],
            funFact: "Believes every craft tells a story worth sharing globally"
        },
        {
            name: "Vineet Priyedarshi",
            role: "Founder & Engineer",
            description: "Expert in machine learning and AI systems. Focused on creating intelligent solutions that understand and enhance traditional craftsmanship.",
            education: "Student at IIIT Bangalore",
            experience: "Ex-Intern at Google",
            linkedin: "https://www.linkedin.com/in/vineet-priyedarshi-286969232/",
            email: "vineet.priyedarshi@iiitb.ac.in",
            bgColor: "bg-green-300",
            image: vineetImage,
            skills: ["Machine Learning", "Computer Vision", "NLP", "Google Cloud"],
            funFact: "Can identify craft styles using AI better than most art experts"
        },
        {
            name: "Vihan Vashishth",
            role: "Founder & Engineer",
            description: "Systems architect and backend specialist. Ensures our platform scales beautifully while maintaining the personal touch artisans deserve.",
            education: "Student at IIIT Bangalore",
            experience: "Ex-Intern at Google",
            linkedin: "https://www.linkedin.com/in/vihan-vashishth-769410214/",
            email: "vihan.vashisth@iiitb.ac.in",
            bgColor: "bg-pink-300",
            image: vihanImage,
            skills: ["Backend Systems", "Cloud Architecture", "DevOps", "Scalability"],
            funFact: "Optimizes code like artisans perfect their craft - with patience and precision"
        },
        {
            name: "Shlok Agrawal",
            role: "Angel Investor & Mentor",
            description: "Our guiding force and father figure who believed in our vision from day one. Invested his profits from Agarwal Industries and continues to hedge funds for us through De Shaw & Co.",
            education: "Business Leader & Investor",
            experience: "Agarwal Industries & De Shaw & Co",
            linkedin: "https://www.linkedin.com/in/shlok-agrawal-065398262/",
            email: null, // No email provided for investor
            bgColor: "bg-orange-300",
            image: shlokImage,
            skills: ["Investment Strategy", "Business Development", "Fund Management", "Mentorship"],
            funFact: "Turned his industrial profits into tech investments, believing in the power of AI for artisans"
        }
    ];

    const companyValues = [
        {
            title: "Heritage First",
            description: "We respect and celebrate traditional craftsmanship while enhancing it with modern technology.",
            icon: Heart,
            bgColor: "bg-orange-300"
        },
        {
            title: "AI for Good",
            description: "Our AI solutions empower artisans rather than replace them, amplifying human creativity.",
            icon: Lightbulb,
            bgColor: "bg-blue-300"
        },
        {
            title: "Global Impact",
            description: "Connecting local artisans with worldwide audiences while preserving cultural authenticity.",
            icon: Star,
            bgColor: "bg-purple-300"
        }
    ];

    return (
        <div className="min-h-screen bg-[#fdfbf6] py-16 px-4">
            {/* Decorative Elements */}
            <StarFigure color="#FF6B35" stroke="black" className="absolute top-20 left-10 w-12 h-12 z-10" />
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-8 h-8 z-10" />
            <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-10 h-10 z-10" />

            <div className="max-w-7xl mx-auto">
                {/* Page Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,219,51,1)] transform -rotate-2 inline-block mb-8">
                        <Text as="h1" className="text-5xl md:text-6xl font-black uppercase tracking-wider">
                            Meet The Team
                        </Text>
                        <Text className="text-2xl font-bold mt-4">
                            Passionate Team, One Mission: Empowering Artisans with AI
                        </Text>
                    </div>
                    
                    <Text className="text-xl font-bold max-w-4xl mx-auto text-gray-700 leading-relaxed">
                        We're a passionate team combining technical expertise from IIIT Bangalore with strategic 
                        investment guidance. Together, we believe technology should preserve and celebrate human 
                        creativity, not replace it. Our mission is to help traditional artisans thrive in the 
                        digital age while honoring their heritage.
                    </Text>
                </motion.div>

                {/* Team Members - New Layout */}
                <div className="space-y-16 mb-20">
                    {teamMembers.map((member, index) => (
                        <motion.div
                            key={member.name}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.3 }}
                            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                        >
                            {/* Image Section */}
                            <motion.div 
                                whileHover={{ rotate: index % 2 === 0 ? 2 : -2 }}
                                className={`${member.bgColor} border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 transform hover:-translate-x-2 hover:-translate-y-2 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}
                            >
                                <div className="relative">
                                    {/* Main Photo */}
                                    <div className="w-full h-96 bg-white border-4 border-black p-3 transform rotate-1 hover:rotate-0 transition-transform">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover border-2 border-black"
                                        />
                                    </div>
                                    
                                    {/* Decorative Code Icon */}
                                    <div className="absolute -top-6 -right-6 bg-black text-white w-16 h-16 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center transform rotate-12">
                                        <Code className="w-8 h-8" />
                                    </div>
                                    
                                    {/* Role Badge */}
                                    <div className="absolute -bottom-6 left-6 bg-white border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-3">
                                        <Text className="font-black text-lg uppercase">{member.role.split(' ')[0]}</Text>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Content Section */}
                            <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                                {/* Name & Title */}
                                <div>
                                    <Text as="h3" className="text-4xl md:text-5xl font-black uppercase mb-4 transform -rotate-1">
                                        {member.name}
                                    </Text>
                                    <div className="bg-black text-white px-6 py-3 border-4 border-black inline-block transform rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                        <Text className="font-bold text-lg">{member.role}</Text>
                                    </div>
                                </div>

                                {/* Description */}
                                <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                                    <Text className="font-bold text-gray-800 leading-relaxed text-lg">
                                        {member.description}
                                    </Text>
                                </div>

                                {/* Education & Experience */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="bg-blue-200 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <GraduationCap className="w-5 h-5" />
                                            <Text className="font-black text-sm uppercase">Education</Text>
                                        </div>
                                        <Text className="font-bold text-sm">{member.education}</Text>
                                    </div>
                                    <div className="bg-purple-200 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <Briefcase className="w-5 h-5" />
                                            <Text className="font-black text-sm uppercase">Experience</Text>
                                        </div>
                                        <Text className="font-bold text-sm">{member.experience}</Text>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-gray-100 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <Text className="font-black text-sm mb-3 uppercase">Expertise:</Text>
                                    <div className="flex flex-wrap gap-2">
                                        {member.skills.map((skill, skillIndex) => (
                                            <span 
                                                key={skillIndex}
                                                className="bg-white border-2 border-black px-3 py-1 text-xs font-bold transform rotate-1 hover:rotate-0 transition-transform shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Fun Fact & Contact */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 bg-yellow-200 border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                                        <Text className="font-black text-xs uppercase mb-2">Fun Fact:</Text>
                                        <Text className="font-bold text-sm italic">"{member.funFact}"</Text>
                                    </div>
                                    
                                    {/* Contact Links */}
                                    <div className="flex gap-3">
                                        <a 
                                            href={member.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="bg-blue-600 text-white p-4 border-4 border-black hover:bg-blue-700 transition-colors transform hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        >
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                        {member.email && (
                                            <a 
                                                href={`mailto:${member.email}`}
                                                className="bg-red-500 text-white p-4 border-4 border-black hover:bg-red-600 transition-colors transform hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            >
                                                <Mail className="w-6 h-6" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Company Values */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <div className="bg-purple-500 text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
                            <Text as="h2" className="text-3xl font-black uppercase tracking-wider">
                                Our Values
                            </Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {companyValues.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`${value.bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1`}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-black text-white p-3 border-2 border-black mr-4 transform rotate-6">
                                        <value.icon className="w-6 h-6" />
                                    </div>
                                    <Text as="h3" className="text-xl font-black uppercase">
                                        {value.title}
                                    </Text>
                                </div>
                                <Text className="font-bold text-gray-800 leading-relaxed">
                                    {value.description}
                                </Text>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-yellow-300 via-pink-300 to-blue-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                        <Text className="text-3xl font-black mb-4 uppercase tracking-wider">
                            Want to Join Our Mission?
                        </Text>
                        <Text className="text-xl font-bold mb-6 text-gray-700">
                            We're always looking for passionate people who believe in empowering artisans through technology.
                        </Text>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button className="bg-black text-white font-bold text-lg px-8 py-3">
                                <Coffee className="w-5 h-5 mr-2" />
                                Let's Chat Over Coffee
                            </Button>
                            <Button variant="outline" className="bg-white font-bold text-lg px-8 py-3">
                                <Zap className="w-5 h-5 mr-2" />
                                Collaborate With Us
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}