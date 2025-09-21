import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Text } from "@/components/retroui/Text";
import { Button } from "@/components/retroui/Button";
import { ProductGrid } from "@/components/product_grid/product_grid";
import { Request } from "@/request/request";
import StarFigure from "@/components/figures/star_figure";
import { Search, Filter, Grid, List } from "lucide-react";

export function ProductsShowcase() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Request.get("/storage/products");
        console.log(response);
        if (response.status === "success") {
          // Transform the data to match the expected format
          const transformedProducts = response.products.map(product => ({
            id: product.id,
            title: product.title,
            outputImages: product.header_image ? [product.header_image] : [],
            recommendedPrice: { price: product.price },
            predictedArtist: product.predicted_artist ? { predicted_artist: product.predicted_artist } : null,
            productOrigin: product.origin ? { origin: product.origin } : null,
            productStyle: product.style ? { style: product.style } : null,
            rating: product.rating
          }));
          setProducts(transformedProducts);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    searchTerm === "" || 
    product.predictedArtist?.predicted_artist?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.productOrigin?.origin?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf6]">
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Text className="font-bold text-xl">Loading Products...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8">
      {/* Decorative Elements */}
      <StarFigure color="#FF6B35" stroke="black" className="absolute top-20 left-10 w-8 h-8 z-10" />
      <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10" />
      <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-7 h-7 z-10" />

      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Text as="h1" className="text-5xl font-black mb-4 transform -rotate-1">
            Artisan Products
          </Text>
          <div className="bg-yellow-300 border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
            <Text className="font-bold">Discover handcrafted masterpieces from talented artisans</Text>
          </div>
        </motion.div>

        {/* Search & Filters */}
        <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by artist, origin, style..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            {/* Filter Button */}
            <Button variant="outline" className="bg-white">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <Text className="font-bold">
            Showing {filteredProducts.length} of {products.length} products
          </Text>
        </div>

        {/* Products Grid */}
        <ProductGrid products={filteredProducts} />

        {/* Load More */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-blue-300 text-black font-bold">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}