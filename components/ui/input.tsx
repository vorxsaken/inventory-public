import * as React from "react"
import { AiFillAccountBook } from 'react-icons/ai'
import { cn } from "@/lib/utils"
import { IconType } from "react-icons/lib"
import { InputEventValueType } from "@/lib/types"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> { }

type InputWithSuffixProps = InputProps & {
  icon: IconType,
  action: () => void
}

const Input = React.forwardRef<HTMLInputElement, InputProps & { number?: boolean, currency?: boolean }>(
  ({ className, type, number, onChange, currency, ...props }, ref) => {
    
    const handleNumber = (e: any) => {
      if (number) {
        e.target.value = e.target.value.replace(/[^0-9]/g, "");
        if(currency) {
          e.target.value = new Intl.NumberFormat('en-DE').format(e.target.value);
          return onChange && onChange(e);
        }
        return onChange && onChange(e);
      }
      onChange && onChange(e);
    }

    return (
      <input
        type={type}
        className={cn(
          `flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent 
            file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-1 
            focus-visible:outline-slate-700 disabled:cursor-not-allowed disabled:opacity-50`,
          className
        )}
        onChange={handleNumber}
        ref={ref}
        autoComplete="off"
        {...props}
      />
    )
  }
)
Input.displayName = "Input"


const InputWithActionSuffix = React.forwardRef<HTMLInputElement, InputWithSuffixProps>(({ className, type, icon, action, ...props }, ref) => {
  const Icon = icon;

  return (
    <div className="w-full h-auto relative">
      <Icon onClick={action} className={cn('absolute text-xl right-3 top-[25%] cursor-pointer', className)} />
      <Input
        className={className}
        ref={ref}
        type={type}
        autoComplete="off"
        {...props}
      />
    </div>
  )
})

InputWithActionSuffix.displayName = "InputWithActionSuffix"
export { Input, InputWithActionSuffix }
