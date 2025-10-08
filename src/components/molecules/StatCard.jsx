import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  icon, 
  iconBg = "bg-primary/10",
  iconColor = "text-primary",
  title, 
  value, 
  trend,
  trendDirection = "up",
  className 
}) => {
  return (
    <div className={cn(
      "bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200",
      "border border-slate-100",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg", iconBg)}>
          <ApperIcon name={icon} className={cn("w-6 h-6", iconColor)} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm font-semibold",
            trendDirection === "up" ? "text-success" : "text-error"
          )}>
            <ApperIcon 
              name={trendDirection === "up" ? "TrendingUp" : "TrendingDown"} 
              size={16} 
            />
            <span>{trend}</span>
          </div>
        )}
      </div>
      <p className="text-sm text-secondary font-medium mb-1">{title}</p>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default StatCard;