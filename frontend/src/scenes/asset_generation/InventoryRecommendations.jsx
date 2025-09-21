import React, { useState, useEffect } from "react";
import { Card } from "@/components/retroui/Card";
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { Input } from "@/components/retroui/Input";
import { Label } from "@/components/retroui/Label";
import { Request } from "@/request/request";
import TranslationBox from "@/components/translation/TranslationBox";

const InventoryRecommendations = ({ recs }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState(recs);
  const [designStates, setDesignStates] = useState({});

  useEffect(() => {
    if (recs) {
      setRecommendations(recs);
      setLoading(false);
      // Initialize design states for each recommendation
      const initialStates = {};
      recs.forEach((_, index) => {
        initialStates[index] = {
          showDesignIdeas: false,
          loading: false,
          error: null,
          imageUrl: null,
          styleHint: ""
        };
      });
      setDesignStates(initialStates);
    }
  }, [recs]);

  const toggleDesignIdeas = (index) => {
    setDesignStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        showDesignIdeas: !prev[index]?.showDesignIdeas
      }
    }));
  };

  const updateDesignState = (index, updates) => {
    setDesignStates(prev => ({
      ...prev,
      [index]: {
        ...prev[index],
        ...updates
      }
    }));
  };

  const handleGenerateDesign = async (index, recommendation) => {
    const currentState = designStates[index];
    if (!currentState) return;

    updateDesignState(index, { loading: true, error: null, imageUrl: null });

    try {
      const payload = {
        art_forms: Array.isArray(recommendation.art_forms) ? recommendation.art_forms : recommendation.art_forms.split(', '),
        region: "Uttar Pradesh",
        holiday: recommendation.holiday,
        items: recommendation.items,
        reason: recommendation.reason,
        style_hint: currentState.styleHint || undefined,
      };
      
      const res = await Request.postByUrl("/inventory/design-ideas", payload);
      if (!res?.image_data_url) {
        throw new Error(res?.error || "No image returned");
      }
      
      updateDesignState(index, { imageUrl: res.image_data_url });
    } catch (e) {
      console.error(e);
      updateDesignState(index, {
        error: e?.response?.data?.detail?.message ||
               e?.message ||
               "Failed to generate design idea. Please try again."
      });
    } finally {
      updateDesignState(index, { loading: false });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <Card.Content>
          <Text className="text-red-600 text-center">{error}</Text>
        </Card.Content>
      </Card>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="w-full">
        <Card.Content>
          <Text className="text-center">No inventory recommendations available for this product.</Text>
        </Card.Content>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {/* Brutalist Header */}
      <div className="relative">
        <div className="bg-[#ffdb33] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 p-8 text-center">
          <h2 className="text-4xl font-black uppercase tracking-widest text-black mb-4">
            🎯 HOLIDAY INVENTORY
          </h2>
          <div className="bg-black text-[#ffdb33] px-6 py-2 inline-block transform rotate-2 font-bold text-lg uppercase tracking-wider">
            STRATEGIC RECOMMENDATIONS
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ff6600] border-2 border-black transform rotate-45"></div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#88d8ff] border-2 border-black rounded-full"></div>
      </div>

      <div className="grid gap-8">
        {recommendations.map((rec, index) => (
          <div key={index} className="relative">
            {/* Main Card with aggressive brutalist styling */}
            <div className="bg-white border-6 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200">
              <div className="p-8 space-y-6">
                {/* Holiday Header with extreme styling */}
                <div className="flex items-center justify-between border-b-4 border-black pb-6 mb-6">
                  <div className="space-y-2">
                    <div className="bg-[#ff003c] text-white px-4 py-2 transform -skew-x-12 inline-block">
                      <h3 className="text-2xl font-black uppercase tracking-wider">{rec.holiday}</h3>
                    </div>
                    <div className="bg-[#88d8ff] text-black px-3 py-1 transform skew-x-12 inline-block font-bold text-sm uppercase">
                      ART FORM: {rec.art_forms}
                    </div>
                  </div>
                  <Button
                    onClick={() => toggleDesignIdeas(index)}
                    className="bg-[#ffdb33] hover:bg-[#ffcc00] text-black font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 px-6 py-3 uppercase tracking-wider transform hover:rotate-1 transition-all duration-200"
                  >
                    🎨 {designStates[index]?.showDesignIdeas ? 'HIDE' : 'GENERATE'} IDEAS
                  </Button>
                </div>

                {/* Market Insight with brutalist styling */}
                <div className="relative">
                  <div className="bg-[#fae583] border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                    <div className="bg-black text-[#fae583] px-4 py-2 inline-block transform -rotate-2 mb-4">
                      <h4 className="font-black uppercase tracking-wider text-sm">🎯 MARKET INSIGHT</h4>
                    </div>
                    <Text className="text-black leading-relaxed font-medium">{rec.reason}</Text>
                    <TranslationBox text={rec.reason} label="Translate insight" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ff6600] border-2 border-black transform rotate-45"></div>
                </div>

                {/* Recommended Items with extreme brutalist grid */}
                <div className="space-y-4">
                  <div className="bg-black text-white px-6 py-3 inline-block transform -skew-x-12">
                    <h4 className="font-black uppercase tracking-widest text-lg">
                      📦 RECOMMENDED ITEMS
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {rec.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative group cursor-pointer"
                      >
                        <div className="bg-white border-3 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-all duration-200 transform hover:rotate-1">
                          <Text className="font-bold text-black text-sm uppercase tracking-wide">{item}</Text>
                        </div>
                        {/* Random decorative elements */}
                        {itemIndex % 3 === 0 && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff003c] border border-black rounded-full"></div>
                        )}
                        {itemIndex % 4 === 1 && (
                          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#88d8ff] border border-black transform rotate-45"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Design Ideas Section with extreme brutalist styling */}
                {designStates[index]?.showDesignIdeas && (
                  <div className="mt-8 border-t-6 border-black pt-8 relative">
                    <div className="bg-[#d8b4fe] border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                      <div className="flex items-center justify-between mb-6">
                        <div className="bg-black text-[#d8b4fe] px-6 py-3 transform skew-x-12">
                          <h4 className="text-xl font-black uppercase tracking-widest">🎨 AI DESIGN GENERATOR</h4>
                        </div>
                        <Button
                          onClick={() => toggleDesignIdeas(index)}
                          className="bg-[#ff003c] hover:bg-red-600 text-white font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 px-4 py-2 text-sm uppercase tracking-wider transform hover:-rotate-2 transition-all duration-200"
                        >
                          ✕ CLOSE
                        </Button>
                      </div>
                      
                      {/* Inline Design Generator */}
                      <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transform rotate-1 space-y-4">
                        {/* Style Hint Input */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                          <div className="md:col-span-2 space-y-2">
                            <div className="bg-[#ffdb33] text-black px-3 py-1 inline-block transform -skew-x-6">
                              <Label className="font-black uppercase text-xs tracking-wider">Style Hint (Optional)</Label>
                            </div>
                            <Input
                              placeholder="e.g., earthy palette, minimal patterns, flat lay"
                              value={designStates[index]?.styleHint || ""}
                              onChange={(e) => updateDesignState(index, { styleHint: e.target.value })}
                              className="border-3 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-medium"
                            />
                          </div>
                          <Button 
                            onClick={() => handleGenerateDesign(index, rec)}
                            disabled={designStates[index]?.loading}
                            className="bg-[#10b981] hover:bg-green-600 text-white font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 px-4 py-2 uppercase tracking-wider transform hover:rotate-1 transition-all duration-200"
                          >
                            {designStates[index]?.loading ? "GENERATING..." : "GENERATE"}
                          </Button>
                        </div>

                        {/* Error Display */}
                        {designStates[index]?.error && (
                          <div className="bg-[#ff003c] text-white p-4 border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                            <Text className="font-bold uppercase text-sm tracking-wide">
                              ⚠️ {designStates[index].error}
                            </Text>
                          </div>
                        )}

                        {/* Generated Image Display */}
                        {designStates[index]?.imageUrl && (
                          <div className="mt-6 relative">
                            <div className="bg-black text-white px-4 py-2 inline-block transform -skew-x-6 mb-3">
                              <Text className="font-black uppercase text-sm tracking-wider">✨ Generated Design</Text>
                            </div>
                            <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 overflow-hidden">
                              <img 
                                src={designStates[index].imageUrl} 
                                alt="Generated design concept" 
                                className="w-full h-auto"
                              />
                            </div>
                            {/* Image decorative elements */}
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#ffdb33] border-2 border-black transform rotate-45"></div>
                            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#88d8ff] border-2 border-black rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* Decorative chaos */}
                    <div className="absolute -top-3 -left-3 w-6 h-6 bg-[#ffdb33] border-2 border-black transform rotate-45"></div>
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-[#88d8ff] border-2 border-black rounded-full"></div>
                  </div>
                )}
              </div>
              
              {/* Card decorative elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#ff6600] border-2 border-black transform rotate-45"></div>
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#88d8ff] border-2 border-black rounded-full"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Brutalist Summary Footer */}
      <div className="relative mt-12">
        <div className="bg-[#10b981] border-6 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transform rotate-2 p-8">
          <div className="text-center space-y-6">
            <div className="bg-black text-[#10b981] px-8 py-4 inline-block transform -rotate-3">
              <h4 className="text-2xl font-black uppercase tracking-widest">📊 SUMMARY REPORT</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
                <div className="bg-[#ffdb33] text-black px-4 py-2 inline-block transform skew-x-12 mb-3">
                  <Text className="font-black uppercase tracking-wider text-sm">OPPORTUNITIES</Text>
                </div>
                <Text className="text-3xl font-black text-black">
                  {recommendations.length}
                </Text>
                <Text className="text-sm font-bold text-gray-700 uppercase">Holiday Events</Text>
              </div>
              
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
                <div className="bg-[#ff003c] text-white px-4 py-2 inline-block transform -skew-x-12 mb-3">
                  <Text className="font-black uppercase tracking-wider text-sm">PRODUCTS</Text>
                </div>
                <Text className="text-3xl font-black text-black">
                  {recommendations.reduce((acc, rec) => acc + rec.items.length, 0)}
                </Text>
                <Text className="text-sm font-bold text-gray-700 uppercase">Total Recommendations</Text>
              </div>
            </div>
            
            <div className="bg-black text-white px-6 py-3 inline-block transform skew-x-6 mt-6">
              <Text className="text-sm font-bold uppercase tracking-wider">
                🎨 Click "GENERATE IDEAS" for AI-powered visual concepts
              </Text>
            </div>
          </div>
        </div>
        
        {/* Extreme decorative chaos */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-[#ffdb33] border-4 border-black transform rotate-45"></div>
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-[#ff6600] border-2 border-black rounded-full"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#88d8ff] border-2 border-black transform rotate-45"></div>
        <div className="absolute -bottom-6 -right-6 w-10 h-10 bg-[#d8b4fe] border-3 border-black rounded-full"></div>
      </div>
    </div>
  );
};

export default InventoryRecommendations;
