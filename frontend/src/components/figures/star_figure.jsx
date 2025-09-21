import React from "react";

const StarFigure = ({ size = 64, color = "yellow", stroke = "black" , className=""}) => (
    <svg
        viewBox="0 0 92 92"
        xmlns="http://www.w3.org/2000/svg"
        height={size}
        width={size}
        fill={color}
        stroke={stroke}
        strokeWidth="2"
        className={`${className}`}
    >
        <path
            d="M31.4908 9.34241C42.4131 26.2225 62.5391 34.9909 82.3424 31.491C65.4631 42.4131 56.6931 62.5385 60.1923 82.3412C49.2698 65.4629 29.1457 56.6932 9.34367 60.1925C26.2227 49.2697 34.9908 29.1452 31.4908 9.34241Z"
        />
    </svg>
);

export default StarFigure;