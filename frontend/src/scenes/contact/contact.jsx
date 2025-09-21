import React, { useState } from "react";
import { motion } from "framer-motion";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input";
import { Textarea } from "@/components/ui/textarea";
import { 
    Mail, 
    Linkedin, 
    MapPin, 
    Phone, 
    Send, 
    MessageCircle,
    Coffee,
    Heart,
    Star,
    Sparkles,
    Users,
    Clock
} from "lucide-react";
import StarFigure from "@/components/figures/star_figure";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const teamContacts = [
        {
            name: "Shishir Shahi",
            role: "Founder & Lead Developer",
            email: "shishir.shahi@iiitb.ac.in",
            linkedin: "https://www.linkedin.com/in/shishir-shahi-3b1a26220/",
            bgColor: "bg-yellow-300",
            expertise: "Full-Stack Development, AI/ML, Product Strategy"
        },
        {
            name: "Vineet Priyedarshi",
            role: "AI Engineer & Co-Founder",
            email: "vineet.priyedarshi@iiitb.ac.in",
            linkedin: "https://www.linkedin.com/in/vineet-priyedarshi-286969232/",
            bgColor: "bg-green-300",
            expertise: "Machine Learning, Computer Vision, NLP"
        },
        {
            name: "Vihan Vashishth",
            role: "Tech Lead & Co-Founder",
            email: "vihan.vashisth@iiitb.ac.in",
            linkedin: "https://www.linkedin.com/in/vihan-vashishth-769410214/",
            bgColor: "bg-pink-300",
            expertise: "Backend Systems, Cloud Architecture, DevOps"
        }
    ];

    const contactReasons = [
        {
            title: "Partnership Opportunities",
            description: "Interested in collaborating or partnering with us?",
            icon: Users,
            bgColor: "bg-blue-200"
        },
        {
            title: "Technical Support",
            description: "Need help with our platform or have technical questions?",
            icon: MessageCircle,
            bgColor: "bg-purple-200"
        },
        {
            title: "Business Inquiries",
            description: "Want to discuss business opportunities or investments?",
            icon: Coffee,
            bgColor: "bg-orange-200"
        },
        {
            title: "Media & Press",
            description: "Press inquiries or media coverage requests?",
            icon: Star,
            bgColor: "bg-red-200"
        }
    ];

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            console.log("Contact form submitted:", formData);
            setIsSubmitting(false);
            setFormData({ name: "", email: "", subject: "", message: "" });
            // Show success message
        }, 2000);
    };

    const ContactCard = ({ contact, index }) => (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            whileHover={{ rotate: Math.random() > 0.5 ? 2 : -2 }}
            className={`${contact.bgColor} border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 transform hover:-translate-x-1 hover:-translate-y-1`}
        >
            <div className="text-center mb-6">
                <Text as="h3" className="text-xl font-black uppercase mb-2">
                    {contact.name}
                </Text>
                <div className="bg-black text-white px-4 py-2 border-2 border-black inline-block transform -rotate-1">
                    <Text className="font-bold text-sm">{contact.role}</Text>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div className="bg-white border-2 border-black p-3">
                    <Text className="font-black text-xs uppercase mb-1">Expertise:</Text>
                    <Text className="font-bold text-sm">{contact.expertise}</Text>
                </div>
            </div>

            <div className="flex gap-3 justify-center">
                <a 
                    href={`mailto:${contact.email}`}
                    className="bg-red-500 text-white p-3 border-4 border-black hover:bg-red-600 transition-colors transform hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Mail className="w-5 h-5" />
                </a>
                <a 
                    href={contact.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white p-3 border-4 border-black hover:bg-blue-700 transition-colors transform hover:scale-110 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Linkedin className="w-5 h-5" />
                </a>
            </div>

            <div className="mt-4 text-center">
                <Text className="font-bold text-xs text-gray-600">{contact.email}</Text>
            </div>
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
                            Get In Touch
                        </Text>
                        <Text className="text-2xl font-bold mt-4">
                            Let's Build Something Amazing Together
                        </Text>
                    </div>
                    
                    <Text className="text-xl font-bold max-w-4xl mx-auto text-gray-700 leading-relaxed">
                        Have questions about our platform? Want to collaborate? Or just want to say hi? 
                        We'd love to hear from you! Reach out to our team directly or send us a message.
                    </Text>
                </motion.div>

                {/* Contact Reasons */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {contactReasons.map((reason, index) => (
                        <motion.div
                            key={reason.title}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${reason.bgColor} border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center transform hover:rotate-1 transition-transform`}
                        >
                            <reason.icon className="w-8 h-8 mx-auto mb-3" />
                            <Text className="font-black text-sm uppercase mb-2">{reason.title}</Text>
                            <Text className="font-bold text-xs text-gray-700">{reason.description}</Text>
                        </motion.div>
                    ))}
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Contact Form */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1"
                    >
                        <div className="flex items-center mb-6">
                            <div className="bg-black text-white p-3 border-2 border-black mr-4 transform rotate-3">
                                <Send className="w-6 h-6" />
                            </div>
                            <Text as="h2" className="text-2xl font-black uppercase">Send Us a Message</Text>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-black text-sm uppercase mb-2">Name</label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Your name"
                                        className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block font-black text-sm uppercase mb-2">Email</label>
                                    <Input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your.email@example.com"
                                        className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-black text-sm uppercase mb-2">Subject</label>
                                <Input
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="What's this about?"
                                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-black text-sm uppercase mb-2">Message</label>
                                <Textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Tell us more about your inquiry..."
                                    className="w-full border-4 border-black p-3 font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                    rows={5}
                                    required
                                />
                            </div>

                            <Button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-black text-white font-black text-lg py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(255,219,51,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5 mr-2" />
                                        Send Message
                                    </>
                                )}
                            </Button>
                        </form>
                    </motion.div>

                    {/* Quick Info */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-8"
                    >
                        {/* Location */}
                        <div className="bg-blue-200 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                            <div className="flex items-center mb-4">
                                <MapPin className="w-6 h-6 mr-3" />
                                <Text className="font-black text-lg uppercase">Our Location</Text>
                            </div>
                            <Text className="font-bold text-gray-800">
                                IIIT Bangalore<br />
                                Electronic City, Bangalore<br />
                                Karnataka, India
                            </Text>
                        </div>

                        {/* Response Time */}
                        <div className="bg-green-200 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                            <div className="flex items-center mb-4">
                                <Clock className="w-6 h-6 mr-3" />
                                <Text className="font-black text-lg uppercase">Response Time</Text>
                            </div>
                            <Text className="font-bold text-gray-800">
                                We typically respond within 24 hours during weekdays. 
                                For urgent matters, reach out to us directly on LinkedIn!
                            </Text>
                        </div>

                        {/* General Email */}
                        <div className="bg-yellow-200 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                            <div className="flex items-center mb-4">
                                <Mail className="w-6 h-6 mr-3" />
                                <Text className="font-black text-lg uppercase">General Inquiries</Text>
                            </div>
                            <Text className="font-bold text-gray-800">
                                For general questions, you can reach any of our team members below, 
                                or use the contact form to send us a message.
                            </Text>
                        </div>
                    </motion.div>
                </div>

                {/* Team Contact Cards */}
                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mb-16"
                >
                    <div className="text-center mb-12">
                        <div className="bg-purple-500 text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 inline-block">
                            <Text as="h2" className="text-3xl font-black uppercase tracking-wider">
                                Meet Our Team
                            </Text>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {teamContacts.map((contact, index) => (
                            <ContactCard key={contact.name} contact={contact} index={index} />
                        ))}
                    </div>
                </motion.div>

                {/* Call to Action */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="bg-gradient-to-r from-pink-300 via-purple-300 to-blue-300 border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                        <Text className="text-3xl font-black mb-4 uppercase tracking-wider">
                            Let's Create Something Amazing!
                        </Text>
                        <Text className="text-xl font-bold mb-6 text-gray-700">
                            Whether you're an artisan looking to digitize your craft or a partner interested in collaboration, 
                            we're excited to hear from you.
                        </Text>
                        <div className="flex justify-center">
                            <Heart className="w-12 h-12 text-red-500 animate-pulse" />
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}