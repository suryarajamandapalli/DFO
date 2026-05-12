import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const SheetContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({ 
  open: false, 
  setOpen: () => {} 
})

const Sheet = ({ open, onOpenChange, children }: any) => {
  return (
    <SheetContext.Provider value={{ open, setOpen: onOpenChange }}>
      {open ? <div className="contents">{children}</div> : null}
    </SheetContext.Provider>
  )
}

const SheetTrigger = ({ children, onClick }: any) => {
  const { setOpen } = React.useContext(SheetContext)
  return React.cloneElement(children, { 
    onClick: (e: any) => {
      if (onClick) onClick(e)
      setOpen(true)
    } 
  })
}

const SheetPortal = ({ children }: any) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? createPortal(children, document.body) : null
}

const SheetOverlay = ({ onClick }: any) => (
  <div 
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
    onClick={onClick}
  />
)

const SheetContent = ({ children, className, side = "right", showCloseButton = true }: any) => {
  const { setOpen } = React.useContext(SheetContext)
  
  const sideClasses = {
    right: "inset-y-0 right-0 h-full w-3/4 sm:max-w-sm border-l animate-in slide-in-from-right",
    left: "inset-y-0 left-0 h-full w-3/4 sm:max-w-sm border-r animate-in slide-in-from-left",
    top: "inset-x-0 top-0 h-auto w-full border-b animate-in slide-in-from-top",
    bottom: "inset-x-0 bottom-0 h-auto w-full border-t animate-in slide-in-from-bottom"
  }

  return (
    <SheetPortal>
      <SheetOverlay onClick={() => setOpen(false)} />
      <div className={cn(
        "fixed z-50 bg-card p-6 shadow-2xl transition ease-in-out duration-300 ring-1 ring-border",
        sideClasses[side as keyof typeof sideClasses],
        className
      )}>
        {children}
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute right-6 top-6 rounded-xl opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-muted p-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </SheetPortal>
  )
}

const SheetHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left mb-6", className)} {...props} />
)

const SheetFooter = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-auto", className)} {...props} />
)

const SheetTitle = ({ className, ...props }: any) => (
  <h2 className={cn("text-lg font-black text-foreground tracking-tight", className)} {...props} />
)

const SheetDescription = ({ className, ...props }: any) => (
  <p className={cn("text-sm font-bold text-muted-foreground", className)} {...props} />
)

const SheetClose = ({ children, onClick }: any) => {
  const { setOpen } = React.useContext(SheetContext)
  return React.cloneElement(children, {
    onClick: (e: any) => {
      if (onClick) onClick(e)
      setOpen(false)
    }
  })
}

export {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
}
