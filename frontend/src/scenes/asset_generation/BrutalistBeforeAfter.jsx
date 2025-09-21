import React, { useState } from "react";
import { Contrast, Palette, Zap, Sparkles } from "lucide-react";

export default function BrutalistTwoBoxLayout({
    inputImageBytes,
    outputsData = [],
    mimeType = "image/jpeg",
}) {
    // Convert base64 string or URL to a proper data URL
    const makeImageUrl = (value, type = mimeType) => {
        if (!value) return null;
        if (value.startsWith("http")) return value; // already a URL
        return `data:${type};base64,${value}`; // assume base64 string from backend
    };
    console.log("outputsData", outputsData)
    // Use provided data or fallback
    const actualInputBytes = inputImageBytes?.[0]?.image;
    const actualOutputsData = outputsData;

    // Build input/output images
    const inputImage = makeImageUrl(actualInputBytes);
    const outputs = actualOutputsData.map((output, index) => ({
        ...output,
        id: output.id || index + 1,
        image: makeImageUrl(output.bytes || output.image),
        icon: output.icon || [Contrast, Palette, Zap, Sparkles][index % 4],
    }));

    const [selectedOutput, setSelectedOutput] = useState(0);

    // Don't render if no data
    if (!inputImage || outputs.length === 0) {
        return (
            <div className="w-full bg-pink-50 p-6 flex items-center justify-center min-h-96">
                <div className="bg-white border-6 border-purple-400 shadow-[12px_12px_0px_rgba(168,85,247,0.4)] p-12">
                    <div className="text-purple-600 text-2xl font-black uppercase text-center">
                        NO IMAGE DATA PROVIDED
                    </div>
                </div>
            </div>
        );
    }

    const currentOutput = outputs[selectedOutput];

    return (
        <div className=" grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white">
            {/* Input Image Box */}
            <div className="flex flex-col border-4 border-black bg-gray-100 shadow-[4px_4px_0px_#000]">
                <h2 className="text-xl font-extrabold uppercase tracking-wide bg-yellow-300 border-b-4 border-black px-4 py-2 text-center">
                    Input
                </h2>
                <img
                    src={inputImage}
                    alt="Input"
                    className="w-full max-h-[500px] object-contain border-t-4 border-black"
                />
            </div>

            {/* Output Image Box */}
            <div className="flex flex-col border-4 border-black bg-gray-100 shadow-[4px_4px_0px_#000]">
                <h2 className="text-xl font-extrabold uppercase tracking-wide bg-green-300 border-b-4 border-black px-4 py-2 text-center">
                    Output
                </h2>

                {/* Main Selected Output */}
                <img
                    src={currentOutput.image}
                    alt={`Output ${currentOutput.id}`}
                    className="w-full max-h-[500px] object-contain border-t-4 border-black"
                />

                {/* Output Selector */}
                <div className="grid grid-cols-4 gap-2 p-4">
                    {outputs.map((out, i) => {
                        const Icon = out.icon;
                        return (
                            <button
                                key={out.id}
                                onClick={() => setSelectedOutput(i)}
                                className={`flex items-center justify-center border-4 border-black p-2 shadow-[3px_3px_0px_#000] ${selectedOutput === i
                                        ? "bg-green-300"
                                        : "bg-white hover:bg-gray-200"
                                    }`}
                            >
                                {Icon && <Icon className="w-5 h-5" />}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
