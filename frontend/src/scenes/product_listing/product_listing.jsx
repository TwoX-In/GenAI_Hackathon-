import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { ProductHeader } from "./components/ProductHeader";
import { ProductTabs } from "./components/ProductTabs";
import { ProductTabContent } from "./components/ProductTabContent";
import { ProductFooter } from "./components/ProductFooter";
import { ErrorState } from "./components/LoadingState";
import { Request } from "@/request/request";

export function ProductListing() {
  const data = useLoaderData();
  const [activeTab, setActiveTab] = useState("Overview");
  const [productData, setProductData] = useState(data);
  useEffect(() => {
          setProductData(data);
    }, []);
  
  // Handle error state
  if (!data) {
    return <ErrorState />;
  }
  
  // Calculate price
  const price = Math.round((data.recommendedPrice?.price || 0) / 1000) * 1000;
  const productId = data.productTitle?.id || data.recommendedPrice?.uid;

  return (
    <div className="min-h-screen bg-[#fdfbf6] py-8">
      <ProductHeader />

      <div className="max-w-7xl mx-auto px-4">
        {/* Main Content Container */}
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8">
          <ProductTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          <ProductTabContent
            activeTab={activeTab}
            data={productData}
            price={price}
          />

          <ProductFooter productId={productId} />
        </div>
      </div>
    </div>
  );
}