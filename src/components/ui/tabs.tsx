import * as React from "react"
import { cn } from "../../lib/utils"

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
}

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }: TabsProps) => {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue)
  
  React.useEffect(() => {
    if (value) setActiveTab(value)
  }, [value])

  const handleTabChange = (val: string) => {
    setActiveTab(val)
    if (onValueChange) onValueChange(val)
  }

  return (
    <div className={cn("flex flex-col gap-2", className)} {...props}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange: handleTabChange })
        }
        return child
      })}
    </div>
  )
}

const TabsList = ({ className, children, activeTab, onTabChange, ...props }: any) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-xl bg-muted p-1 text-muted-foreground", className)} {...props}>
    {React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child as React.ReactElement<any>, { activeTab, onTabChange })
      }
      return child
    })}
  </div>
)

const TabsTrigger = ({ className, value, children, activeTab, onTabChange, ...props }: any) => (
  <button
    onClick={() => onTabChange(value)}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50",
      activeTab === value ? "bg-background text-foreground shadow-sm" : "hover:text-foreground/80",
      className
    )}
    {...props}
  >
    {children}
  </button>
)

const TabsContent = ({ className, value, children, activeTab, ...props }: any) => (
  activeTab === value ? (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)} {...props}>
      {children}
    </div>
  ) : null
)

export { Tabs, TabsList, TabsTrigger, TabsContent }
