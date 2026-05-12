import * as React from "react"
import { createPortal } from "react-dom"
import { cn } from "../../lib/utils"

const DropdownMenu = ({ children, open, onOpenChange }: any) => {
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

const DropdownMenuTrigger = ({ children, isOpen, setIsOpen, asChild }: any) => {
  return React.cloneElement(children, {
    onClick: (e: any) => {
      e.stopPropagation()
      setIsOpen(!isOpen)
    }
  })
}

const DropdownMenuContent = ({ children, isOpen, setIsOpen, className, align = "right" }: any) => {
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
        "absolute z-50 mt-2 min-w-[12rem] overflow-hidden rounded-2xl border border-border bg-card p-1 text-popover-foreground shadow-2xl animate-in fade-in zoom-in-95 duration-100 ring-1 ring-border",
        align === "right" ? "right-0" : "left-0",
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  )
}

const DropdownMenuItem = ({ children, onClick, className }: any) => (
  <div
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-xl px-3 py-2.5 text-sm font-bold outline-none transition-colors hover:bg-muted hover:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 gap-2",
      className
    )}
    onClick={(e) => {
      if (onClick) onClick(e)
    }}
  >
    {children}
  </div>
)

const DropdownMenuLabel = ({ className, children }: any) => (
  <div className={cn("px-3 py-2 text-xs font-black uppercase tracking-widest text-muted-foreground", className)}>
    {children}
  </div>
)

const DropdownMenuSeparator = () => (
  <div className="-mx-1 my-1 h-px bg-border" />
)

const DropdownMenuGroup = ({ children }: any) => (
  <div className="p-1">{children}</div>
)

const DropdownMenuShortcut = ({ className, ...props }: any) => (
  <span className={cn("ml-auto text-xs tracking-widest text-muted-foreground", className)} {...props} />
)

const DropdownMenuSub = ({ children }: any) => <div className="contents">{children}</div>
const DropdownMenuSubTrigger = ({ children }: any) => <div className="contents">{children}</div>
const DropdownMenuSubContent = ({ children }: any) => <div className="contents">{children}</div>

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent
}
