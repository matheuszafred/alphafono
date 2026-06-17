# Relatório de Correções — alphafono.com.br
**Data:** 17/06/2026  
**Preparado por:** Matheus Zafred — Daedalus  
**Para:** Administrador do site / Equipe Alphafono

---

## Resumo Executivo

Realizamos uma auditoria técnica completa do site alphafono.com.br. Identificamos **3 correções prioritárias** que impactam diretamente o desempenho do site no Google — todas **sem nenhum risco para o SEO atual**.

As correções são simples, rápidas e **não alteram nenhum conteúdo** (textos, URLs, artigos do blog ou estrutura de páginas) — apenas corrigem erros técnicos já existentes.

---

## Por que essas correções são seguras para o SEO?

Tudo que protege o posicionamento atual do site permanece intocado:
- ✅ URLs e slugs de todas as páginas mantidos
- ✅ Textos dos artigos ranqueados mantidos
- ✅ Títulos e meta descriptions mantidos
- ✅ Estrutura de headings (H1/H2/H3) mantida
- ✅ Links internos mantidos

---

## Correções necessárias

### 🔴 Correção 1 — Links quebrados no rodapé (impacto crítico de SEO)

**Problema:**  
O bloco "Onde Atendemos" no rodapé do site contém 11 links com um erro técnico: há um espaço em branco antes do endereço de cada link. Isso faz com que o Google não consiga seguir esses links corretamente, prejudicando o posicionamento das páginas de localidade no Google.

**Páginas afetadas:**
- Fonoaudiologia em Osasco
- Fonoaudiologia em Barueri
- Fonoaudiologia em Aldeia da Serra
- Fonoaudiologia em Santana de Parnaíba
- Fonoaudiologia em Cotia
- Fonoaudiologia em Cajamar
- Fonoaudiologia em Jordanésia
- Psicopedagogia em Osasco
- Psicopedagogia em Jundiaí
- Psicopedagogia em Barueri
- Psicopedagogia em Cotia

**O que precisa ser feito:**  
No painel WordPress → **Aparência → Widgets → "Onde Atendemos"** → editar o HTML e remover o espaço antes de cada `https://` nos links.

**Impacto esperado após a correção:**  
O Google passa a reconhecer e seguir esses links corretamente. As páginas de localidade ganham força de SEO, podendo melhorar o posicionamento para buscas como "fonoaudiologia em Barueri", "fonoaudiologia em Osasco" etc.  
Resultado visível em: **2 a 4 semanas** (tempo de reindexação do Google).

---

### 🔴 Correção 2 — Flash de tela branca no carregamento (impacto em conversão e SEO)

**Problema:**  
Ao carregar a página inicial, o visitante vê uma **tela em branco por 1 a 2 segundos** antes do banner principal aparecer. Isso ocorre por um conflito de CSS no slider (FlexSlider). Além de prejudicar a experiência do visitante, afeta negativamente uma métrica de SEO chamada LCP (Largest Contentful Paint), que o Google usa para avaliar a velocidade do site.

**O que precisa ser feito:**  
No painel WordPress → **Aparência → Personalizar → CSS Adicional** → adicionar o seguinte código:

```css
.flexslider .slides > li:first-child {
  display: block;
}
```

**Impacto esperado após a correção:**  
O banner aparece imediatamente no carregamento, eliminando a tela branca. Melhora a experiência do visitante e o score de performance do site no Google.

---

### 🟡 Correção 3 — Copyright desatualizado (impacto de credibilidade)

**Problema:**  
O rodapé do site exibe `© 2014 - 2021 AlphaFono`, indicando que o site não é atualizado desde 2021 — o que pode gerar desconfiança em visitantes.

**O que precisa ser feito:**  
No painel WordPress → **Aparência → Widgets → área do rodapé** → localizar o texto com o copyright e atualizar para `© 2014 - 2026 AlphaFono`.

---

## Como prosseguir

Há duas formas de executar essas correções:

**Opção A — Liberar acesso de editor ao painel WordPress**  
Conceder acesso ao nosso time para executar diretamente. Estimativa: **menos de 30 minutos** para as 3 correções.

**Opção B — Executar com o administrador atual do site**  
Podemos agendar uma chamada rápida (15-20 min) e guiar o administrador passo a passo em cada correção.

---

## Resultado esperado

Após as correções, as métricas de SEO local (cliques e posição das páginas de localidade) devem melhorar nas próximas semanas. Já temos um dashboard ativo monitorando esses dados em tempo real:

👉 **[alphafono-dashboard.vercel.app/seo](https://alphafono-dashboard.vercel.app/seo)**

Qualquer dúvida, estamos à disposição.

**Matheus Zafred**  
Daedalus — matheus@daedalustech.io
