# Auditoria Completa do DOM — alphafono.com.br

> **Data:** 17/06/2026  
> **Modo:** Somente leitura — nenhuma edição ou clique em conteúdo editável foi realizado.  
> **Tema WordPress:** CI Medi (ci-medi v1.7.1) + Elementor (kit-1880)  
> **Plugins relevantes:** FlexSlider (jQuery), QLWapp (WhatsApp), MMenu.js (menu mobile), Akismet  

---

## 1. Hero Section — Slider/Banner

### Estrutura HTML

```html
<div id="home-slider-container">
  <div id="home-slider" class="flexslider">
    <div class="flex-viewport">
      <ul class="slides">   <!-- 14 slides reais + 2 clones = 16 li no DOM -->

        <li class="clone">  <!-- clone gerado pelo FlexSlider para loop infinito -->
          <img src="/wp-content/uploads/2014/04/destaque-alphafono-3-1920x550.jpg"
               class="attachment-ci_slider size-ci_slider wp-post-image"
               alt="" decoding="async"
               srcset="...1920w, ...1024w, ...768w, ...300w"
               sizes="(max-width: 1920px) 100vw, 1920px">
          <div class="slide-content">
            <h3>30 anos</h3>
            <div class="controls">
              <a class="s-prev" href="#"><i class="fa fa-chevron-left"></i></a>
              <a class="sld-btn" href="https://www.alphafono.com.br/depoimentos-em-videos/"></a>
              <a class="s-next" href="#"><i class="fa fa-chevron-right"></i></a>
            </div>
          </div>
        </li>

        <!-- 14 slides normais — apenas slides 0 e 1 têm h3 e sld-btn preenchidos -->
        <!-- Slides 2 a 13 têm <h3></h3> vazio e sld-btn href="" vazio -->

        <li class="clone">  <!-- clone de início -->...</li>
      </ul>
    </div>
    <ol class="flex-control-nav flex-control-paging">
      <!-- 14 bolinhas de navegação geradas automaticamente -->
    </ol>
  </div>
</div>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `#home-slider-container` | Container externo (sem classe própria) |
| `#home-slider.flexslider` | Plugin jQuery FlexSlider |
| `.flex-viewport` | Janela visível do slider (`overflow:hidden`) |
| `ul.slides` | Lista de slides; animada via `transform: matrix()` |
| `li.flex-active-slide` | Slide atualmente ativo |
| `li.clone` | 2 slides clonados pelo FlexSlider para loop infinito |
| `.slide-content` | Overlay com título e controles |
| `a.sld-btn` | CTA de cada slide (âncora sem texto visível) |
| `.s-prev / .s-next` | Botões prev/next com ícone FontAwesome |
| `.flex-control-paging` | Bolinhas de navegação (14 ao total) |

### IDs relevantes

- `#home-slider-container` — container pai
- `#home-slider` — instância do FlexSlider

### Problemas identificados

**🔴 Flash de tela branca no carregamento:**
O CSS do tema define `.flexslider .slides > li { display: none }` por padrão. O JavaScript do FlexSlider precisa inicializar para exibir o slide ativo. Enquanto o JS não executa, toda a área do slider fica em branco (fundo branco de `.flexslider { background: #fff }`). Reproduzido no primeiro screenshot da auditoria.

**🟠 11 de 14 slides sem CTA e sem título:**
Apenas os slides de índice 0, 1 e 8 possuem `<h3>` com texto e `.sld-btn` com href preenchido. Os demais 11 slides têm:
```html
<div class="slide-content">
  <h3></h3>  <!-- vazio -->
  <div class="controls">
    <a class="sld-btn" href=""></a>  <!-- href vazio -->
  </div>
</div>
```

**🟡 14 slides é excessivo:** O `flex-control-paging` gera 14 bolinhas de navegação sobrepostas na imagem.

**✅ Imagens:** Todas as 14 imagens carregaram corretamente (`naturalWidth: 1534px`). Nenhuma imagem quebrada.

---

## 2. Cards de Especialidades

### Estrutura HTML

```html
<section class="home-wgt-area">
  <div class="row">

    <!-- Card 1 -->
    <div id="ci_service_widget-2" class="widget widget_ci_service_widget three columns">
      <div id="service-126" class="post-126 service type-service status-publish has-post-thumbnail hentry">
        <div class="widget ci_widget_item_widget">
          <a href="https://www.alphafono.com.br/service/processamento-auditivo/" class="item-thumb">
            <img src="/wp-content/uploads/2014/04/gg1-780x780.jpg"
                 class="attachment-ci_thumb size-ci_thumb wp-post-image"
                 alt="Fono que atua com distúrbio de aprendizagem..."
                 decoding="async"
                 srcset="...780w, ...480w, ...150w, ...100w">
            <h3>Processamento auditivo</h3>
            <!-- position:absolute; bottom:0; left:0; right:0;
                 background:rgba(69,126,231,0.7); color:#fff; padding:20px 15px -->
          </a>
          <p>A terminologia processamento auditivo refere-se a o que fazemos com o que ouvimos.</p>
        </div>
      </div>
    </div>

    <!-- Card 2 -->
    <div id="ci_service_widget-10" class="widget widget_ci_service_widget three columns">
      <!-- img: /wp-content/uploads/2014/04/1-780x780.png | naturalWidth: 780px ✅ -->
      <!-- Título: Transtornos de leitura e escrita -->
    </div>

    <!-- Card 3 -->
    <div id="ci_service_widget-9" class="widget widget_ci_service_widget three columns">
      <!-- img: /wp-content/uploads/2014/04/disfluencia-Alphafono-780x780.png | naturalWidth: 780px ✅ -->
      <!-- Título: Disfluência -->
    </div>

    <!-- Card 4 -->
    <div id="ci_service_widget-11" class="widget widget_ci_service_widget three columns">
      <!-- img: /wp-content/uploads/2014/04/linguagem-Alphafono-780x780.png | naturalWidth: 780px ✅ -->
      <!-- Título: Fala e linguagem -->
    </div>

  </div>
</section>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `.home-wgt-area` | Section de fundo branco |
| `.widget_ci_service_widget` | Widget do tipo "service" do tema CI |
| `.three.columns` | Grid do tema — 4 colunas de 3 unidades (12/12) |
| `.widget.ci_widget_item_widget` | Container interno do widget |
| `a.item-thumb` | Link-wrapper da imagem; `position:relative; display:block` |
| `.item-thumb h3` | Título sobreposto na imagem — `position:absolute; bottom:0` |

### IDs relevantes

| ID | Especialidade |
|---|---|
| `#ci_service_widget-2` | Processamento auditivo |
| `#ci_service_widget-10` | Transtornos de leitura e escrita |
| `#ci_service_widget-9` | Disfluência |
| `#ci_service_widget-11` | Fala e linguagem |
| `#service-126`, `#service-128`, `#service-132`, `#service-133` | IDs dos posts WordPress internos |

### Problemas identificados

**✅ Imagens:** Todos os 4 cards carregaram corretamente (`naturalWidth: 780px`). Nenhuma imagem quebrada.

**🟡 "Ghost text" visível nas imagens** (ex: "Disfluência", "Escrita", "Linguagem" como watermark): Este texto está **embutido nas próprias imagens PNG** — é um efeito artístico da imagem, não um bug de HTML/CSS.

**🟡 Alt text inconsistente:** O card `#ci_service_widget-2` tem `alt` preenchido com texto de SEO em vez de descrição da imagem. Os demais cards têm variações.

---

## 3. CTA Principal — WhatsApp no Hero

### Estrutura HTML

```html
<!-- Posicionado fora do #page, fixo no canto inferior direito -->
<div class="qlwapp"
     data-contacts='{"phone":"5511981670889", ...}'
     data-button='{"layout":"button","position":"bottom-right","text":"Como posso te ajudar?",
                   "message":"Olá! Estou no site da Alphafono e preciso tirar uma dúvida.",
                   "phone":"5511981670889","rounded":"yes","whatsapp_link_type":"web",...}'
     style="--qlwapp-scheme-brand:#19ba10; --qlwapp-scheme-icon-size:60px; ...">

  <div class="qlwapp__container qlwapp__container--bottom-right qlwapp__container--rounded">
    <a role="button" tabindex="0" class="qlwapp__button qlwapp__button--button">
      <!-- SEM href no HTML — acionado apenas via JavaScript -->
      <i class="qlwapp__icon qlwapp-whatsapp-icon"></i>
      <span class="qlwapp__text">Como posso te ajudar?</span>
    </a>
  </div>

</div>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `.qlwapp` | Container raiz do plugin QLWapp |
| `.qlwapp__container--bottom-right` | Posicionamento fixo canto inferior direito |
| `.qlwapp__container--rounded` | Bordas arredondadas |
| `.qlwapp__button` | Botão flutuante (`position:fixed; bottom:0; right:0`) |
| `.qlwapp__icon.qlwapp-whatsapp-icon` | Ícone SVG do WhatsApp |
| `.qlwapp__text` | Texto "Como posso te ajudar?" |

### Problemas identificados

**🟠 Não há CTA de WhatsApp dentro do Hero.** O botão é um widget flutuante global do plugin QLWapp, presente em todas as páginas — não está integrado ao slider ou ao hero.

**🟠 Link sem `href` no HTML:** O `<a class="qlwapp__button">` tem `role="button"` mas **sem atributo `href`** — o link é acionado 100% por JavaScript. Se o JS falhar ou for bloqueado, o botão fica inacessível.

**✅ Telefone configurado corretamente:** `5511981670889` — consistente com o número exibido no topo do site.

---

## 4. Seção "Gostaríamos de cuidar de você"

### Estrutura HTML completa

```html
<section class="home-wgt-area">
  <!-- background: rgb(247,246,246); padding: 60px 0; height: ~196px -->
  <div class="row">

    <div id="ci_callout_widget-3" class="widget widget_ci_callout_widget twelve columns">
      <h3 class="widget-title">
        <span>Gostaríamos muito de cuidar de você</span>
      </h3>
      <p>Você pode nos contatar clicando no botão ao lado.</p>
      <a class="btn callout" href="https://www.alphafono.com.br/contato/">
        <span>Contatar</span>
      </a>
    </div>

  </div>
</section>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `.home-wgt-area` | Section — `background: rgb(247,246,246)`; `padding: 60px 0` |
| `.widget_ci_callout_widget` | Tipo callout do tema CI |
| `.twelve.columns` | Grid full-width (12/12) |
| `a.btn.callout` | Botão CTA de contato |

### IDs relevantes

- `#ci_callout_widget-3` — ID único do widget callout

### Problemas identificados

**🟠 CTA aponta para `/contato/` e não para WhatsApp** — perdendo oportunidade de conversão direta.

**🟡 Texto desatualizado:** "clicando no botão ao lado" — em mobile o botão não fica "ao lado", fica abaixo.

**🟡 Section sem ID** — impossível criar âncora de link direto para esta seção.

---

## 5. Seção Equipe

### Estrutura HTML

```html
<section class="home-wgt-area">
  <div class="row">

    <!-- Coluna 1: Nosso Diferencial -->
    <div id="text-7" class="widget widget_text three columns">
      <h3 class="widget-title"><span>Nosso diferencial</span></h3>
      <div class="textwidget">
        <p>Possuímos mais de 30 anos de sucesso!...</p>
      </div>
    </div>

    <!-- Coluna 2: Parceria -->
    <div id="text-16" class="widget widget_text three columns">
      <h3 class="widget-title"><span>Parceria</span></h3>
      <div class="textwidget">A Alphafono é uma empresa especializada...</div>
    </div>

    <!-- Coluna 3: Conheça nossa equipe (texto introdutório) -->
    <div id="text-13" class="widget widget_text three columns">
      <h3 class="widget-title"><span>Conheça nossa equipe</span></h3>
      <div class="textwidget">Somos apaixonados por nossa missão...</div>
    </div>

    <!-- Coluna 4: Widget de Personnel — única profissional -->
    <div id="ci_personnel_widget-2" class="widget widget_ci_personnel_widget three columns">
      <div id="person-124" class="post-124 personnel type-personnel
           status-publish has-post-thumbnail hentry">
        <div class="widget ci_widget_item_widget">

          <a href="https://www.alphafono.com.br/personnel/giovana-micheli/" class="item-thumb">
            <!-- position:relative; display:block; width:290px; height:290px -->

            <img src="/wp-content/uploads/2014/04/gg3-780x780.jpg"
                 class="attachment-ci_thumb size-ci_thumb wp-post-image"
                 alt=""
                 decoding="async"
                 srcset="...780w, ...480w, ...150w, ...100w">

            <h3>Dra. Giovana Micheli</h3>
            <!--
              position: absolute
              bottom: 0; left: 0; right: 0
              background: rgba(69, 126, 231, 0.7)
              color: #fff
              padding: 20px 15px
              ➜ Nome sobrepõe a parte inferior da foto
            -->
          </a>

          <p>Fonoaudióloga e Psicopedagoga.</p>
          <!-- Texto abaixo da foto, fora do overlay -->

        </div>
      </div>
    </div>

  </div>
</section>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `.widget_ci_personnel_widget` | Widget de profissional do tema CI |
| `.three.columns` | Grid — 4 colunas de 3 unidades |
| `a.item-thumb` | Link-wrapper da foto; `position:relative` |
| `.item-thumb h3` | Nome sobreposto na foto — `position:absolute; bottom:0` |
| `#person-124` | ID do post WordPress do tipo "personnel" |

### IDs relevantes

- `#ci_personnel_widget-2` — widget de personnel na sidebar
- `#person-124` — post interno do tipo `personnel`
- `#text-7`, `#text-16`, `#text-13` — widgets de texto desta seção

### Alinhamento foto/texto

A foto da profissional ocupa uma coluna `.three.columns` (290×290px). O nome `<h3>` está com `position:absolute; bottom:0` — sobrepõe a parte inferior da foto com fundo azul semitransparente. O texto descritivo `<p>` fica abaixo da foto, fora do overlay. Layout vertical dentro da coluna.

### Problemas identificados

**🟠 Apenas 1 profissional exibida** (Dra. Giovana Micheli). Se há mais membros de equipe, não estão sendo exibidos na home.

**🟡 `alt=""` na foto da profissional** — problema de acessibilidade (WCAG 2.1 — critério 1.1.1).

**🟡 Estrutura semântica fraca:** Os 3 primeiros widgets são `widget_text` genéricos — misturados com o widget de personnel sem separação visual ou semântica clara de "seção de equipe".

---

## 6. Menu / Nav Principal

### Estrutura HTML

```html
<header id="header">

  <!-- Barra superior com contatos -->
  <div id="top-head">
    <div class="row">
      <div class="six columns">
        <span>Tel.: (11) 2970 2988 - Whats/Cel.: (11) 98167 0889 - (11) 99460 8548</span>
      </div>
      <div class="six columns"><!-- vazio --></div>
    </div>
  </div>

  <!-- Header principal: Logo + Navegação -->
  <div id="main-head">
    <div class="row">

      <!-- Logo -->
      <div id="logo" class="four columns imglogo">
        <div>
          <a href="https://www.alphafono.com.br/">
            <img src="/wp-content/uploads/2021/06/logo-site-alphafono.png"
                 alt="Alphafono - Clínica de Fonoaudiologia e Psicopedagogia">
          </a>
        </div>
      </div>

      <!-- Navegação -->
      <div class="eight columns">
        <nav id="nav">
          <ul id="navigation" class="group sf-js-enabled sf-arrows">

            <li id="menu-item-1863"
                class="menu-item menu-item-type-post_type menu-item-object-page
                       menu-item-home current-menu-item page_item page-item-100
                       current_page_item menu-item-1863">
              <a href="https://www.alphafono.com.br/" aria-current="page">Home</a>
            </li>

            <li id="menu-item-1872"
                class="menu-item menu-item-type-custom menu-item-object-custom menu-item-1872">
              <a href="https://www.alphafono.com.br/personnel/giovana-micheli/">Sobre</a>
            </li>

            <li id="menu-item-1868"
                class="menu-item menu-item-type-post_type menu-item-object-page
                       menu-item-has-children menu-item-1868">
              <a href="https://www.alphafono.com.br/fullwidth/">Depoimentos</a>
              <ul> <!-- dropdown -->
                <li><a href="/depoimentos-em-videos/">Depoimentos em Vídeos</a></li>
                <li><a href="/fullwidth/">Depoimentos Texto</a></li>
                <li><a href="/galeria-de-imagens-alphafono/">Galeria de Imagens</a></li>
              </ul>
            </li>

            <li id="menu-item-1867"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1867">
              <a href="https://www.alphafono.com.br/especialidades/">Especialidades</a>
            </li>

            <!-- *** CONVÊNIOS *** -->
            <li id="menu-item-1866"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1866">
              <a href="https://www.alphafono.com.br/convenios/">Convênios</a>
            </li>

            <li id="menu-item-1864"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1864">
              <a href="https://www.alphafono.com.br/blog/">Blog</a>
            </li>

            <li id="menu-item-1865"
                class="menu-item menu-item-type-post_type menu-item-object-page menu-item-1865">
              <a href="https://www.alphafono.com.br/contato/">Contato</a>
            </li>

          </ul>
        </nav>
      </div>

    </div>
  </div>

  <!-- Menu Mobile (oculto em desktop) -->
  <div id="mobile-bar" style="display:none">
    <a class="menu-trigger" href="#mobilemenu"></a>
    <div class="mob-title">Alphafono – Clínica de Fonoaudiologia e Psicopedagogia</div>
  </div>

  <div id="mobilemenu" class="mm-menu mm-is-menu mm-horizontal" style="display:none">
    <!-- Menu mobile via plugin MMenu.js -->
  </div>

</header>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `#navigation.sf-js-enabled.sf-arrows` | Superfish jQuery — menu com dropdowns |
| `.menu-item-has-children` | Indica item com submenu |
| `.current-menu-item` | Item ativo (Home) |
| `.mm-menu.mm-is-menu` | MMenu.js — menu mobile |
| `#logo.four.columns.imglogo` | Logo — ocupa 4/12 colunas |
| `.eight.columns` | Navegação — ocupa 8/12 colunas |

### IDs relevantes

| ID | Elemento |
|---|---|
| `#header` | Container do cabeçalho |
| `#top-head` | Barra de contatos |
| `#main-head` | Logo + Navegação |
| `#logo` | Container do logo |
| `#nav` | Container da `<nav>` |
| `#navigation` | `<ul>` do menu principal |
| `#menu-item-1866` | Link **Convênios** |
| `#mobile-bar` | Gatilho do menu mobile |
| `#mobilemenu` | Menu mobile MMenu.js |

### Problemas identificados

**🟡 Link "Sobre" é do tipo `menu-item-type-custom`** apontando diretamente para `/personnel/giovana-micheli/` — não é uma página "Sobre a Clínica".

**🟡 "Depoimentos" abre `/fullwidth/`** — URL sem semântica.

**🟡 Segunda coluna de `#top-head` está vazia** — área desperdiçada que poderia conter CTA de agendamento ou redes sociais.

---

## 7. Footer

### Estrutura HTML completa

```html
<footer id="footer">

  <div class="footer-inner">
    <div class="row">

      <!-- Coluna 1: Localização -->
      <div class="three columns">
        <aside id="text-4" class="widget widget_text group">
          <h3 class="widget-title"><span>Localização</span></h3>
          <div class="textwidget">
            <p>Alphafono – Clinica de Fonoaudiologia e Psicopedagogia |<br>
            Av. Marcos Penteado de Ulhoa Rodrigues, 1119 – Sala 1012 –
            10º Andar – Ed. Office Shopping Tamboré – Barueri – SP.</p>
          </div>
        </aside>
      </div>

      <!-- Coluna 2: Horário + Avalie no Google -->
      <div class="three columns">
        <aside id="text-3" class="widget widget_text group">
          <h3 class="widget-title"><span>Horário de funcionamento</span></h3>
          <div class="textwidget">
            Atendimento Telefônico: segunda a sexta das 8h00 às 20h00 pelo tel.
            (11) 2970 2988, após esse horário agendamento pelo cel. (11) 99460 8548.
            Atendimento terapias: manhã, tarde, noite e sábados.
          </div>
        </aside>
        <aside id="block-2" class="widget widget_block group">
          <h2 class="wp-block-heading">Avalie Nossa Empresa no Google</h2>
        </aside>
        <aside id="block-3" class="widget widget_block widget_text group">
          <p>Para avaliar a Alphafono no Google, é só
            <a href="https://g.page/r/CZSFZ531Eiz7EAg/review">apertar aqui</a>.
          </p>
        </aside>
      </div>

      <!-- Coluna 3: Últimos Posts -->
      <div class="three columns">
        <aside id="recent-posts-3" class="widget widget_recent_entries group">
          <h3 class="widget-title"><span>Últimos posts</span></h3>
          <ul>
            <li>
              <a href="/crianca-que-nao-olha-quando-e-chamada-quando-investigar/">
                Criança que Não Olha Quando é Chamada: Quando Investigar?
              </a>
              <span class="post-date">17/06/2026</span>
            </li>
            <!-- + 4 posts recentes -->
          </ul>
        </aside>
      </div>

      <!-- Coluna 4: Onde Atendemos -->
      <div class="three columns">
        <aside id="text-18" class="widget widget_text group">
          <h3 class="widget-title"><span>Onde Atendemos</span></h3>
          <div class="textwidget">

            <!-- ⚠️ TODOS OS 11 LINKS TÊM ESPAÇO INICIAL NO HREF — BUG CRÍTICO -->
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-osasco/">
              Fonoaudiologia em Osasco</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-barueri/">
              Fonoaudiologia em Barueri</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-aldeia-da-serra/">
              Fonoaudiologia em Aldeia da Serra</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-santana-de-parnaiba/">
              Fonoaudiologia em Santana de Parnaíba</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-cotia/">
              Fonoaudiologia em Cotia</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-cajamar/">
              Fonoaudiologia em Cajamar</a>
            <a href=" https://www.alphafono.com.br/fonoaudiologia-em-jordanesia/">
              Fonoaudiologia em Jordanésia</a>
            <a href=" https://www.alphafono.com.br/psicopedagoga-em-osasco/">
              Psicopedagogia em Osasco</a>
            <a href=" https://www.alphafono.com.br/psicopedagoga-em-jundiai/">
              Psicopedagogia em Jundiaí</a>
            <a href=" https://www.alphafono.com.br/psicopedagoga-em-barueri/">
              Psicopedagogia em Barueri</a>
            <a href=" https://www.alphafono.com.br/psicopedagoga-em-cotia/">
              Psicopedagogia em Cotia</a>

          </div>
        </aside>
      </div>

    </div>
  </div>

  <!-- Créditos -->
  <div class="credits">
    <div class="row">
      <div class="six columns">
        <span>
          <a href="http://www.vivianecasanova.com.br">Powered by VivianeCasanova</a>
        </span>
      </div>
      <div class="six columns">
        <span>
          <!-- ⚠️ Ano desatualizado -->
          <a href="https://www.alphafono.com.br" title="">© 2014 - 2021 AlphaFono</a>
        </span>
      </div>
    </div>
  </div>

</footer>
```

### Classes CSS usadas

| Seletor | Papel |
|---|---|
| `#footer` | Container do rodapé |
| `.footer-inner` | Área de 4 colunas com widgets |
| `.three.columns` | Grid — 4 colunas de 3 unidades |
| `.widget_text.group` | Widget de texto |
| `.widget_recent_entries` | Widget de posts recentes |
| `.widget_block` | Widget de bloco Gutenberg |
| `.credits` | Barra inferior com copyright |

### IDs relevantes

| ID | Widget |
|---|---|
| `#text-4` | Localização |
| `#text-3` | Horário de funcionamento |
| `#block-2` | Avaliação Google (h2 sem conteúdo) |
| `#block-3` | Link para avaliação Google |
| `#recent-posts-3` | Últimos posts |
| `#text-18` | Onde Atendemos (com bug de href) |

### Problemas identificados

**🔴 BUG CRÍTICO — Links com espaço inicial em `href`:**
Todos os 11 links do widget `#text-18` ("Onde Atendemos") possuem um espaço em branco antes da URL (`href=" https://..."`). O navegador interpreta isso como URL relativa inválida, quebrando a navegação e prejudicando seriamente o SEO (link juice não é passado).

**🟡 Copyright desatualizado:** `© 2014 - 2021 AlphaFono` — desatualizado em 5 anos (hoje é 2026).

**🟡 Link de créditos sem HTTPS:** `http://www.vivianecasanova.com.br` usa protocolo inseguro.

**🟡 Widget `#block-2` incompleto:** Contém apenas um `<h2>` sem corpo — o conteúdo foi dividido em dois blocos separados (`block-2` + `block-3`), o que é redundante e fragmentado.

---

## Resumo Geral dos Problemas

| Prioridade | Seção | Problema |
|---|---|---|
| 🔴 Crítico | Hero Slider | Flash de tela branca no carregamento — CSS `display:none` antes do JS inicializar |
| 🔴 Crítico | Footer — Onde Atendemos | 11 links com espaço inicial no `href` — links quebrados e dano a SEO |
| 🟠 Alto | Slider | 11 de 14 slides sem `<h3>` e com `sld-btn href=""` vazio |
| 🟠 Alto | WhatsApp CTA | Nenhum CTA de WhatsApp no hero — botão flutuante global sem `href` (dependente de JS) |
| 🟡 Médio | Footer | Copyright `© 2014 - 2021` desatualizado em 5 anos |
| 🟡 Médio | Equipe | `alt=""` na foto da profissional — falha de acessibilidade WCAG 2.1 |
| 🟡 Médio | Menu | Link "Sobre" aponta para página pessoal da Dra. Giovana, não para página institucional |
| 🟡 Médio | Seção CTA | Texto "botão ao lado" desatualizado — em mobile o botão fica abaixo |
| 🟢 Baixo | Header | Segunda coluna de `#top-head` vazia — área desperdiçada |
| 🟢 Baixo | Footer | Link de créditos usa `http://` sem HTTPS |

---

*Relatório gerado em 17/06/2026 — auditoria de leitura e inspeção do DOM. Nenhuma alteração foi realizada no site.*
