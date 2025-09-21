
import React from "react";

export function ArtifactoIcon({ className = "w-6 h-6", fill = "#FFFFFF" }) {
    return (
        <svg  fill={fill} className={className} viewBox="0 0 200 200">
            <path xmlns="http://www.w3.org/2000/svg" d="M138.165 7.58984C138.063 37.4589 162.457 61.7587 192.329 61.6445C171.16 82.7426 171.157 117.146 192.409 138.165C162.541 138.064 138.24 162.458 138.354 192.329C117.256 171.16 82.8528 171.157 61.834 192.409C61.9352 162.54 37.5417 138.24 7.66992 138.354C28.8417 117.254 28.8427 82.8455 7.58301 61.8271C37.4521 61.8524 61.7592 37.5428 61.6445 7.66992C82.7427 28.8397 117.146 28.8424 138.165 7.58984Z" fill="#5294FF" stroke="black" strokeWidth="2" strokeMiterlimit="10" /></svg>
    );
}