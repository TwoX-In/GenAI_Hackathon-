import React from "react";

export function TikTokIcon({
    size = 64,
    color = "#000000",
    stroke = "none",
    className = "",
}) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill={color}
            stroke={stroke}
            className={className}
        >
            <path d="M19.708 3h-3.625v18.375c0 1.521-1.229 2.75-2.75 
                2.75s-2.75-1.229-2.75-2.75 1.229-2.75 
                2.75-2.75c.302 0 .593.062.865.153v-3.682a6.321 
                6.321 0 0 0-.865-.066c-3.586 0-6.5 2.914-6.5 
                6.5s2.914 6.5 6.5 6.5 6.5-2.914 
                6.5-6.5V12.542c1.25.917 2.792 1.458 4.458 
                1.458V10.5c-.708 0-1.375-.188-1.958-.5a4.42 
                4.42 0 0 1-1.375-1.125 4.468 4.468 0 0 1-.958-2.625V3z">
            </path>
        </svg>
    );
}