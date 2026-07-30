"use client";

import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  description?: string;
  icon: string;
  accent: string;
  accentBg: string;
}

export function KpiCard({ title, value, suffix, description, icon, accent, accentBg }: KpiCardProps) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "#888" }}>{title}</p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-2xl font-bold" style={{ color: "#282828" }}>{value}</span>
              {suffix && <span className="text-sm" style={{ color: "#888" }}>{suffix}</span>}
            </div>
            {description && (
              <p className="mt-1 text-xs truncate max-w-[110px]" style={{ color: "#aaa" }}>{description}</p>
            )}
          </div>
          <div
            className="text-2xl p-2 rounded-lg flex-shrink-0"
            style={{ backgroundColor: accentBg, border: `1px solid ${accent}22` }}
          >
            {icon}
          </div>
        </div>
        <div className="mt-3 h-0.5 rounded-full" style={{ backgroundColor: accentBg }}>
          <div className="h-full w-1/3 rounded-full" style={{ backgroundColor: accent }} />
        </div>
      </CardContent>
    </Card>
  );
}
