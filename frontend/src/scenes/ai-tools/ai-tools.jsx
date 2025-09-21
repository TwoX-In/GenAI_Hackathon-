import React, { useState } from 'react';
import { 
    BookOpen, 
    Download, 
    Copy, 
    Check, 
    Upload, 
    Wand2, 
    Sparkles, 
    Youtube, 
    Play, 
    Megaphone, 
    Globe, 
    Camera,
    Palette,
    Tag,
    DollarSign,
    MapPin,
    Brush,
    Mail
} from 'lucide-react';
import { Button } from '@/components/retroui/Button';
import { Request } from '@/request/request';
import StarFigure from '@/components/figures/star_figure';
import EmailPreview from '@/components/email/EmailPreview';

const AITools = () => {
    const [activeTab, setActiveTab] = useState('comics');
    const [uid, setUid] = useState('');
    const [image, setImage] = useState(null);
    const [result, setResult] = useState('');
    const [emailImages, setEmailImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    const tabs = [
        { 
            id: 'comics', 
            name: 'Comics / कॉमिक्स', 
            icon: BookOpen, 
            color: 'lavender' 
        },
        { 
            id: 'youtube', 
            name: 'YouTube Thumbnails / यूट्यूब थंबनेल', 
            icon: Youtube, 
            color: 'rose' 
        },
        { 
            id: 'adbanners', 
            name: 'Ad Banners / विज्ञापन बैनर', 
            icon: Megaphone, 
            color: 'mint' 
        },
        { 
            id: 'emails', 
            name: 'Email Marketing / ईमेल मार्केटिंग', 
            icon: Mail, 
            color: 'peach' 
        },
        { 
            id: 'classifier', 
            name: 'Image Analysis / छवि विश्लेषण', 
            icon: Camera, 
            color: 'sky' 
        }
    ];

    const getTabColorClasses = (color, isActive = false) => {
        const colors = {
            lavender: isActive ? 'bg-purple-200 text-purple-800' : 'bg-purple-100 hover:bg-purple-150',
            rose: isActive ? 'bg-pink-200 text-pink-800' : 'bg-pink-100 hover:bg-pink-150',
            mint: isActive ? 'bg-green-200 text-green-800' : 'bg-green-100 hover:bg-green-150',
            peach: isActive ? 'bg-orange-200 text-orange-800' : 'bg-orange-100 hover:bg-orange-150',
            sky: isActive ? 'bg-blue-200 text-blue-800' : 'bg-blue-100 hover:bg-blue-150'
        };
        return colors[color] || colors.lavender;
    };

    const resetForm = () => {
        setUid('');
        setImage(null);
        setResult(null);
        setEmailImages([]);
        setError(null);
        setCopied(false);
    };

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        resetForm();
    };

    const generateContent = async () => {
        if (activeTab === 'classifier') {
            if (!image) {
                setError('Please select an image to analyze');
                return;
            }
        } else {
            if (!uid.trim()) {
                setError('Please enter a valid UID');
                return;
            }
        }

        try {
            setLoading(true);
            setError(null);
            
            let response;
            const apiEndpoints = {
                comics: '/social_media/comics',
                youtube: '/social_media/youtube/thumbnail-nanobananas-maker',
                adbanners: '/social_media/ad-banner-maker',
                emails: `/social_media/generate-email/${uid}`
            };

            if (activeTab === 'classifier') {
                const formData = new FormData();
                formData.append('image', image);
                console.log("image form, ", image)
                response = await Request.postByUrl('/classifier/trial_classify',formData, true);
            } else if (activeTab === 'emails') {
                response = await Request.postByUrl(apiEndpoints[activeTab]);
                // Fetch images separately to avoid header size issues
                try {
                    const imagesResponse = await Request.get(`/social_media/get-email-images/${uid}`);
                    setEmailImages(imagesResponse.images || []);
                } catch (imgError) {
                    console.log("Could not fetch images:", imgError);
                    setEmailImages([]);
                }
            } else {
                response = await Request.post(apiEndpoints[activeTab], {
                    uid: parseInt(uid)
                });
            }

            if (activeTab === 'classifier') {
                setResult(response);
            } else if (activeTab === 'emails') {
                console.log("Email response:", response);
                console.log("Response type:", typeof response);
                console.log("Response length:", response?.length);
                setResult(response);
            } else {
                // Handle image response
                
                if (response instanceof Blob) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64 = reader.result.split(',')[1];
                        setResult(base64);
                    };
                    reader.readAsDataURL(response);
                } else if (typeof response === 'string') {
                    setResult(response);
                }
                
            }
            
        } catch (err) {
            console.error('Error generating content:', err);
            setError(`Failed to ${activeTab === 'classifier' ? 'analyze image' : 'generate content'}. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    const downloadResult = () => {
        if (!result || activeTab === 'classifier') return;
        
        const link = document.createElement('a');
        link.href = `data:image/png;base64,${result}`;
        link.download = `${activeTab}_${uid || 'result'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = async () => {
        if (!result) return;
        
        try {
            if (activeTab === 'classifier') {
                await navigator.clipboard.writeText(JSON.stringify(result, null, 2));
            } else {
                const response = await fetch(`data:image/png;base64,${result}`);
                const blob = await response.blob();
                
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': blob
                    })
                ]);
            }
            
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setError(null);
        }
    };

    const renderClassifierResults = () => {
        if (!result || activeTab !== 'classifier') return null;

        const resultItems = [
            { key: 'style', label: 'Art Style', icon: Brush, value: result.style },
            { key: 'artist', label: 'Artist', icon: Palette, value: result.artist },
            { key: 'medium', label: 'Medium', icon: Tag, value: result.medium },
            { key: 'origin', label: 'Origin', icon: MapPin, value: result.origin },
            { key: 'price', label: 'Estimated Price', icon: DollarSign, value: result.price ? `₹${result.price}` : 'N/A' },
            { key: 'themes', label: 'Themes', icon: Sparkles, value: result.themes },
            { key: 'color', label: 'Colors', icon: Palette, value: result.color }
        ];

        return (
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8">
                <div className="text-center mb-8">
                    <div className="bg-yellow-300 text-black p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
                        <h3 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <Camera className="w-8 h-8" />
                            ANALYSIS RESULTS / विश्लेषण परिणाम
                        </h3>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {resultItems.map((item) => (
                        <div key={item.key} className="bg-yellow-100 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 transform hover:-rotate-1 transition-all">
                            <div className="flex items-center mb-4">
                                <div className="bg-yellow-300 text-black p-2 mr-3 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <h4 className="font-black text-lg uppercase tracking-wider">{item.label}</h4>
                            </div>
                            <div className="bg-white border-4 border-black p-3 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <p className="font-black text-lg">
                                    {item.value || 'Not detected / पता नहीं चला'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-8">
                    <Button
                        onClick={copyToClipboard}
                        className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black text-lg px-8 py-4 flex items-center gap-3 transform hover:-rotate-1 ${
                            copied ? 'bg-green-300' : 'bg-yellow-300 hover:bg-yellow-400'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                COPIED JSON! / कॉपी किया गया!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                COPY RESULTS / परिणाम कॉपी करें
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    const renderEmailResult = () => {
        if (!result || activeTab !== 'emails') return null;

        console.log("renderEmailResult called with result:", result);
        console.log("Active tab:", activeTab);

        // The generate-email endpoint returns raw HTML string, not structured response
        const emailHtml = typeof result === 'string' ? result : result.email_html;
        console.log("Extracted emailHtml:", emailHtml?.substring(0, 100) + "...");

        return (
            <EmailPreview 
                emailHtml={emailHtml} 
                uid={uid}
                images={emailImages}
            />
        );
    };

    const renderImageResult = () => {
        if (!result || activeTab === 'classifier' || activeTab === 'emails') return null;

        const tabConfig = {
            comics: { 
                title: 'YOUR COMIC IS READY! / आपकी कॉमिक तैयार है!', 
                bgColor: 'bg-pink-300',
                borderColor: 'border-black',
                shadowColor: 'rgba(0,0,0,1)',
                icon: BookOpen 
            },
            youtube: { 
                title: 'YOUR THUMBNAIL IS READY! / आपका थंबनेल तैयार है!', 
                bgColor: 'bg-orange-300',
                borderColor: 'border-black',
                shadowColor: 'rgba(0,0,0,1)',
                icon: Youtube,
                aspectRatio: '16/9'
            },
            adbanners: { 
                title: 'YOUR AD BANNER IS READY! / आपका विज्ञापन बैनर तैयार है!', 
                bgColor: 'bg-blue-300',
                borderColor: 'border-black',
                shadowColor: 'rgba(0,0,0,1)',
                icon: Megaphone 
            }
        };

        const config = tabConfig[activeTab];

        return (
            <div className={`${config.bgColor} border-4 ${config.borderColor} shadow-[8px_8px_0px_0px_${config.shadowColor}] p-8`}>
                <div className="text-center mb-8">
                    <div className={`bg-white text-black p-4 border-4 ${config.borderColor} shadow-[4px_4px_0px_0px_${config.shadowColor}] inline-block transform -rotate-1`}>
                        <h3 className="text-2xl font-black uppercase tracking-wider flex items-center gap-3">
                            <config.icon className="w-8 h-8" />
                            {config.title}
                        </h3>
                    </div>
                </div>

                <div className="bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8 p-4">
                    <div className="relative">
                        <img
                            src={`data:image/png;base64,${result}`}
                            alt={`Generated ${activeTab}`}
                            className="w-full h-auto border-4 border-black"
                            style={config.aspectRatio ? { aspectRatio: config.aspectRatio } : {}}
                        />
                        {activeTab === 'youtube' && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="bg-red-500 border-2 border-white rounded-full p-4 shadow-lg opacity-80">
                                    <Play className="w-12 h-12 text-white ml-1" fill="white" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 justify-center">
                    <Button
                        onClick={downloadResult}
                        className="bg-green-300 hover:bg-green-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black text-lg px-8 py-4 flex items-center gap-3 transform hover:-rotate-1"
                    >
                        <Download className="w-5 h-5" />
                        DOWNLOAD / डाउनलोड
                    </Button>
                    
                    <Button
                        onClick={copyToClipboard}
                        className={`border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black text-lg px-8 py-4 flex items-center gap-3 transform hover:-rotate-1 ${
                            copied ? 'bg-yellow-300' : 'bg-white hover:bg-yellow-100'
                        }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-5 h-5" />
                                COPIED! / कॉपी किया गया!
                            </>
                        ) : (
                            <>
                                <Copy className="w-5 h-5" />
                                COPY / कॉपी
                            </>
                        )}
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-[#fdfbf6] relative overflow-hidden">
            {/* Decorative Elements */}
            <StarFigure color="#FF6B35" stroke="black" className="absolute top-20 left-10 w-8 h-8 z-10" />
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10" />
            <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-7 h-7 z-10" />
            <StarFigure color="#FED7AA" stroke="black" className="absolute bottom-20 right-32 w-6 h-6 z-10" />

            <div className="w-full px-4 py-12 relative z-20 min-h-screen">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="bg-black text-white p-8 border-4 border-black shadow-[16px_16px_0px_0px_rgba(255,219,51,1)] transform -rotate-2 inline-block mb-8">
                        <div className="flex items-center justify-center gap-2 sm:gap-4 mb-4">
                            <Wand2 className="w-8 h-8 sm:w-12 sm:h-12 text-yellow-300 animate-pulse" />
                            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-300 animate-bounce" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-black uppercase tracking-wider">
                            AI TOOLS / एआई उपकरण
                        </h1>
                        <p className="text-lg sm:text-xl font-bold mt-4">
                            Powerful AI tools for your artisan business! / आपके कारीगर व्यवसाय के लिए शक्तिशाली एआई उपकरण!
                        </p>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="w-full mb-12">
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 mx-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => handleTabChange(tab.id)}
                                        className={`${isActive ? 'bg-yellow-300 text-black' : 'bg-white text-black hover:bg-yellow-100'} border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all p-4 font-bold text-xs sm:text-sm lg:text-base tracking-wide min-h-[120px] flex flex-col items-center justify-center transform hover:-rotate-1`}
                                    >
                                        <Icon className="w-6 h-6 mb-2 flex-shrink-0" />
                                        <span className="text-center leading-tight font-black uppercase">{tab.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Input Section */}
                <div className="w-full mb-12">
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 mx-4 max-w-4xl mx-auto">
                        <div className="flex items-center mb-6">
                            <div className="bg-yellow-300 text-black p-3 mr-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <Upload className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-wider">
                                {activeTab === 'classifier' ? 'UPLOAD IMAGE / छवि अपलोड करें' : 'ENTER PRODUCT UID / उत्पाद यूआईडी दर्ज करें'}
                            </h2>
                        </div>
                        
                        <div className="space-y-6">
                            {activeTab === 'classifier' ? (
                                <div>
                                    <label className="block text-lg font-black mb-3 uppercase tracking-wide">
                                        Select Image: / छवि चुनें:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white"
                                    />
                                    {image && (
                                        <div className="mt-4 p-4 bg-green-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                            <p className="font-black text-black">Selected: {image.name} / चयनित: {image.name}</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-lg font-black mb-3 uppercase tracking-wide">
                                        Product UID: / उत्पाद यूआईडी:
                                    </label>
                                    <input
                                        type="text"
                                        value={uid}
                                        onChange={(e) => setUid(e.target.value)}
                                        placeholder="Enter your product UID here... / अपना उत्पाद यूआईडी यहाँ दर्ज करें..."
                                        className="w-full p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white"
                                    />
                                </div>
                            )}
                            
                            {error && (
                                <div className="bg-red-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 text-black font-black text-center">
                                    {error}
                                </div>
                            )}
                            
                            <Button
                                onClick={generateContent}
                                disabled={loading || (activeTab === 'classifier' ? !image : !uid.trim())}
                                className="w-full bg-yellow-300 hover:bg-yellow-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] text-black font-black text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 transform hover:-rotate-1"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-6 h-6 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                                        {activeTab === 'classifier' ? 'ANALYZING... / विश्लेषण...' : 'GENERATING... / उत्पादन...'}
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-6 h-6" />
                                        {activeTab === 'classifier' ? 'ANALYZE IMAGE / छवि का विश्लेषण करें' : `GENERATE ${tabs.find(t => t.id === activeTab)?.name.split(' / ')[0].toUpperCase()} / उत्पादन करें`}
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div className="w-full px-4">
                    <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 max-h-[80vh] overflow-y-auto mx-4">
                        {loading && (
                            <div className="text-center py-12">
                                <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 inline-block transform -rotate-1 mb-6">
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="w-8 h-8 border-4 border-black rounded-full border-t-transparent animate-spin"></div>
                                        <span className="text-2xl font-black uppercase tracking-wider">GENERATING... / उत्पादन...</span>
                                    </div>
                                </div>
                                <p className="text-lg font-bold">
                                    {activeTab === 'classifier' ? 'Analyzing your image... / आपकी छवि का विश्लेषण...' : 'Creating your content... / आपकी सामग्री बनाई जा रही है...'}
                                </p>
                            </div>
                        )}
                        
                        {result && !loading && (
                            <div className="animate-fade-in">
                                {activeTab === 'classifier' ? renderClassifierResults() : 
                                 activeTab === 'emails' ? renderEmailResult() : 
                                 renderImageResult()}
                            </div>
                        )}
                        
                        {!result && !loading && (
                            <div className="text-center py-12">
                                <div className="bg-yellow-300 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-6 inline-block transform -rotate-1 mb-6">
                                    <h3 className="text-2xl font-black uppercase tracking-wider">
                                        RESULTS WILL APPEAR HERE / परिणाम यहाँ दिखाई देंगे
                                    </h3>
                                </div>
                                <p className="text-lg font-bold">
                                    Enter your {activeTab === 'classifier' ? 'image / छवि' : 'product UID / उत्पाद यूआईडी'} and click generate to see results / और परिणाम देखने के लिए जेनरेट पर क्लिक करें
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AITools;





