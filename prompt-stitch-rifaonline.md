# PROMPT COMPLETO PARA STITCH — RifaOnline
# Plataforma de Rifas Online — Todas as Telas

---

## IDENTIDADE VISUAL GLOBAL (aplique em TODAS as telas)

**Nome do app:** RifaOnline
**Tagline:** "Crie sua rifa em minutos"

**Paleta de cores:**
- Primária: #7C3AED (roxo vibrante)
- Primária clara: #A78BFA
- Primária escura: #5B21B6
- Sucesso / Pago: #10B981 (verde)
- Aviso / Reservado: #F59E0B (âmbar)
- Erro: #EF4444 (vermelho)
- Fundo geral: #F5F3FF (lavanda muito suave)
- Superfície (cards): #FFFFFF
- Texto principal: #1E1B4B
- Texto secundário: #6B7280
- Borda: #E5E7EB

**Tipografia:**
- Títulos: Syne Bold (pesado, moderno)
- Corpo: DM Sans Regular
- Números/destaque: Syne ExtraBold

**Estilo geral:**
- Border radius: 16px em cards, 12px em inputs, 100px em badges
- Sombra dos cards: 0 4px 24px rgba(124, 58, 237, 0.10)
- Ícones: estilo outline arredondado (Lucide style)
- Botão primário: fundo #7C3AED, texto branco, hover escurece
- Botão secundário: borda #7C3AED, texto #7C3AED, fundo transparente
- Inputs: borda #E5E7EB, focus borda #7C3AED com glow suave
- Design mobile-first: largura base 390px (iPhone 14)

---

## TELA 1 — SPLASH / ONBOARDING

**Tipo:** Mobile, tela cheia
**Descrição:** Tela de boas-vindas animada para novos usuários

**Layout:**
- Fundo com gradiente diagonal: #7C3AED → #5B21B6 → #1E1B4B
- Partículas/confetes flutuando sutilmente no fundo (animação loop)
- Centro: ícone do app (ticket de rifa estilizado em branco) 80x80px com sombra brilhante
- Abaixo do ícone: "RifaOnline" em Syne ExtraBold 32px branco
- Tagline: "Crie, compartilhe e sorteie com facilidade" em DM Sans 16px branco 80% opacidade
- Espaço: 3 ilustrações em carrossel com dots indicadores:
  1. "Crie sua rifa em minutos" — ilustração de pessoa configurando rifa
  2. "Compartilhe no WhatsApp" — ilustração de celular com WhatsApp
  3. "Receba pagamentos na hora" — ilustração de dinheiro/PIX
- Abaixo do carrossel: botão "Criar minha conta" (branco, texto roxo, largura total)
- Link embaixo: "Já tenho conta — Entrar" (branco, sublinhado)
- Indicador de swipe nos dots

---

## TELA 2 — CADASTRO

**Tipo:** Mobile, scroll
**Descrição:** Formulário de criação de conta

**Layout:**
- Header: seta voltar (←) + título "Criar conta" centralizado em Syne Bold 22px
- Fundo: #F5F3FF
- Card branco centralizado com padding 24px, border-radius 20px, sombra suave
- Campos do formulário (espaçamento 16px entre cada):
  - Label "Nome completo" + input com ícone pessoa (👤)
  - Label "E-mail" + input com ícone envelope (✉️) + validação inline
  - Label "WhatsApp" + input com flag BR + máscara (99) 99999-9999
  - Label "Senha" + input com ícone olho toggle (mostrar/ocultar)
  - Label "Confirmar senha" + input igual acima
- Indicador de força da senha: barra em 4 segmentos (fraca/média/boa/forte) com cor progressiva
- Checkbox: "Li e aceito os Termos de Uso e Política de Privacidade" (link sublinhado roxo)
- Botão "Criar conta" roxo, largura total, 52px altura, disabled se form inválido
- Divider "ou continue com" com linha
- Botão Google: branco, borda, logo Google + "Entrar com Google"
- Rodapé: "Já tem conta? Entrar" link roxo centralizado
- Estados de erro: borda vermelha + mensagem embaixo do campo em vermelho 12px

---

## TELA 3 — LOGIN

**Tipo:** Mobile
**Descrição:** Tela de acesso à conta

**Layout:**
- Fundo: #F5F3FF
- Topo: logo RifaOnline pequeno (ícone + nome) centralizado, margem topo 48px
- Título "Bem-vindo de volta 👋" Syne Bold 26px cor #1E1B4B
- Subtítulo "Entre na sua conta" DM Sans 14px cinza
- Card branco com formulário:
  - Campo e-mail com ícone
  - Campo senha com toggle mostrar/ocultar
  - Link "Esqueci minha senha" alinhado à direita, roxo 13px
- Botão "Entrar" roxo largura total
- Divider "ou"
- Botão Google branco com borda
- Rodapé "Não tem conta? Criar grátis" roxo centralizado
- Estado de erro de credenciais: banner vermelho suave no topo "E-mail ou senha incorretos"

---

## TELA 4 — RECUPERAR SENHA

**Tipo:** Mobile
**Descrição:** Fluxo em 2 etapas para redefinir senha

**Etapa 1 — Informe seu e-mail:**
- Seta voltar + título "Recuperar senha"
- Ilustração de envelope com seta (60px)
- Texto explicativo "Digite seu e-mail e enviaremos um link para redefinir sua senha"
- Campo e-mail com ícone
- Botão "Enviar link" roxo
- Estado após envio: ícone ✅ verde, "Link enviado! Verifique seu e-mail" em verde, botão "Reenviar em 60s" (countdown)

**Etapa 2 — Nova senha (tela separada, acessada pelo link do e-mail):**
- Título "Criar nova senha"
- Campo "Nova senha" com toggle
- Campo "Confirmar nova senha" com toggle
- Indicador de força da senha
- Botão "Salvar nova senha"
- Após salvar: modal de sucesso com ✅ e botão "Ir para login"

---

## TELA 5 — DASHBOARD (HOME DO ORGANIZADOR)

**Tipo:** Mobile, scroll vertical
**Descrição:** Visão geral das rifas e métricas do organizador

**Layout:**
- Header fixo: 
  - Esquerda: avatar circular do usuário (40px) + "Olá, [Nome] 👋" DM Sans
  - Direita: ícone sino (notificações) com badge vermelho se tiver notif + ícone configurações
- Fundo: #F5F3FF

**Seção 1 — Cards de Métricas (scroll horizontal):**
4 cards em linha com scroll:
- Card 1: "Total Arrecadado" — valor em verde grande (Syne Bold 28px), "este mês" cinza
- Card 2: "Rifas Ativas" — número roxo grande, "de 3 disponíveis" cinza (free)
- Card 3: "Números Vendidos" — número roxo, "esta semana" cinza
- Card 4: "Taxa de Conversão" — percentual com mini gráfico sparkline
Cada card: 160x100px, branco, border-radius 16px, sombra suave, borda esquerda colorida 4px

**Seção 2 — Botão Criar Nova Rifa:**
- Banner roxo gradiente 100% largura, border-radius 16px
- Ícone + 🎟️ "Criar nova rifa" em branco bold
- Subtexto "Leva menos de 5 minutos" branco 80%
- Seta → direita

**Seção 3 — Minhas Rifas (lista):**
- Título "Minhas Rifas" Syne Bold 18px + link "Ver todas →" roxo
- Lista de cards de rifa (ver componente Card de Rifa abaixo)
- Estado vazio: ilustração fofa + "Você ainda não criou nenhuma rifa" + botão roxo

**Bottom Navigation (fixo):**
- 4 ícones: 🏠 Home | 🎟️ Rifas | 📊 Relatórios | 👤 Perfil
- Ícone ativo: roxo + label, inativo: cinza
- Borda topo suave, fundo branco

---

## TELA 6 — CARD DE RIFA (componente reutilizável)

**Descrição:** Card usado na listagem do dashboard

**Layout (largura total, altura ~120px):**
- Fundo branco, border-radius 16px, sombra suave
- Esquerda: imagem quadrada 80x80px da rifa com border-radius 12px (placeholder roxo gradiente se sem imagem, com ícone 🎟️)
- Direita do conteúdo:
  - Linha 1: título da rifa (Syne 16px bold, truncado) + badge de status
  - Linha 2: barra de progresso (altura 6px, cor roxo, fundo cinza claro, border-radius 100px) + "X/Y números" cinza 12px
  - Linha 3: "R$ [valor arrecadado]" verde bold + data de encerramento cinza
- Badge de status (canto superior direito):
  - ATIVA: fundo verde claro, texto verde "Ativa"
  - RASCUNHO: fundo cinza, texto cinza "Rascunho"
  - ENCERRADA: fundo cinza escuro, texto branco "Encerrada"
  - SORTEADA: fundo roxo, texto branco "Sorteada ✓"
- Toque no card: navegar para detalhes da rifa

---

## TELA 7 — CRIAR RIFA (Wizard 3 etapas)

**Tipo:** Mobile, wizard com progress bar

**Header:**
- Seta voltar + "Criar Rifa" centralizado
- Progress bar com 3 etapas: ① Informações → ② Números → ③ Revisão
- Etapa atual em roxo, próximas em cinza, concluídas em verde com ✓

**ETAPA 1 — Informações da Rifa:**
- Título "Sobre sua rifa" Syne 22px
- Upload de foto (apenas Pro):
  - Área tracejada 100% largura, 160px altura, border-radius 16px
  - Ícone câmera + "Adicionar foto do prêmio" cinza
  - Se Free: área com lock 🔒 + "Disponível no plano Pro" + botão "Upgrade" roxo pequeno
- Campo: "Título da rifa" (obrigatório, contador 0/80 chars)
- Campo: "Descrição" (textarea 4 linhas, contador 0/500 chars)
- Selector "Categoria": chips horizontais em scroll (Sorteio | Arrecadação | Viagem | Missão | Saúde | Esporte | Outro)
  - Chip selecionado: fundo roxo, texto branco
  - Chip normal: borda cinza, texto cinza
- Botão "Próximo →" roxo, largura total

**ETAPA 2 — Números e Preço:**
- Título "Configure os números"
- "Quantidade de números" — grid de opções:
  10 | 25 | 50 | 100 | 200 | 500 | 1000 | ✏️ Personalizar
  Grid 4 colunas, cada opção: 70x44px, borda cinza, border-radius 10px
  Selecionado: fundo roxo, texto branco, borda roxa
- "Valor por número" — input com prefixo "R$", teclado numérico
- "Encerramento" — date picker nativo + toggle "Sem data definida"
- "Sorteio automático" — toggle switch + se ativo, opções:
  - "Ao atingir X% vendido" com slider 50%-100%
  - "Na data de encerramento"
- "Limite por comprador" — toggle + input numérico se ativo
- Preview dinâmico no rodapé: "Meta: R$ [total se vender tudo]" em card roxo
- Botões: "← Voltar" (outline) + "Próximo →" (roxo)

**ETAPA 3 — Revisão e Publicação:**
- Título "Revise sua rifa"
- Card preview da rifa (como aparecerá publicamente):
  - Foto (ou placeholder)
  - Título, categoria, descrição
  - X números por R$Y cada
  - Meta total em verde
  - Data de encerramento
- 2 botões empilhados:
  - "💾 Salvar como rascunho" (outline roxo, largura total)
  - "🚀 Publicar agora" (roxo sólido, largura total, maior)
- Texto embaixo: "Ao publicar, sua rifa ficará disponível para compartilhar"

---

## TELA 8 — DETALHES DA RIFA (organizador)

**Tipo:** Mobile, scroll
**Descrição:** Dashboard específico de uma rifa

**Header:**
- Seta voltar + título da rifa (truncado) + menu ⋮ (editar / pausar / encerrar / duplicar)

**Seção 1 — Status Card:**
- Card roxo gradiente com:
  - Badge de status grande centralizado
  - Valor arrecadado "R$ XXX,XX" em Syne 36px branco bold
  - "de R$ XXX,XX meta" cinza claro 14px
  - Barra de progresso branca semi-transparente
  - "XX de YY números vendidos • X disponíveis • X reservados"

**Seção 2 — Ações Rápidas (grid 2x2):**
- 📣 Compartilhar — abre modal de compartilhamento
- 👥 Compradores — vai para lista
- ✏️ Editar — vai para formulário de edição
- 🎲 Realizar Sorteio — botão destacado roxo (só ativo se % mínima atingida)

**Seção 3 — Gráfico de Vendas:**
- Mini linha do tempo com vendas por dia (últimos 7 dias)
- Barras simples, cor roxa, labels de data embaixo

**Seção 4 — Últimas Compras (3 mais recentes):**
- Avatar inicial do nome + Nome + WhatsApp mascarado + "X números" + valor + tempo relativo
- "Ver todos →" link roxo

**Seção 5 — Link da Rifa:**
- Caixa com URL: "rifaonline.com/r/[slug]"
- Botões lado a lado: 📋 Copiar | 💬 WhatsApp | QR Code
- QR Code expandível ao tocar

---

## TELA 9 — LISTA DE COMPRADORES

**Tipo:** Mobile, scroll
**Descrição:** Todos os compradores de uma rifa específica

**Header:**
- Seta voltar + "Compradores" + contador badge "[N]"
- Barra de busca por nome ou WhatsApp

**Filtros (chips em linha):**
Todos | Pagos ✓ | Reservados ⏳ | Por número

**Lista (cada item):**
- Avatar circular com iniciais (cor baseada no nome, aleatória mas consistente)
- Nome (bold 15px) + WhatsApp (cinza 13px)
- Números comprados: chips pequenos roxos/cinza com os números
- Valor pago em verde bold
- Status badge: "Pago ✓" verde | "Aguardando" amarelo | "Expirado" cinza
- Tempo relativo: "há 2 horas"
- Toque: expande detalhes + botão "Chamar no WhatsApp" verde

**Footer fixo:**
- "Exportar CSV" botão outline roxo largura total

---

## TELA 10 — PÁGINA PÚBLICA DA RIFA (comprador)

**Tipo:** Mobile, sem header de app
**Descrição:** Tela que o comprador vê ao abrir o link

**Header da Rifa:**
- Foto do prêmio 100% largura, 220px altura, object-fit cover
- Overlay gradiente escuro na parte de baixo
- Sobre a foto (absoluto): nome do organizador + avatar pequeno
- Abaixo da foto: título em Syne Bold 22px, categoria badge roxo

**Seção Info:**
- Card branco flutuante com sombra (margem negativa -20px do topo, border-radius 20px topo)
- Descrição do prêmio (2 linhas + "Ver mais")
- Linha com: 🎟️ "R$ X,XX por número" | 📅 "Encerra em [data]"
- Barra de progresso roxa + "XX% vendido (Y de Z números)"
- Contador regressivo se tiver data: "⏱ 2d 14h 32m 18s" em card âmbar

**Grid de Números:**
- Título "Escolha seus números" bold
- Legenda horizontal: 🟢 Disponível | 🟡 Reservado | ⚫ Vendido
- Botão "🍀 Quero sorte!" outline roxo — seleciona N aleatórios
- Grid de números (5 colunas no mobile):
  - DISPONÍVEL: fundo branco, borda #E5E7EB, número cinza
  - SELECIONADO: fundo #7C3AED, número branco bold, scale 1.05
  - RESERVADO: fundo #FEF3C7, borda âmbar, número âmbar, não clicável
  - VENDIDO: fundo #F3F4F6, número cinza claro riscado, não clicável
  - Tamanho: 56x56px, border-radius 12px
  - Animação suave ao selecionar/deselecionar

**Footer Fixo (aparece ao selecionar 1+ número):**
- Fundo branco, sombra topo
- "[X] número(s) selecionado(s)"
- "Total: R$ XX,XX" em verde bold
- Botão "Comprar agora →" roxo largura quase total, 54px altura

---

## TELA 11 — MODAL DE COMPRA (multi-etapa)

**Tipo:** Bottom sheet modal (sobe do rodapé)
**Fundo:** escurecido com blur

**ETAPA 1/3 — Seus dados:**
- Handle cinza no topo (indicador de arrastar)
- Título "Seus dados" Syne 20px
- Resumo: "X número(s) • R$ XX,XX" em card roxo claro
- Campos:
  - Nome completo (obrigatório) com ícone 👤
  - WhatsApp (obrigatório) com ícone 📱 e máscara
  - E-mail (opcional) com ícone ✉️ e label "Para receber comprovante"
- Botão "Continuar →" roxo largura total

**ETAPA 2/3 — Forma de pagamento:**
- Título "Como quer pagar?"
- 3 opções como cards selecionáveis:
  - PIX: ícone PIX verde + "PIX" bold + "Confirmação instantânea" + badge "✓ Recomendado" verde
  - Cartão: ícone cartão roxo + "Cartão de crédito/débito" + "Até 12x"
  - Boleto: ícone boleto + "Boleto bancário" + "Vence em 3 dias"
  - Card selecionado: borda roxa 2px + fundo roxo 5% opacidade
- Botão "Ir para pagamento →" roxo

**ETAPA 3/3 — PIX (pagamento):**
- Título "Pague via PIX"
- QR Code centralizado 200x200px em card branco com sombra
- Abaixo do QR: "ou copie o código PIX:"
- Campo com código (truncado) + botão 📋 Copiar (verde ao copiar)
- Timer: "⏱ Expira em 28:43" em âmbar, contagem regressiva
- "Aguardando confirmação..." com spinner roxo animado
- Texto: "Após o pagamento, seus números serão confirmados automaticamente"
- Link: "Tive problemas com o PIX" (abre suporte)

**ETAPA 3/3 — Cartão (alternativa):**
- Stripe Elements embutido:
  - Campo número do cartão com ícones das bandeiras
  - Campos validade + CVV lado a lado
  - Nome no cartão
- Botão "Pagar R$ XX,XX" roxo
- 🔒 "Pagamento 100% seguro via Stripe"

**TELA DE SUCESSO (após confirmação):**
- Animação: confetes roxos e verdes caindo por 3 segundos
- Ícone ✅ 80px verde animado (scale in)
- "Compra confirmada! 🎉" Syne 26px
- "Seus números:" lista de chips roxos com os números
- "Enviamos confirmação no seu WhatsApp" ícone WhatsApp verde
- Botão "Compartilhar esta rifa com amigos" (outline roxo, WhatsApp icon)
- Link "Ver resultado quando sair" pequeno cinza embaixo

---

## TELA 12 — SORTEIO (organizador)

**Tipo:** Mobile, tela especial
**Descrição:** Tela para realizar e animar o sorteio

**Pré-sorteio:**
- Header: seta voltar + "Realizar Sorteio"
- Card de aviso âmbar: "⚠️ Atenção: O sorteio não pode ser desfeito. Certifique-se de que todos os pagamentos foram confirmados."
- Resumo da rifa: título, X números vendidos, Y compradores
- Método do sorteio (radio cards):
  - Algoritmo aleatório seguro (padrão, recomendado)
  - Loteria Federal — input do número do concurso
- Botão "🎲 Iniciar Sorteio" roxo grande largura total (confirmação antes)

**Animação do sorteio (tela cheia):**
- Fundo roxo escuro gradiente
- Partículas douradas animadas
- Texto "Sorteando..." pulsando
- Números rolando rapidamente como slot machine
- Desaceleração dramática nos últimos 3 segundos
- Número final brilha com efeito glow dourado
- Confetes explosão

**Resultado do sorteio:**
- Número ganhador em Syne 80px, cor dourada, centralizado
- "🏆 NÚMERO SORTEADO!" acima
- Card branco com dados do ganhador: nome + WhatsApp
- "Notificação enviada no WhatsApp ✓" verde
- Botão "Ver página de resultado" roxo
- Botão "Compartilhar resultado" outline

---

## TELA 13 — RESULTADO PÚBLICO (`/r/[slug]/resultado`)

**Tipo:** Mobile, sem autenticação
**Descrição:** Página pública do resultado do sorteio

**Layout:**
- Fundo: gradiente roxo escuro, confetes estáticos decorativos
- Topo: nome da rifa + "🏆 Resultado do Sorteio"
- Card central branco grande:
  - "Número Sorteado" label pequeno cinza
  - Número em Syne 96px roxo bold centralizado
  - Separador
  - Avatar inicial do ganhador 60px
  - "Parabéns, [Nome]!" Syne 22px
  - "WhatsApp: [número mascarado]" cinza
- Card info abaixo: "Sorteio realizado em [data e hora] • Método: [algoritmo/loteria]"
- Hash de auditoria (truncado) + link "Verificar autenticidade"
- Botão "Participar da próxima rifa" roxo (link para perfil do organizador)
- Lista de todos os participantes (accordion expansível)

---

## TELA 14 — COMPARTILHAR RIFA (modal)

**Tipo:** Bottom sheet
**Descrição:** Modal de compartilhamento aberto pelo organizador

**Layout:**
- Handle + Título "Compartilhe sua rifa"
- Link curto em destaque: card roxo claro com URL + botão 📋 Copiar
- QR Code 180px + botão "Baixar QR Code PNG"
- Divider "Compartilhar no"
- Grid 2x2 de botões de rede social:
  - 💬 WhatsApp (verde)
  - 📸 Instagram Stories (gradiente IG)
  - 👥 Facebook (azul)
  - 📧 E-mail (roxo)
- Botão especial: "✨ Gerar card para Stories" — roxo outline
  - Ao clicar: preview de imagem 9:16 com visual da rifa
  - Botão "Baixar imagem" verde

---

## TELA 15 — PERFIL E CONFIGURAÇÕES

**Tipo:** Mobile, scroll
**Descrição:** Gerenciamento da conta do organizador

**Header:**
- Avatar grande 80px com botão câmera sobreposto (trocar foto)
- Nome em Syne Bold 22px centralizado
- Badge do plano: "Plano Gratuito" cinza ou "Pro ⭐" roxo ou "Institucional 🏢" azul
- Botão "Fazer upgrade" roxo pequeno (se Free)

**Seção — Dados Pessoais:**
- Card branco com campos editáveis:
  - Nome, WhatsApp, E-mail, Chave PIX padrão
  - Botão "Salvar alterações" roxo

**Seção — Segurança:**
- "Trocar senha" → tela de trocar senha
- "Verificação em 2 etapas" (Pro) → toggle + setup
- "Sessões ativas" → lista dispositivos logados

**Seção — Meu Plano:**
- Card com plano atual, features incluídas, data de renovação
- Botão "Ver todos os planos" ou "Gerenciar assinatura"

**Seção — Configurações:**
- Notificações WhatsApp: toggle cada tipo
- Notificações E-mail: toggle cada tipo
- Idioma: PT-BR (único por enquanto)

**Rodapé:**
- "Sair da conta" link vermelho centralizado
- Versão do app: "v1.0.0" cinza

---

## TELA 16 — PLANOS E UPGRADE

**Tipo:** Mobile, scroll
**Descrição:** Tela de conversão para plano pago

**Header:** "Escolha seu plano" Syne Bold 26px centralizado

**Toggle anual/mensal:**
- Pill toggle: Mensal | Anual (com badge "2 meses grátis")

**Cards dos planos (scroll vertical, destaque no Pro):**

Card Gratuito:
- Fundo branco, borda cinza
- "Gratuito" label + "R$ 0/mês" 
- "+ 5% por rifa encerrada"
- Lista de features com ✓ verde e ✗ cinza

Card Pro (DESTACADO):
- Fundo roxo gradiente leve, borda roxa 2px
- Badge "⭐ Mais popular" no topo
- "Pro" + "R$ 29/mês" Syne Bold 36px
- "+ 2% por rifa encerrada"
- Lista de features todas com ✓
- Botão "Assinar Pro" branco texto roxo, largura total

Card Institucional:
- "R$ 79/mês" + "+ 1%"
- Features completas

**FAQ accordion:**
- "Como funciona a taxa?" 
- "Posso cancelar a qualquer hora?"
- "Como emite nota fiscal?"

---

## TELA 17 — NOTIFICAÇÕES (central)

**Tipo:** Mobile, scroll
**Descrição:** Central de notificações do organizador

**Header:** "Notificações" + botão "Marcar todas como lidas"

**Lista (agrupada por data: Hoje / Ontem / Esta semana):**

Cada notificação:
- Ícone colorido (🎟️ verde para venda, ⏱️ âmbar para reserva expirada, 🎉 roxo para meta atingida)
- Título bold 15px
- Descrição cinza 13px
- Tempo relativo (há 2 min, há 1h, etc.)
- Não lidas: fundo roxo 5% + ponto roxo 8px à esquerda
- Lidas: fundo branco, sem indicador

Tipos de notificação:
- "💳 Nova compra confirmada" — "João Silva comprou 3 números na rifa [Título] • R$ 45,00"
- "⏱ Reserva expirou" — "2 números foram liberados na rifa [Título]"
- "🎯 Meta atingida!" — "Sua rifa [Título] atingiu 100% das vendas!"
- "📅 Sorteio amanhã" — "Lembre de realizar o sorteio da rifa [Título]"

---

## TELA 18 — ONBOARDING PÓS-CADASTRO

**Tipo:** Mobile, fullscreen
**Descrição:** Checklist guiado para novos usuários criarem sua primeira rifa

**Layout:**
- Fundo roxo gradiente leve
- "Bem-vindo, [Nome]! 🎉" Syne Bold 28px
- "Siga os passos para criar sua primeira rifa:"
- Lista de passos com progresso:
  ① ✅ Conta criada
  ② ⬜ Criar sua primeira rifa
  ③ ⬜ Compartilhar no WhatsApp
  ④ ⬜ Receber sua primeira compra
- Barra de progresso em porcentagem
- Botão grande "Criar minha primeira rifa →"
- Link "Pular por agora" pequeno cinza

---

## ESPECIFICAÇÕES TÉCNICAS PARA O STITCH

**Tamanho das telas:** 390 x 844px (iPhone 14 padrão)
**Densidade:** @2x / @3x assets

**Componentes reutilizáveis a criar:**
- Button (primary, secondary, outline, ghost, danger) — 5 variações
- Input (default, error, success, disabled) — 4 estados
- Card (default, elevated, roxo, âmbar) — 4 variações
- Badge/Tag (status: ativa, rascunho, encerrada, sorteada, pago, reservado, expirado)
- BottomSheet (modal que sobe do rodapé)
- ProgressBar (linear, com label)
- NumberBalloon (available, selected, reserved, sold) — 4 estados
- Avatar (com iniciais, com foto, com badge de plano)
- Toast notification (success, error, warning, info)
- EmptyState (com ilustração, título, subtítulo, botão)
- LoadingSkeleton (para cards e listas)

**Fluxos de navegação:**
```
PÚBLICO (sem login):
/r/[slug] → Modal Compra → Pagamento → Sucesso
/r/[slug]/resultado → Resultado

PRIVADO (com login):
Login/Cadastro → Dashboard → Criar Rifa → Detalhes → Sorteio
Dashboard → Compradores → Lista
Dashboard → Perfil → Configurações → Planos
```

**Animações importantes:**
- Número selecionado: scale 0.9 → 1.05 → 1.0 com bounce (150ms)
- Bottom sheet: slide up com spring (300ms)
- Confirmação de compra: confetes por 3 segundos
- Slot machine do sorteio: duração 5 segundos, desacelera no final
- Cards de notificação: fade + slide da direita
- Progress bar: fill animado ao carregar

**Paleta de ícones:** Use exclusivamente Lucide Icons (outline style)
Ícones principais: Ticket, Users, ChartBar, Share2, QrCode, WhatsApp, Star, Lock, Bell, Settings, Plus, ArrowRight, Check, X, AlertCircle, Trophy, Shuffle

---

## ORDEM DE CRIAÇÃO SUGERIDA

1. Criar Design System (cores, tipografia, componentes base)
2. Telas de autenticação (2, 3, 4)
3. Página pública da rifa (10) — mais importante para o comprador
4. Modal de compra (11) — fluxo crítico
5. Dashboard (5) + Card de rifa (6)
6. Criar rifa wizard (7)
7. Detalhes da rifa (8) + Compradores (9)
8. Sorteio (12) + Resultado público (13)
9. Compartilhamento (14)
10. Perfil e Planos (15, 16)
11. Notificações (17)
12. Splash e Onboarding (1, 18)
