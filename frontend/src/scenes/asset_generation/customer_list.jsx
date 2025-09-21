import React, { useState } from 'react';
import { ShoppingCart, Star, ArrowRight, X, Plus, Users } from 'lucide-react';

export  const CustomerList = () => {
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [rejectedCustomers, setRejectedCustomers] = useState([]);

    const customers = [
        {
            id: 1,
            name: "TECHCORP INDUSTRIES",
            type: "ENTERPRISE",
            segments: ["B2B", "SOFTWARE", "FINTECH"],
            score: 92,
            potential: "$125K",
            image: "TC",
            color: "bg-yellow-400",
            description: "FAST-GROWING TECH COMPANY. NEEDS SCALABLE SOLUTIONS. BIG BUDGET, QUICK DECISIONS."
        },
        {
            id: 2,
            name: "URBAN FITNESS CHAIN",
            type: "RETAIL",
            segments: ["B2C", "FITNESS", "LIFESTYLE"],
            score: 88,
            potential: "$45K",
            image: "UF",
            color: "bg-green-400",
            description: "EXPANDING FITNESS BRAND. WANTS DIGITAL TRANSFORMATION. YOUNG DEMOGRAPHIC FOCUS."
        },
        {
            id: 3,
            name: "MIDWEST MANUFACTURING",
            type: "INDUSTRIAL",
            segments: ["B2B", "AUTOMATION", "IOT"],
            score: 85,
            potential: "$89K",
            image: "MM",
            color: "bg-red-400",
            description: "TRADITIONAL MANUFACTURER GOING DIGITAL. STEADY REVENUE. LONG IMPLEMENTATION CYCLES."
        },
        {
            id: 4,
            name: "GREENLEAF CONSULTING",
            type: "SERVICES",
            segments: ["B2B", "CONSULTING", "SUSTAINABILITY"],
            score: 79,
            potential: "$32K",
            image: "GL",
            color: "bg-blue-400",
            description: "BOUTIQUE CONSULTANCY. PREMIUM CLIENTS. VALUES QUALITY OVER QUANTITY."
        }
    ];

    const handleReject = (customerId) => {
        setRejectedCustomers([...rejectedCustomers, customerId]);
    };

    const handleSelect = (customer) => {
        setSelectedCustomer(customer);
    };

    const visibleCustomers = customers.filter(c => !rejectedCustomers.includes(c.id));

    return (
        <div className="min-h-screen bg-black text-white p-8 font-mono">
            {/* Header */}
            <div className="border-4 border-white mb-8 p-6 bg-white text-black">
                <h1 className="text-4xl font-black mb-2">CUSTOMER RECOMMENDATIONS</h1>
                <p className="text-lg font-bold">TARGET YOUR NEXT BIG CLIENT // NO GUESSWORK</p>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="border-4 border-white p-4 bg-yellow-400 text-black">
                    <div className="text-2xl font-black">{visibleCustomers.length}</div>
                    <div className="text-sm font-bold">PROSPECTS</div>
                </div>
                <div className="border-4 border-white p-4 bg-red-400 text-black">
                    <div className="text-2xl font-black">{rejectedCustomers.length}</div>
                    <div className="text-sm font-bold">REJECTED</div>
                </div>
                <div className="border-4 border-white p-4 bg-green-400 text-black">
                    <div className="text-2xl font-black">{selectedCustomer ? 1 : 0}</div>
                    <div className="text-sm font-bold">SELECTED</div>
                </div>
                <div className="border-4 border-white p-4 bg-blue-400 text-black">
                    <div className="text-2xl font-black">
                        ${visibleCustomers.reduce((sum, c) => sum + parseInt(c.potential.replace(/[$K]/g, '')), 0)}K
                    </div>
                    <div className="text-sm font-bold">TOTAL VALUE</div>
                </div>
            </div>

            {/* Selected Customer Display */}
            {selectedCustomer && (
                <div className="border-4 border-green-400 mb-8 bg-green-400 text-black">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-black">TARGET CUSTOMER</h2>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="border-2 border-black p-2 hover:bg-black hover:text-green-400 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className={`w-24 h-24 ${selectedCustomer.color} border-4 border-black flex items-center justify-center mb-4`}>
                                    <span className="text-2xl font-black text-black">{selectedCustomer.image}</span>
                                </div>
                                <h3 className="text-xl font-black mb-2">{selectedCustomer.name}</h3>
                                <p className="font-bold mb-2">{selectedCustomer.type} CLIENT</p>
                                <div className="border-2 border-black p-3 mb-4">
                                    <div className="text-2xl font-black">{selectedCustomer.potential}</div>
                                    <div className="text-sm font-bold">REVENUE POTENTIAL</div>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm font-bold mb-4">{selectedCustomer.description}</p>
                                <div className="flex gap-2 mb-4">
                                    {selectedCustomer.segments.map((segment, index) => (
                                        <span key={index} className="border-2 border-black px-3 py-1 text-xs font-black">
                                            {segment}
                                        </span>
                                    ))}
                                </div>
                                <div className="border-2 border-black p-3 mb-4">
                                    <div className="text-lg font-black">{selectedCustomer.score}/100</div>
                                    <div className="text-xs font-bold">MATCH SCORE</div>
                                </div>
                                <button className="w-full border-4 border-black bg-black text-green-400 p-3 font-black hover:bg-green-400 hover:text-black transition-colors">
                                    START OUTREACH
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Customer Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {visibleCustomers.map((customer) => (
                    <div key={customer.id} className="border-4 border-white bg-white text-black">
                        <div className="p-6">
                            {/* Customer Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-16 h-16 ${customer.color} border-4 border-black flex items-center justify-center`}>
                                    <span className="text-xl font-black text-black">{customer.image}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleReject(customer.id)}
                                        className="border-2 border-black p-2 hover:bg-red-400 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleSelect(customer)}
                                        className="border-2 border-black p-2 hover:bg-green-400 transition-colors"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <h3 className="text-xl font-black mb-1">{customer.name}</h3>
                            <p className="font-bold mb-3">{customer.type} CLIENT</p>

                            <p className="text-sm font-bold mb-4 leading-tight">{customer.description}</p>

                            {/* Segments */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {customer.segments.map((segment, index) => (
                                    <span key={index} className="border-2 border-black px-2 py-1 text-xs font-black">
                                        {segment}
                                    </span>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="border-2 border-black p-2">
                                    <div className="text-lg font-black">{customer.score}</div>
                                    <div className="text-xs font-bold">MATCH SCORE</div>
                                </div>
                                <div className="border-2 border-black p-2">
                                    <div className="text-lg font-black">{customer.potential}</div>
                                    <div className="text-xs font-bold">POTENTIAL</div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <button
                                onClick={() => handleSelect(customer)}
                                className="w-full border-4 border-black bg-black text-white p-3 font-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                TARGET CLIENT
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {visibleCustomers.length === 0 && (
                <div className="border-4 border-white p-12 text-center bg-white text-black">
                    <Users size={48} className="mx-auto mb-4" />
                    <h3 className="text-2xl font-black mb-2">NO MORE PROSPECTS</h3>
                    <p className="font-bold">ALL RECOMMENDATIONS PROCESSED</p>
                </div>
            )}
        </div>
    );
};
