"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TrafficChart } from "@/components/dashboard/TrafficChart";
import { TopPagesChart } from "@/components/dashboard/TopPagesChart";
import { DevicesChart } from "@/components/dashboard/DevicesChart";
import { TrafficSourceChart } from "@/components/dashboard/TrafficSourceChart";

interface AnalyticsData {
  totalPageviews: number;
  totalWhatsapp: number;
  totalLeads: number;
  conversionRate: string;
  timeline: { date: string; pageviews: number; whatsapp: number; leads: number }[];
  devices: { device: string; views: number }[];
  topPages: { page: string; views: number }[];
  sources: { channel: string; sessions: number }[];
}

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "30 dias", value: 30 },
  { label: "90 dias", value: 90 },
];

export default function Dashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/analytics?days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [days]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f7fc" }}>
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <Image
            src="https://www.alphafono.com.br/wp-content/uploads/2021/06/logo-site-alphafono.png"
            alt="Alphafono"
            width={140}
            height={40}
            style={{ objectFit: "contain", height: "36px", width: "auto" }}
            unoptimized
          />
          <span className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
            Ao vivo
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Nav tabs */}
        <div className="flex gap-2">
          <span
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#457ee7", color: "#fff", boxShadow: "0 2px 8px rgba(69,126,231,0.3)" }}
          >
            Analytics
          </span>
          <Link
            href="/seo"
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }}
          >
            SEO
          </Link>
          <Link
            href="/operacao"
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }}
          >
            Operação
          </Link>
        </div>

        {/* Period selector */}
        <div className="flex gap-2">
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setDays(p.value)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                days === p.value
                  ? { backgroundColor: "#457ee7", color: "#fff", boxShadow: "0 2px 8px rgba(69,126,231,0.3)" }
                  : { backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16 text-sm" style={{ color: "#457ee7" }}>
            Carregando dados...
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-red-500 text-sm">Erro: {error}</div>
        )}

        {data && !loading && (
          <>
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-3">
              <KpiCard
                title="Pageviews"
                value={data.totalPageviews.toLocaleString("pt-BR")}
                description={`Últimos ${days} dias`}
                icon="👁️"
                accent="#457ee7"
                accentBg="#eef3fd"
              />
              <KpiCard
                title="WhatsApp"
                value={data.totalWhatsapp.toLocaleString("pt-BR")}
                description="Cliques no botão"
                icon="💬"
                accent="#25d366"
                accentBg="#e8f9ee"
              />
              <KpiCard
                title="Conversão"
                value={data.conversionRate}
                suffix="%"
                description="Visitas → WhatsApp"
                icon="📈"
                accent="#3e72d0"
                accentBg="#eef3fd"
              />
              <KpiCard
                title="Leads"
                value={(data.totalLeads ?? 0).toLocaleString("pt-BR")}
                description="Evento generate_lead"
                icon="🎯"
                accent="#f59e0b"
                accentBg="#fef9ec"
              />
            </div>

            {/* Traffic timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Tráfego ao longo do tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <TrafficChart data={data.timeline} />
              </CardContent>
            </Card>

            {/* Traffic sources */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Canais de origem
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <TrafficSourceChart data={data.sources} />
              </CardContent>
            </Card>

            {/* Top pages */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Páginas mais visitadas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <TopPagesChart data={data.topPages} />
              </CardContent>
            </Card>

            {/* Devices */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Dispositivos
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <DevicesChart data={data.devices} />
              </CardContent>
            </Card>
          </>
        )}

        <p className="text-center text-xs pb-4" style={{ color: "#aaa" }}>
          Dados via Google Analytics · Daedalus
        </p>
      </div>
    </div>
  );
}
