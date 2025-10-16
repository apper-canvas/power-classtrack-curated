import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text",
  error,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 border-2 rounded-md transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        error ? "border-error" : "border-slate-300",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;