import React, { useState } from 'react';
import { ShoppingCart, Heart, Share2, Star, MapPin, Palette, User, Tag, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/retroui/Button";
import { Text } from "@/components/retroui/Text";
import { cn } from "@/lib/utils";

const ProductOverview = ({
  productTitle,
  productArtist, 
  productStyle, 
  productOrigin, 
  predictedArtist, 
  productMedium, 
  productThemes, 
  productColors, 
  productPrice,
  rating = 4.8,
  outputImages = []
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Parse themes and colors if they're strings
  const themes = typeof productThemes === 'string' ? productThemes.split(",").map(t => t.trim()) : (productThemes || []);
  const colors = typeof productColors === 'string' ? productColors.split(",").map(c => c.trim()) : (productColors || []);

  const InfoBlock = ({ label, value, bgColor = "bg-gray-200", icon: Icon }) => (
    <div className={`${bgColor} border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-4`}>
      <div className="flex items-center mb-2">
        {Icon && <Icon className="w-4 h-4 mr-2" />}
        <div className="text-xs font-black uppercase tracking-wider text-gray-700">{label}</div>
      </div>
      <div className="text-lg font-bold">{value || "Not specified"}</div>
    </div>
  );

  const ColorPalette = ({ colors }) => (
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <div key={index} className="flex items-center bg-black text-white px-4 py-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform">
          <div 
            className="w-6 h-6 border-2 border-white mr-3" 
            style={{ 
              backgroundColor: color.toLowerCase().includes('blue') ? '#1e40af' : 
                             color.toLowerCase().includes('yellow') ? '#fbbf24' : 
                             color.toLowerCase().includes('red') ? '#dc2626' :
                             color.toLowerCase().includes('green') ? '#16a34a' :
                             color.toLowerCase().includes('white') ? '#ffffff' : '#374151' 
            }}
          />
          <span className="font-bold text-sm">{color}</span>
        </div>
      ))}
    </div>
  );

  const ThemesList = ({ themes }) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {themes.map((theme, index) => (
        <div key={index} className="bg-yellow-300 border-3 border-black px-4 py-3 text-center font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:rotate-0 transition-transform">
          {theme}
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-[#fdfbf6] p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Layout: Images + Product Info Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Left Side: Product Images Gallery */}
          {outputImages.length > 0 && (
            <div className="space-y-4">
              {/* Main Image Container - Dynamic Height */}
              <div className="bg-white border-4 border-black p-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="relative bg-gray-100 border-2 border-black">
                  <img
                    src={`data:image/jpeg;base64,${outputImages[selectedImage]?.image || outputImages[selectedImage]?.bytes}`}
                    alt={`Product view ${selectedImage + 1}`}
                    className="w-full h-auto max-h-[500px] object-contain"
                    style={{ minHeight: '300px' }}
                  />
                  
                  {/* Image Counter */}
                  <div className="absolute top-3 right-3 bg-yellow-300 border-2 border-black px-3 py-1 font-bold text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {selectedImage + 1} / {outputImages.length}
                  </div>

                  {/* Navigation Arrows */}
                  {outputImages.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : outputImages.length - 1)}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-2 border-white hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setSelectedImage(selectedImage < outputImages.length - 1 ? selectedImage + 1 : 0)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black text-white p-3 border-2 border-white hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {outputImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {outputImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "flex-shrink-0 w-24 h-24 border-3 border-black bg-white p-2 transition-all transform hover:scale-105",
                        selectedImage === index 
                          ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-yellow-200 rotate-3 scale-110" 
                          : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:rotate-1"
                      )}
                    >
                      <img
                        src={`data:image/jpeg;base64,${image.image || image.bytes}`}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover border border-black"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Right Side: Product Header & Actions */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="bg-white border-4 border-black p-6 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <Text as="h1" className="text-3xl md:text-4xl font-black mb-4 transform rotate-1">
                {productTitle || "Handcrafted Artisan Product"}
              </Text>
              
              {/* Price and Rating */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <div className="bg-green-300 border-4 border-black px-6 py-3 transform rotate-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Text className="font-black text-2xl">₹{productPrice?.toLocaleString() || "0"}</Text>
                </div>
                
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 stroke-black stroke-2 ${i < Math.floor(rating) ? 'fill-yellow-400' : 'fill-gray-200'}`} />
                  ))}
                  <Text className="ml-2 font-bold">({rating})</Text>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-yellow-300 text-black font-bold flex-1 sm:flex-none">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
                <Button 
                  variant="outline" 
                  className={`bg-white transition-colors ${isLiked ? 'bg-red-200' : ''}`}
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                </Button>
                <Button variant="outline" className="bg-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-2 text-sm mt-4">
                <span className="bg-blue-200 border-2 border-black px-3 py-1 font-bold transform -rotate-1">
                  <Eye className="w-3 h-3 inline mr-1" />
                  1.2k views
                </span>
                <span className="bg-pink-200 border-2 border-black px-3 py-1 font-bold transform rotate-1">
                  <Heart className="w-3 h-3 inline mr-1" />
                  89 likes
                </span>
              </div>
            </div>
          </div>
        </div>


        {/* Product Details Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <InfoBlock 
              label="Artist" 
              value={productArtist} 
              bgColor="bg-pink-300" 
              icon={User}
            />
            <InfoBlock 
              label="Style" 
              value={productStyle} 
              bgColor="bg-purple-300" 
              icon={Palette}
            />
            <InfoBlock 
              label="Origin" 
              value={productOrigin} 
              bgColor="bg-orange-300" 
              icon={MapPin}
            />
          </div>
          <div>
            <InfoBlock 
              label="Predicted Artist Style" 
              value={predictedArtist} 
              bgColor="bg-green-300" 
              icon={Eye}
            />
            <InfoBlock 
              label="Medium" 
              value={productMedium} 
              bgColor="bg-blue-300" 
              icon={Tag}
            />
          </div>
        </div>

        {/* Themes Section */}
        {themes.length > 0 && (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
            <Text as="h3" className="text-2xl font-black mb-4 border-b-2 border-black pb-2">
              Product Themes
            </Text>
            <ThemesList themes={themes} />
          </div>
        )}

        {/* Colors Section */}
        {colors.length > 0 && (
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Text as="h3" className="text-2xl font-black mb-4 border-b-2 border-black pb-2">
              Product Colors
            </Text>
            <ColorPalette colors={colors} />
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductOverview;