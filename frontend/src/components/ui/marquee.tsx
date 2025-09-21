import React from "react";
import { ArtifactoIcon } from "./logo_icon";

export default function Marquee({ items, className = "", flag = 0 }: { items: string[], className?: string , flag?: number}) {
  return (
    <div className="bg-[#FF9A9E] relative flex w-full overflow-x-hidden border-b-2 border-t-2 border-border bg-secondary-background text-foreground font-base">
      <div
        className={`${
          flag % 2 === 0 ? "animate-marquee" : "animate-marquee3"
        } whitespace-nowrap py-4`}
      >
        {items.map((item, index) => {
          return (
            <div className="inline-flex items-center" key={`${item}-${index}`}>
              <span className="px-2 py-1  mx-4 text-4xl font-bold">
                {item}
              </span>
              {(index%2===0)
                ? <ArtifactoIcon className="w-8 h-8 mx-2" fill="#000000ff" />
                : <ArtifactoIcon className="w-8 h-8 mx-2" fill="#0088FF" />}
            </div>
          )
        })}
      </div>

      <div
        className={`absolute top-0 ${
          flag % 2 === 0 ? "animate-marquee2" : "animate-marquee4"
        } whitespace-nowrap py-4`}
      >
        {items.map((item, index) => {
          return (
            <div className="inline-flex items-center" key={`${item}-${index}-2`}>
              <span className="px-2 py-1  mx-4 text-4xl font-bold">
                {item}
              </span>
              {(index%2===0)
                ? <ArtifactoIcon className="w-8 h-8 mx-2" fill="#000000ff" />
                : <ArtifactoIcon className="w-8 h-8 mx-2" fill="#0088FF" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}