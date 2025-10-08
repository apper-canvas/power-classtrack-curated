import React from "react";
import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  error, 
  required, 
  type = "text",
  className,
  ...props 
}) => {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label}
        {required && <span className="text-error ml-1">*</span>}
      </label>
      <Input type={type} error={error} {...props} />
      {error && (
        <p className="mt-1.5 text-sm text-error font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;