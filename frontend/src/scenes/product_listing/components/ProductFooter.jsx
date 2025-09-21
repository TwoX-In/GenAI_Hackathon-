import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/retroui/Button";

export function ProductFooter({ productId }) {
    return (
        <div className="mt-8 pt-8 border-t-4 border-black">
            <Link to={`/asset_gen/${productId}`}>
                <Button className="w-full bg-blue-300 text-black font-bold text-lg">
                    View Full Asset Generation Details
                </Button>
            </Link>
        </div>
    );
}