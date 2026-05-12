import * as React from "react"
import { cn } from "../../lib/utils"

const Popover = ({ children, open, onOpenChange }: any) => {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setIsOpen = isControlled ? onOpenChange : setInternalOpen

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { isOpen, setIsOpen })
        }
        return child
      })}
    </div>
  )
}

const PopoverTrigger = ({ children, isOpen, setIsOpen }: any) => {
  return React.cloneElement(children, {
    onClick: (e: any) => {
      e.stopPropagation()
      setIsOpen(!isOpen)
    }
  })
}

const PopoverContent = ({ children, isOpen, setIsOpen, className }: any) => {
  React.useEffect(() => {
    if (!isOpen) return
    const handleClose = () => setIsOpen(false)
    window.addEventListener('click', handleClose)
    return () => window.removeEventListener('click', handleClose)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div 
      className={cn(
        "absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-[2rem] border border-border bg-card p-4 text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-200 ring-1 ring-border",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

const PopoverHeader = ({ className, ...props }: any) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)} {...props} />
)

const PopoverTitle = ({ className, ...props }: any) => (
  <h3 className={cn("text-lg font-black text-foreground tracking-tight", className)} {...props} />
)

const PopoverDescription = ({ className, ...props }: any) => (
  <p className={cn("text-sm font-bold text-muted-foreground", className)} {...props} />
)

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
