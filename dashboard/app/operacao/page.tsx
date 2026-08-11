"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { LeadsTimelineChart } from "@/components/dashboard/LeadsTimelineChart";
import { LeadOriginChart } from "@/components/dashboard/LeadOriginChart";
import { LeadFunnel } from "@/components/dashboard/LeadFunnel";

interface OperacaoData {
  leadsPeriodo: number;
  leadsHoje: number;
  baseTotal: number;
  ativosPeriodo: number;
  byDay: { date: string; leads: number }[];
  byOrigin: { origin: string; label: string; leads: number }[];
  byStage: { stage: string; label: string; leads: number; pct: number }[];
}

const PERIODS = [
  { label: "7 dias", value: 7 },
  { label: "28 dias", value: 28 },
  { label: "90 dias", value: 90 },
];

export default function OperacaoPage() {
  const [data, setData] = useState<OperacaoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(28);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/operacao?days=${days}`)
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
          <Link
            href="/seo"
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{ backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }}
          >
            SEO
          </Link>
          <span
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#25d366", color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}
          >
            Operação
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
                  ? { backgroundColor: "#25d366", color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }
                  : { backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }
              }
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-16 text-sm" style={{ color: "#25d366" }}>
            Carregando leads do WhatsApp...
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
                title="Leads no período"
                value={data.leadsPeriodo.toLocaleString("pt-BR")}
                description={`Últimos ${days} dias`}
                icon="💬"
                accent="#25d366"
                accentBg="#f0fdf4"
              />
              <KpiCard
                title="Novos hoje"
                value={data.leadsHoje.toLocaleString("pt-BR")}
                description="Primeiro contato hoje"
                icon="🔔"
                accent="#457ee7"
                accentBg="#eef3fd"
              />
              <KpiCard
                title="Conversas ativas"
                value={data.ativosPeriodo.toLocaleString("pt-BR")}
                description="Falaram no período"
                icon="🔄"
                accent="#8b5cf6"
                accentBg="#f3f0ff"
              />
              <KpiCard
                title="Base total"
                value={data.baseTotal.toLocaleString("pt-BR")}
                description="Desde o início"
                icon="📇"
                accent="#f59e0b"
                accentBg="#fef9ec"
              />
            </div>

            {/* Leads por dia */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Leads por dia
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <LeadsTimelineChart data={data.byDay} />
              </CardContent>
            </Card>

            {/* Origem */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  De onde vieram
                </CardTitle>
              </CardHeader>
              <CardContent className="px-2 pb-4">
                <LeadOriginChart data={data.byOrigin} />
              </CardContent>
            </Card>

            {/* Funil */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <CardTitle className="text-sm font-semibold" style={{ color: "#282828" }}>
                  Funil de atendimento
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <LeadFunnel data={data.byStage} />
              </CardContent>
            </Card>
          </>
        )}

        <p className="text-center text-xs pb-4" style={{ color: "#aaa" }}>
          Leads do WhatsApp via Supabase · Daedalus
        </p>
      </div>
    </div>
  );
}
