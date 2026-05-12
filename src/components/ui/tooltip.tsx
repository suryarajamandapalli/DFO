import * as React from "react"
import { cn } from "../../lib/utils"

const TooltipProvider = ({ children }: any) => <>{children}</>

const Tooltip = ({ children }: any) => <div className="relative group inline-block">{children}</div>

const TooltipTrigger = ({ children }: any) => <div className="inline-block cursor-help">{children}</div>

const TooltipContent = ({ children, className }: any) => (
  <div className={cn(
    "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-[100] px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in-95",
    className
  )}>
    {children}
    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900" />
  </div>
)

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
