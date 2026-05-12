import * as React from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const DialogContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void }>({ 
  open: false, 
  setOpen: () => {} 
})

const Dialog = ({ open, onOpenChange, children }: any) => {
  return (
    <DialogContext.Provider value={{ open, setOpen: onOpenChange }}>
      {open ? <div className="contents">{children}</div> : null}
    </DialogContext.Provider>
  )
}

const DialogTrigger = ({ children, onClick }: any) => {
  const { setOpen } = React.useContext(DialogContext)
  return React.cloneElement(children, { 
    onClick: (e: any) => {
      if (onClick) onClick(e)
      setOpen(true)
    } 
  })
}

const DialogPortal = ({ children }: any) => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])
  return mounted ? createPortal(children, document.body) : null
}

const DialogOverlay = ({ onClick }: any) => (
  <div 
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
    onClick={onClick}
  />
)

const DialogContent = ({ children, className, showCloseButton = true }: any) => {
  const { setOpen } = React.useContext(DialogContext)
  return (
    <DialogPortal>
      <DialogOverlay onClick={() => setOpen(false)} />
      <div className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-card p-6 shadow-2xl duration-200 animate-in fade-in zoom-in-95 rounded-[2.5rem] ring-1 ring-border",
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
    </DialogPortal>
  )
}

const DialogHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
)

const DialogFooter = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
)

const DialogTitle = ({ className, ...props }: any) => (
  <h2 className={cn("text-xl font-black text-foreground tracking-tight", className)} {...props} />
)

const DialogDescription = ({ className, ...props }: any) => (
  <p className={cn("text-sm font-bold text-muted-foreground", className)} {...props} />
)

export {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
