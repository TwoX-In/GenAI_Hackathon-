import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { Star, Heart, Eye, MapPin } from "lucide-react";

export function ProductGrid({ products = [] }) {
  if (!products.length) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
          <Text className="font-bold text-xl">No Products Available</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product, index) => (
        <ProductCard key={product.id || index} product={product} index={index} />
      ))}
    </div>
  );
}

function ProductCard({ product, index }) {
  const price = Math.round((product.recommendedPrice?.price || 0) / 1000) * 1000;
  const image = product.outputImages?.[0];
  const rating = product.rating || 4.8;
  const title = product.title || "Handcrafted Artisan Product";
  console.log(product);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ rotate: Math.random() > 0.5 ? 1 : -1 }}
      className="bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-200"
    >
      {/* Image */}
      <div className="relative p-3">
        {image ? (
          <img
            src={`data:image/jpeg;base64,${image}`}
            alt="Product"
            className="w-full h-48 object-cover border-2 border-black"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 border-2 border-black flex items-center justify-center">
            <Text className="text-gray-500">No Image</Text>
          </div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-1 right-1 bg-green-300 border-2 border-black px-2 py-1 rotate-12">
          <Text className="font-bold text-sm">₹{price.toLocaleString()}</Text>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <Text as="h3" className="font-bold text-lg line-clamp-2">
          {title}
        </Text>
        
        {/* Details */}
        <div className="space-y-1 text-sm">
          {product.predictedArtist && (
            <Text className="text-gray-600">Style: {product.predictedArtist.predicted_artist}</Text>
          )}
          {product.productOrigin && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <Text className="text-gray-600">{product.productOrigin.origin}</Text>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-3 h-3 stroke-black ${i < Math.floor(rating) ? 'fill-yellow-400' : 'fill-gray-200'}`} />
            ))}
            <Text className="ml-1 font-bold">({rating})</Text>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {Math.floor(Math.random() * 1000) + 100}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              {Math.floor(Math.random() * 100) + 10}
            </span>
          </div>
        </div>

        {/* Action */}
        <Link to={`/product_listing/${product.id}`} className="block">
          <Button className="w-full bg-yellow-300 text-black font-bold text-sm">
            View Product
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}