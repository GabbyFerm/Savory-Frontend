import { type LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-light rounded-2xl p-6 border border-secondary">
      {/* Centered Layout */}
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="bg-primary/20 p-4 rounded-full mb-4">
          <Icon size={28} className="text-darkTeal" />
        </div>

        {/* Title */}
        <h3 className="text-darkTeal text-sm font-medium mb-2">{title}</h3>

        {/* Value */}
        <p className="text-3xl font-bold text-darkTeal mb-1">{value}</p>

        {/* Subtitle */}
        {subtitle && <p className="text-darkTeal/70 text-xs">{subtitle}</p>}
      </div>
    </div>
  );
}
