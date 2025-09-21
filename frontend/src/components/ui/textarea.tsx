import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      rows={4}
      className={`px-4 py-2 w-full border-2 shadow-md transition focus:outline-hidden focus:shadow-xs ${
        props["aria-invalid"]
          ? "border-red-500 text-red-500 shadow-xs shadow-red-600"
          : ""
      } ${className}`}
      {...props}
    />
  )
}

export { Textarea }
