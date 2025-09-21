import React, { useState, useEffect } from "react";
import TranslationBox from "@/components/translation/TranslationBox";

// Coordinate mapping for common Indian states and regions
const LOCATION_COORDINATES = {
    // Indian States
    "uttar pradesh": { lat: 26.8467, lng: 80.9462, name: "Uttar Pradesh, India" },
    "rajasthan": { lat: 27.0238, lng: 74.2179, name: "Rajasthan, India" },
    "gujarat": { lat: 22.2587, lng: 71.1924, name: "Gujarat, India" },
    "maharashtra": { lat: 19.7515, lng: 75.7139, name: "Maharashtra, India" },
    "west bengal": { lat: 22.9868, lng: 87.8550, name: "West Bengal, India" },
    "karnataka": { lat: 15.3173, lng: 75.7139, name: "Karnataka, India" },
    "tamil nadu": { lat: 11.1271, lng: 78.6569, name: "Tamil Nadu, India" },
    "kerala": { lat: 10.8505, lng: 76.2711, name: "Kerala, India" },
    "punjab": { lat: 31.1471, lng: 75.3412, name: "Punjab, India" },
    "haryana": { lat: 29.0588, lng: 76.0856, name: "Haryana, India" },
    "odisha": { lat: 20.9517, lng: 85.0985, name: "Odisha, India" },
    "assam": { lat: 26.2006, lng: 92.9376, name: "Assam, India" },
    "bihar": { lat: 25.0961, lng: 85.3131, name: "Bihar, India" },
    "jharkhand": { lat: 23.6102, lng: 85.2799, name: "Jharkhand, India" },
    "madhya pradesh": { lat: 22.9734, lng: 78.6569, name: "Madhya Pradesh, India" },
    "chhattisgarh": { lat: 21.2787, lng: 81.8661, name: "Chhattisgarh, India" },
    "andhra pradesh": { lat: 15.9129, lng: 79.7400, name: "Andhra Pradesh, India" },
    "telangana": { lat: 18.1124, lng: 79.0193, name: "Telangana, India" },
    "himachal pradesh": { lat: 31.1048, lng: 77.1734, name: "Himachal Pradesh, India" },
    "uttarakhand": { lat: 30.0668, lng: 79.0193, name: "Uttarakhand, India" },
    "goa": { lat: 15.2993, lng: 74.1240, name: "Goa, India" },
    "jammu and kashmir": { lat: 34.0837, lng: 74.7973, name: "Jammu and Kashmir, India" },
    "ladakh": { lat: 34.1526, lng: 77.5771, name: "Ladakh, India" },

    // Cities
    "delhi": { lat: 28.7041, lng: 77.1025, name: "Delhi, India" },
    "mumbai": { lat: 19.0760, lng: 72.8777, name: "Mumbai, India" },
    "kolkata": { lat: 22.5726, lng: 88.3639, name: "Kolkata, India" },
    "chennai": { lat: 13.0827, lng: 80.2707, name: "Chennai, India" },
    "bangalore": { lat: 12.9716, lng: 77.5946, name: "Bangalore, India" },
    "hyderabad": { lat: 17.3850, lng: 78.4867, name: "Hyderabad, India" },
    "pune": { lat: 18.5204, lng: 73.8567, name: "Pune, India" },
    "ahmedabad": { lat: 23.0225, lng: 72.5714, name: "Ahmedabad, India" },
    "jaipur": { lat: 26.9124, lng: 75.7873, name: "Jaipur, India" },
    "lucknow": { lat: 26.8467, lng: 80.9462, name: "Lucknow, India" },
    "kanpur": { lat: 26.4499, lng: 80.3319, name: "Kanpur, India" },
    "varanasi": { lat: 25.3176, lng: 82.9739, name: "Varanasi, India" },
    "agra": { lat: 27.1767, lng: 78.0081, name: "Agra, India" },

    // Countries (fallback)
    "india": { lat: 20.5937, lng: 78.9629, name: "India" },
    "pakistan": { lat: 30.3753, lng: 69.3451, name: "Pakistan" },
    "bangladesh": { lat: 23.6850, lng: 90.3563, name: "Bangladesh" },
    "nepal": { lat: 28.3949, lng: 84.1240, name: "Nepal" },
    "sri lanka": { lat: 7.8731, lng: 80.7718, name: "Sri Lanka" },
    "bhutan": { lat: 27.5142, lng: 90.4336, name: "Bhutan" }
};

export function LocationMap({ locations = [] , locationHistory =""}) {
    const [parsedLocations, setParsedLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        if (locations && locations.length > 0) {
            const parsed = parseLocations(locations);
            setParsedLocations(parsed);
            if (parsed.length > 0) {
                setSelectedLocation(parsed[0]);
            }
        }
    }, [locations]);

    const parseLocations = (locationArray) => {
        const results = [];

        locationArray.forEach(locationString => {
            if (typeof locationString === 'string') {
                // Split by comma and clean up
                const parts = locationString.split(',').map(part => part.trim().toLowerCase());

                // Try to find coordinates for each part
                for (const part of parts) {
                    if (LOCATION_COORDINATES[part]) {
                        results.push({
                            ...LOCATION_COORDINATES[part],
                            original: locationString,
                            matched: part
                        });
                        break; // Use first match
                    }
                }

                // If no match found, try partial matches
                if (results.length === 0) {
                    for (const part of parts) {
                        for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
                            if (key.includes(part) || part.includes(key)) {
                                results.push({
                                    ...coords,
                                    original: locationString,
                                    matched: key
                                });
                                break;
                            }
                        }
                        if (results.length > 0) break;
                    }
                }
            }
        });

        return results;
    };





    // Convert lat/lng to India map SVG coordinates
    const projectToIndiaMap = (lat, lng) => {
        // India bounds: lat 8-37, lng 68-97
        const indiaLatMin = 8, indiaLatMax = 37;
        const indiaLngMin = 68, indiaLngMax = 97;

        // Map to SVG viewBox 0-600 width, 0-700 height
        const x = ((lng - indiaLngMin) / (indiaLngMax - indiaLngMin)) * 600;
        const y = ((indiaLatMax - lat) / (indiaLatMax - indiaLatMin)) * 700;

        return { x: Math.max(0, Math.min(600, x)), y: Math.max(0, Math.min(700, y)) };
    };

    return (
        <div>
            <div className="space-y-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="bg-yellow-400 border-6 border-black p-6  inline-block transform transition-transform duration-300">
                        <h2 className="text-4xl font-black text-black uppercase flex items-center gap-3 tracking-wider">
                            <span className="text-4xl animate-bounce">🗺️</span>
                            ORIGIN LOCATIONS
                        </h2>
                        <p className="text-black font-black mt-2 text-lg uppercase tracking-wide">DISCOVER WHERE THIS ARTISAN CRAFT ORIGINATES!</p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Map Display */}
                    <div className="lg:col-span-2 bg-white border-6 border-black p-6 transform hover:translate-x-1 hover:translate-y-1 transition-transform duration-200">
                        <div className="bg-red-400 border-1 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform  mb-6">
                            <h3 className="text-2xl font-black text-black uppercase tracking-widest flex items-center gap-2">
                                🇮🇳 INDIA MAP
                            </h3>
                        </div>

                        <div className="border-6 border-black bg-white relative overflow-hidden " style={{ height: '500px' }}>
                            {/* India Map Image with Overlay */}
                            <div className="relative w-full h-full">
                                {/* Base India Map Image */}
                                {/* High-Quality India Political Map */}
                                <img
                                    src="/src/assets/Political-Map-of-India_8e40bdc2-07be-4eb6-b604-92881d79a98f.jpg"
                                    alt="Political Map of India"
                                    className="w-full h-full object-contain"
                                    style={{ filter: 'brightness(1.02) contrast(1.05)' }}
                                />

                                {/* Location Markers Overlay */}
                                <div className="absolute inset-0">
                                    {parsedLocations.map((location, index) => {
                                        const { x, y } = projectToIndiaMap(location.lat, location.lng);
                                        return (
                                            <div
                                                key={index}
                                                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                                style={{
                                                    left: `${(x / 600) * 100}%`,
                                                    top: `${(y / 700) * 100}%`
                                                }}
                                                onClick={() => setSelectedLocation(location)}
                                            >
                                                {/* Animated Marker */}
                                                <div className="relative">
                                                    {/* Pulse Ring */}
                                                    <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full opacity-30 animate-ping"></div>

                                                    {/* Main Marker */}
                                                    <div className="relative w-6 h-6 bg-red-500 border-1 border-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                                        <div className="absolute inset-1 bg-red-600 rounded-full"></div>
                                                    </div>

                                                    {/* Location Label */}
                                                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-2 border-1 border-black text-sm font-black whitespace-nowrap uppercase tracking-wide">
                                                        {location.name.split(',')[0]}
                                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-transparent border-t-black"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Major cities */}
                                <g fill="#FF5722" stroke="#000" strokeWidth="1">
                                    <circle cx="200" cy="240" r="3" /> {/* Delhi */}
                                    <circle cx="180" cy="380" r="3" /> {/* Mumbai */}
                                    <circle cx="510" cy="320" r="3" /> {/* Kolkata */}
                                    <circle cx="400" cy="540" r="3" /> {/* Chennai */}
                                    <circle cx="320" cy="480" r="3" /> {/* Bangalore */}
                                </g>

                                {/* Location markers for parsed locations */}
                                {parsedLocations.map((location, index) => {
                                    const { x, y } = projectToIndiaMap(location.lat, location.lng);
                                    // Scale coordinates to SVG viewBox
                                    const svgX = (x / 600) * 800;
                                    const svgY = (y / 700) * 600;

                                    return (
                                        <g key={index}>
                                            {/* Marker circle */}
                                            <circle
                                                cx={svgX}
                                                cy={svgY}
                                                r="12"
                                                fill="#FF1744"
                                                stroke="#000"
                                                strokeWidth="3"
                                                className="cursor-pointer hover:opacity-80 transition-all"
                                                onClick={() => setSelectedLocation(location)}
                                            />
                                            {/* Marker pulse animation */}
                                            <circle
                                                cx={svgX}
                                                cy={svgY}
                                                r="12"
                                                fill="none"
                                                stroke="#FF1744"
                                                strokeWidth="3"
                                                opacity="0.6"
                                            >
                                                <animate
                                                    attributeName="r"
                                                    values="12;24;12"
                                                    dur="2s"
                                                    repeatCount="indefinite"
                                                />
                                                <animate
                                                    attributeName="opacity"
                                                    values="0.6;0;0.6"
                                                    dur="2s"
                                                    repeatCount="indefinite"
                                                />
                                            </circle>
                                            {/* Location label */}
                                            <text
                                                x={svgX}
                                                y={svgY - 20}
                                                textAnchor="middle"
                                                className="text-sm font-bold fill-black"
                                                style={{
                                                    textShadow: '2px 2px 4px white',
                                                    filter: 'drop-shadow(1px 1px 2px rgba(255,255,255,0.8))'
                                                }}
                                            >
                                                {location.name.split(',')[0]}
                                            </text>
                                        </g>
                                    );
                                })}
                            </div>

                            {/* Location Markers Overlay */}
                            <div className="absolute inset-0">
                                {parsedLocations.map((location, index) => {
                                    const { x, y } = projectToIndiaMap(location.lat, location.lng);
                                    return (
                                        <div
                                            key={index}
                                            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                                            style={{
                                                left: `${(x / 600) * 100}%`,
                                                top: `${(y / 700) * 100}%`
                                            }}
                                            onClick={() => setSelectedLocation(location)}
                                        >
                                            {/* Animated Marker */}
                                            <div className="relative">
                                                {/* Pulse Ring */}
                                                <div className="absolute inset-0 w-8 h-8 bg-red-500 rounded-full opacity-30 animate-ping"></div>

                                                {/* Main Marker */}
                                                <div className="relative w-6 h-6 bg-red-500 border-1 border-white rounded-full shadow-lg hover:scale-110 transition-transform">
                                                    <div className="absolute inset-1 bg-red-600 rounded-full"></div>
                                                </div>

                                                {/* Location Label */}
                                                
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Map legend */}
                        {/* <div className="absolute bottom-2 left-2 bg-white border-2 border-black p-2">
                        <div className="flex items-center gap-2 text-xs font-bold">
                            <div className="w-3 h-3 bg-red-500 border border-black rounded-full"></div>
                            <span>Origin Location</span>
                        </div>
                    </div> */}
                    </div>
                </div>

                {/* Location Details */}
                <div className="bg-white border-6 border-black  p-6 transform hover:translate-x-2 hover:translate-y-2 transition-transform duration-200">
                    <div className="bg-purple-400 border-1 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform  mb-6">
                        <h3 className="text-2xl font-black text-black uppercase tracking-widest flex items-center gap-2">
                            📍 LOCATION DETAILS
                        </h3>
                    </div>

                    {parsedLocations.length > 0 ? (
                        <div className="space-y-4">
                            {parsedLocations.map((location, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedLocation(location)}
                                    className={`border-1 p-4 cursor-pointer transition-all duration-200 transform hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${selectedLocation === location
                                        ? 'border-green-600 bg-green-200 shadow-[8px_8px_0px_0px_rgba(34,197,94,1)] '
                                        : 'border-black bg-gray-100 hover:bg-yellow-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl animate-pulse">📍</span>
                                        <div>
                                            <p className="font-black text-lg uppercase tracking-wide">{location.name}</p>
                                            <div className="bg-black text-white px-2 py-1 inline-block mt-2 border-2 border-white">
                                                <p className="text-xs font-bold uppercase">
                                                    ORIGINAL: {location.original}
                                                </p>
                                            </div>
                                            <div className="bg-gray-800 text-green-400 px-2 py-1 inline-block mt-1 border-2 border-green-400 font-mono">
                                                <p className="text-xs font-bold">
                                                    LAT: {location.lat.toFixed(4)} | LNG: {location.lng.toFixed(4)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {selectedLocation && (
                                <div className="border-6 border-green-600 bg-green-200 p-6 mt-6 transform">
                                    <div className="bg-green-600 text-white p-3 border-1 border-black inline-block transform mb-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                        <h4 className="font-black uppercase text-xl tracking-widest">🎯 SELECTED LOCATION</h4>
                                    </div>
                                    <div className="bg-white border-1 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                        <p className="text-2xl font-black uppercase tracking-wide mb-3">{selectedLocation.name}</p>
                                        <div className="bg-yellow-400 border-1 border-black p-4 transform ">
                                            <p className="text-black font-black uppercase text-sm leading-relaxed tracking-wide">
                                                🏛️ THIS ARTISAN CRAFT HAS ITS ROOTS IN THIS CULTURALLY RICH REGION,
                                                KNOWN FOR ITS TRADITIONAL CRAFTSMANSHIP AND ARTISTIC HERITAGE!
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-red-200 border-1 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform ">
                            <span className="text-8xl mb-4 block animate-bounce">🗺️</span>
                            <div className="bg-black text-white p-4 border-1 border-white inline-block transform ">
                                <p className="font-black text-xl uppercase tracking-widest">NO LOCATION DATA!</p>
                            </div>
                            <div className="bg-yellow-400 border-1 border-black p-3 mt-4 inline-block">
                                <p className="text-black font-black uppercase text-sm tracking-wide">
                                    LOCATION INFO WILL APPEAR HERE WHEN AVAILABLE
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            {
                parsedLocations.length > 0 && (
                    <div className="bg-white border-6 border-black p-8 transform hover:translate-x-2 hover:translate-y-2 transition-transform duration-300">
                        <div className="bg-orange-400 border-1 border-black p-6  inline-block transform mb-8">
                            <h3 className="text-3xl font-black text-black uppercase tracking-widest flex items-center gap-3">
                                🏛️ CULTURAL HERITAGE
                            </h3>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            <div className="border-6 border-black p-6 bg-orange-200  transform transition-transform duration-300">
                                <div className="bg-orange-600 text-white p-3 border-1 border-black inline-block transform mb-4 ">
                                    <h4 className="font-black uppercase text-lg tracking-widest">🌟 REGIONAL SIGNIFICANCE</h4>
                                </div>
                                <div className="bg-white border-1 border-black p-4 ">
                                    <p className="text-black font-black uppercase text-sm leading-relaxed tracking-wide">
                                        {locationHistory}
                                    </p>
                                    <TranslationBox text={locationHistory} label="Translate origin note" />
                                </div>
                            </div>

                            <div className="border-6 border-black p-6 bg-purple-200 transform transition-transform duration-300">
                                <div className="bg-purple-600 text-white p-3 border-1 border-black inline-block transform mb-4 ">
                                    <h4 className="font-black uppercase text-lg tracking-widest">🎨 ARTISAN LEGACY</h4>
                                </div>
                                <div className="bg-white border-1 border-black p-4 ">
                                    <p className="text-black font-black uppercase text-sm leading-relaxed tracking-wide">
                                        THE TECHNIQUES AND STYLES FROM THIS REGION HAVE BEEN PASSED DOWN
                                        THROUGH GENERATIONS, PRESERVING ANCIENT ARTISTIC TRADITIONS!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}