import React from "react";
import { Card, CardContent } from "../../../shared/components/Card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "primary" | "success" | "warning" | "error" | "info";
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  trend,
}) => {
  const colorClasses = {
    primary: "text-primary-600 bg-primary-50",
    success: "text-success-600 bg-success-50",
    warning: "text-warning-600 bg-warning-50",
    error: "text-error-600 bg-error-50",
    info: "text-info-600 bg-info-50",
  };

  const trendClasses = {
    positive: "text-success-600",
    negative: "text-error-600",
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary-600">{title}</p>
            <p className="text-2xl font-bold text-secondary-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? trendClasses.positive : trendClasses.negative
                  }`}
                >
                  {trend.isPositive ? "+" : ""}{trend.value}%
                </span>
                <span className="text-sm text-secondary-500 ml-1">vs mes anterior</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 