import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/retroui/Button";

const TABS = [
    "Overview",
    "Images",
    "3D Experience",
    "Product Story", 
    "Product History",
    "Origin Map",
    "Ad Banners",
    "Product Videos",
    "Product FAQs"
];

export function ProductTabs({ activeTab, onTabChange }) {
    return (
        <div className="flex flex-wrap gap-2 mb-8 border-b-4 border-black pb-4">
            {TABS.map((tab) => (
                <Button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={cn(
                        "px-4 py-2 font-bold border-2 border-black transition-all duration-150",
                        "hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none",
                        activeTab === tab
                            ? "bg-yellow-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    )}
                >
                    {tab}
                </Button>
            ))}
        </div>
    );
}