import React from "react";
import { Text } from "@/components/retroui/Text";

export function LoadingState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf6]">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Text className="font-bold text-xl">Loading Product...</Text>
            </div>
        </div>
    );
}

export function ErrorState() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf6]">
            <div className="bg-red-200 border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Text className="font-bold text-xl">Product Not Found</Text>
            </div>
        </div>
    );
}