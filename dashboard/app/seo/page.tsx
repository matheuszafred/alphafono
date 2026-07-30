"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { SeoTimelineChart } from "@/components/dashboard/SeoTimelineChart";
import { SeoQueriesTable } from "@/components/dashboard/SeoQueriesTable";

interface GscData {
  clicks: number;
  impressions: number;
  ctr: string;
  position: string;
  topPages: { page: string; clicks: number; impressions: number; position: number }[];
  topQueries: { query: string; clicks: number; impressions: number; position: number }[];
  timeline: { date: string; clicks: number; impressions: number }[];
}

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "28 dias", value: 28 },
  { label: "90 dias", value: 90 },
];

export default function SeoPage() {
  const [data, setData] = useState<GscData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(28);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/search-console?days=${days}`)
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
          <Link
            href="/"
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }}
          >
            Analytics
          </Link>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#457ee7", color: "#fff", boxShadow: "0 2px 8px rgba(69,126,231,0.3)" }}
          >
            SEO
          </span>
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
            Carregando dados do Search Console...
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
                title="Cliques"
                value={data.clicks.toLocaleString("pt-BR")}
                description={`Últimos ${days} dias`}
                icon="🖱️"
                accent="#457ee7"
                accentBg="#eef3fd"
              />
              <KpiCard
                title="Impressões"
                value={data.impressions.toLocaleString("pt-BR")}
                description="Aparições no Google"
                icon="👁️"
                accent="#8b5cf6"
                accentBg="#f3f0ff"
              />
              <KpiCard
                title="CTR"
                value={data.ctr}
                suffix="%"
                description="Taxa de clique"
                icon="📊"
                accent="#f59e0b"
                accentBg="#fef9ec"
              />
              <KpiCard
                title="Posição Média"
                value={`#${data.position}`}
                description="Ranking médio"
                icon="🎯"
                accent="#22c55e"
                accentBg="#f0fdf4"
              />
            </div>

            {/* Timeline */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Cliques e Impressões ao longo do tempo
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <SeoTimelineChart data={data.timeline} />
              </CardContent>
            </Card>

            {/* Top Queries */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Top Queries
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <SeoQueriesTable data={data.topQueries} title="Palavras-chave" />
              </CardContent>
            </Card>

            {/* Top Pages */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Top Páginas
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <SeoQueriesTable data={data.topPages.map(p => ({ ...p, query: p.page }))} title="Páginas por cliques" />
              </CardContent>
            </Card>
          </>
        )}

        <p className="text-center text-xs pb-4" style={{ color: "#aaa" }}>
          Dados via Google Search Console · Daedalus
        </p>
      </div>
    </div>
  );
}
