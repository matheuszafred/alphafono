"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Desenho desta tela parte de duas restrições, não de gosto:
//   1. A secretária não tem familiaridade com computador → alvo de toque grande,
//      rótulo curto, nenhuma digitação, nenhum menu escondido.
//   2. Classificar tem que custar 2 segundos, não 30 → os botões de estágio ficam
//      sempre visíveis no cartão; nada de abrir modal para depois escolher.
// O resto do painel é max-w-2xl e usada no celular; aqui é a mesma coisa, só que
// esta é a única tela em que ela realmente TRABALHA, não consulta.

const VERDE = "#25d366";
const ARDOSIA = "#64748b";

type Stage = "novo" | "em_atendimento" | "agendado" | "compareceu" | "perdido";
type LossReason =
  | "convenio"
  | "sumiu_apos_preco"
  | "comparou_preco"
  | "prazo"
  | "fora_escopo"
  | "nao_e_lead"
  | "outro";
type Interest =
  | "pac"
  | "audiometria"
  | "fono_infantil"
  | "fono_adulto"
  | "terapia_auditiva"
  | "teste_orelhinha"
  | "bera"
  | "disfagia"
  | "home_care"
  | "outro";

interface Lead {
  id: string;
  phone: string;
  name: string | null;
  origin: string;
  originLabel: string;
  stage: Stage;
  lossReason: LossReason | null;
  interest: Interest | null;
  lastSeen: string;
  diasParado: number;
}

interface CrmData {
  leads: Lead[];
  totalRetornar: number;
  totalAbertos: number;
}

const ESTAGIOS: { value: Stage; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "em_atendimento", label: "Atendendo" },
  { value: "agendado", label: "Agendou" },
  { value: "compareceu", label: "Compareceu" },
  { value: "perdido", label: "Perdeu" },
];

const MOTIVOS: { value: LossReason; label: string }[] = [
  { value: "convenio", label: "Queria convênio" },
  { value: "sumiu_apos_preco", label: "Sumiu após o preço" },
  { value: "comparou_preco", label: "Foi ver preço" },
  { value: "prazo", label: "Prazo não deu" },
  { value: "fora_escopo", label: "Não atendemos" },
  { value: "nao_e_lead", label: "Não é paciente" },
  { value: "outro", label: "Outro" },
];

const PROCURAS: { value: Interest; label: string }[] = [
  { value: "pac", label: "PAC" },
  { value: "audiometria", label: "Audiometria" },
  { value: "fono_infantil", label: "Fono infantil" },
  { value: "fono_adulto", label: "Fono adulto" },
  { value: "terapia_auditiva", label: "Terapia auditiva" },
  { value: "teste_orelhinha", label: "Teste da orelhinha" },
  { value: "bera", label: "BERA" },
  { value: "disfagia", label: "Disfagia" },
  { value: "home_care", label: "Home care" },
  { value: "outro", label: "Outro" },
];

const FILTROS = [
  { value: "retornar", label: "Retornar" },
  { value: "abertos", label: "Em aberto" },
  { value: "todos", label: "Todos" },
] as const;

/** 5511912345678 → (11) 91234-5678. Sem o 55 o número fica legível para ela. */
function formatarTelefone(phone: string): string {
  const d = phone.replace(/\D/g, "").replace(/^55/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return phone;
}

function textoParado(dias: number): string {
  if (dias <= 0) return "hoje";
  if (dias === 1) return "1 dia";
  return `${dias} dias`;
}

/** Botão de toque grande. Altura mínima de 44px é o alvo confortável no celular. */
function Chip({
  label,
  ativo,
  cor = VERDE,
  onClick,
  disabled,
}: {
  label: string;
  ativo: boolean;
  cor?: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={ativo}
      className="px-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
      style={{
        minHeight: "44px",
        backgroundColor: ativo ? cor : "#fff",
        color: ativo ? "#fff" : "#475569",
        border: ativo ? `1px solid ${cor}` : "1px solid #e2e8f0",
        boxShadow: ativo ? `0 2px 8px ${cor}40` : "none",
      }}
    >
      {label}
    </button>
  );
}

export default function CrmPage() {
  const [data, setData] = useState<CrmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["value"]>("retornar");
  const [salvando, setSalvando] = useState<string | null>(null);
  const [abrirProcura, setAbrirProcura] = useState<string | null>(null);

  // `vivo` evita corrida: trocar de filtro depressa dispara duas buscas, e sem o
  // cancelamento a mais lenta poderia sobrescrever a mais nova na tela.
  const carregar = useCallback(async (vivo: () => boolean = () => true) => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`/api/crm?filtro=${filtro}`);
      const d = await r.json();
      if (!vivo()) return;
      if (d.error) throw new Error(d.error);
      setData(d);
    } catch (e) {
      if (vivo()) setError(e instanceof Error ? e.message : "Erro ao carregar");
    } finally {
      if (vivo()) setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    let ativo = true;
    void carregar(() => ativo);
    return () => {
      ativo = false;
    };
  }, [carregar]);

  /**
   * Classifica com atualização otimista: a tela muda na hora e só depois confirma
   * com o servidor. Se falhar, volta ao valor anterior e mostra o erro — nunca
   * deixa a secretária achar que salvou quando não salvou.
   */
  async function classificar(lead: Lead, patch: Partial<Pick<Lead, "stage" | "lossReason" | "interest">>) {
    const anterior = data;
    if (!anterior) return;

    // Espelha aqui a mesma regra do servidor: sair de "perdeu" limpa o motivo.
    const otimista: Lead = { ...lead, ...patch };
    if (patch.stage !== undefined && patch.stage !== "perdido") otimista.lossReason = null;

    setData({ ...anterior, leads: anterior.leads.map((l) => (l.id === lead.id ? otimista : l)) });
    setSalvando(lead.id);
    setError(null);

    try {
      const r = await fetch("/api/crm", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: lead.id, ...patch }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error ?? "Não foi possível salvar");

      setData((atual) =>
        atual
          ? { ...atual, leads: atual.leads.map((l) => (l.id === lead.id ? j.lead : l)) }
          : atual,
      );
    } catch (e) {
      setData(anterior);
      setError(e instanceof Error ? e.message : "Não foi possível salvar");
    } finally {
      setSalvando(null);
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f4f7fc" }}>
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
          <span
            className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: "#f1f5f9", color: ARDOSIA, border: "1px solid #e2e8f0" }}
          >
            Atendimento
          </span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        <div className="flex gap-2 flex-wrap">
          {[
            { href: "/", label: "Analytics" },
            { href: "/seo", label: "SEO" },
            { href: "/operacao", label: "Operação" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{ backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }}
            >
              {t.label}
            </Link>
          ))}
          <span
            className="px-4 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: VERDE, color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}
          >
            CRM
          </span>
        </div>

        {/* O número do dia. É a primeira coisa que ela vê ao abrir. */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold" style={{ color: data?.totalRetornar ? VERDE : ARDOSIA }}>
              {data?.totalRetornar ?? "–"}
            </span>
            <span className="text-base text-gray-600">
              {data?.totalRetornar === 1 ? "pessoa para retornar" : "pessoas para retornar"}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Sem responder há 3 dias ou mais · {data?.totalAbertos ?? 0} em aberto no total
          </p>
        </div>

        <div className="flex gap-2">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltro(f.value)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={
                filtro === f.value
                  ? { backgroundColor: VERDE, color: "#fff", boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }
                  : { backgroundColor: "#fff", color: "#555", border: "1px solid #e2e8f0" }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {error && (
          <div
            className="rounded-xl px-4 py-3 text-sm"
            style={{ backgroundColor: "#fef2f2", color: "#b91c1c", border: "1px solid #fecaca" }}
          >
            {error}
            <button onClick={() => void carregar()} className="ml-2 underline font-medium">
              Tentar de novo
            </button>
          </div>
        )}

        {loading && <div className="text-center py-16 text-sm" style={{ color: VERDE }}>Carregando…</div>}

        {!loading && data?.leads.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <p className="text-base font-medium text-gray-700">Nada para retornar agora</p>
            <p className="text-sm text-gray-500 mt-1">Todo mundo em dia. 👏</p>
          </div>
        )}

        {!loading &&
          data?.leads.map((lead) => {
            const perdido = lead.stage === "perdido";
            const ocupado = salvando === lead.id;

            return (
              <div
                key={lead.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3"
                style={{ opacity: ocupado ? 0.65 : 1, transition: "opacity .15s" }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {lead.name || formatarTelefone(lead.phone)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lead.name ? `${formatarTelefone(lead.phone)} · ` : ""}
                      {lead.originLabel}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium px-2 py-1 rounded-full shrink-0"
                    style={
                      lead.diasParado >= 7
                        ? { backgroundColor: "#fef3c7", color: "#92400e" }
                        : { backgroundColor: "#f1f5f9", color: ARDOSIA }
                    }
                  >
                    {textoParado(lead.diasParado)}
                  </span>
                </div>

                {/* Ação principal: abrir a conversa. É o que ela faz de verdade. */}
                <a
                  href={`https://wa.me/${lead.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ minHeight: "48px", backgroundColor: VERDE, boxShadow: "0 2px 8px rgba(37,211,102,0.3)" }}
                >
                  Abrir conversa no WhatsApp
                </a>

                <div>
                  <p className="text-xs text-gray-500 mb-1.5">O que aconteceu?</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {ESTAGIOS.map((e) => (
                      <Chip
                        key={e.value}
                        label={e.label}
                        ativo={lead.stage === e.value}
                        cor={e.value === "perdido" ? ARDOSIA : VERDE}
                        disabled={ocupado}
                        onClick={() => classificar(lead, { stage: e.value })}
                      />
                    ))}
                  </div>
                </div>

                {perdido && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1.5">Por quê?</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {MOTIVOS.map((m) => (
                        <Chip
                          key={m.value}
                          label={m.label}
                          ativo={lead.lossReason === m.value}
                          cor={ARDOSIA}
                          disabled={ocupado}
                          onClick={() => classificar(lead, { lossReason: m.value })}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Procura fica recolhida: é útil para o relatório, mas não pode
                    competir com o estágio pelo polegar dela. */}
                <div>
                  <button
                    type="button"
                    onClick={() => setAbrirProcura(abrirProcura === lead.id ? null : lead.id)}
                    className="text-xs text-gray-500 underline"
                  >
                    {lead.interest
                      ? `Procura: ${PROCURAS.find((p) => p.value === lead.interest)?.label}`
                      : "O que essa pessoa procura?"}
                  </button>

                  {abrirProcura === lead.id && (
                    <div className="grid grid-cols-2 gap-1.5 mt-2">
                      {PROCURAS.map((p) => (
                        <Chip
                          key={p.value}
                          label={p.label}
                          ativo={lead.interest === p.value}
                          disabled={ocupado}
                          onClick={() => classificar(lead, { interest: p.value })}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
