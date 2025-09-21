import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/retroui/Button";
import { ArrowLeft } from "lucide-react";
import StarFigure from "@/components/figures/star_figure";

export function ProductHeader() {
    return (
        <>
            {/* Decorative Elements */}
            <StarFigure color="#FF6B35" stroke="black" className="absolute top-20 left-10 w-8 h-8 z-10" />
            <StarFigure color="#D8B4FE" stroke="black" className="absolute top-32 right-16 w-6 h-6 z-10" />
            <StarFigure color="#34D399" stroke="black" className="absolute bottom-40 left-20 w-7 h-7 z-10" />

            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4">
                <Link to="/products" className="inline-block mb-6">
                    <Button variant="outline" className="bg-white">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Products
                    </Button>
                </Link>
            </div>
        </>
    );
}