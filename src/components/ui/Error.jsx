import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="bg-error/10 rounded-full p-6 mb-6">
        <ApperIcon name="AlertCircle" className="w-16 h-16 text-error" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">Oops! Error Occurred</h3>
      <p className="text-secondary text-center mb-6 max-w-md">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="primary">
          <ApperIcon name="RefreshCw" size={18} className="mr-2" />
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;