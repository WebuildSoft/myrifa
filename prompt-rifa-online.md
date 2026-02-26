# PROMPT MESTRE — Desenvolvimento Completo da Plataforma de MyRifa

---

## IDENTIDADE DO PROJETO

Você é um engenheiro full-stack sênior especializado em plataformas SaaS com pagamentos. Sua tarefa é construir do zero uma plataforma completa de rifas online chamada **MyRifa**. Siga este documento como sua bíblia de desenvolvimento. Não pule etapas. Pergunte apenas se algo for genuinamente ambíguo.

---

## VISÃO GERAL DO PRODUTO

Uma plataforma SaaS onde qualquer pessoa pode:
- Criar uma rifa (sorteio ou arrecadação de fundos)
- Compartilhar via link/QR Code/WhatsApp
- Receber pagamentos via PIX e cartão
- Gerenciar compradores e realizar o sorteio

Compradores **não precisam criar conta** — acessam pelo link, escolhem números, informam nome + WhatsApp e pagam.

---

## STACK TECNOLÓGICA OBRIGATÓRIA

```
Frontend:     Next.js 14 (App Router) + TypeScript
Estilo:       Tailwind CSS + shadcn/ui
Banco:        PostgreSQL (via Supabase ou Railway)
ORM:          Prisma
Auth:         NextAuth.js v5 (e-mail/senha + Google OAuth)
Pagamentos:   Mercado Pago (PIX) + Stripe (cartão)
WhatsApp:     Evolution API ou Z-API
E-mail:       Resend
Imagens:      Cloudinary
Tempo Real:   Supabase Realtime ou Pusher
Deploy:       Vercel (frontend) + Railway (banco)
Testes:       Vitest + Playwright (E2E)
```

---

## SCHEMA DO BANCO DE DADOS (Prisma)

Implemente exatamente este schema:

```prisma
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  emailVerified DateTime?
  password      String?
  image         String?
  whatsapp      String?
  pixKey        String?
  plan          Plan     @default(FREE)
  planExpiresAt DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  rifas         Rifa[]
  accounts      Account[]
  sessions      Session[]
}

model Rifa {
  id               String      @id @default(cuid())
  slug             String      @unique
  title            String
  description      String?
  category         Category    @default(SORTEIO)
  status           RifaStatus  @default(DRAFT)
  totalNumbers     Int
  numberPrice      Decimal     @db.Decimal(10,2)
  minPercentToRaffle Int       @default(100)
  maxPerBuyer      Int?
  drawDate         DateTime?
  drawMethod       DrawMethod  @default(MANUAL)
  isPrivate        Boolean     @default(false)
  coverImage       String?
  images           String[]
  balloonShape     BalloonShape @default(CIRCLE)
  primaryColor     String?
  winnerId         String?
  winnerNumber     Int?
  drawnAt          DateTime?
  totalRaised      Decimal     @db.Decimal(10,2) @default(0)
  userId           String
  user             User        @relation(fields: [userId], references: [id])
  numbers          RifaNumber[]
  buyers           Buyer[]
  transactions     Transaction[]
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

model RifaNumber {
  id        String       @id @default(cuid())
  number    Int
  status    NumberStatus @default(AVAILABLE)
  rifaId    String
  rifa      Rifa         @relation(fields: [rifaId], references: [id])
  buyerId   String?
  buyer     Buyer?       @relation(fields: [buyerId], references: [id])
  reservedAt DateTime?
  paidAt    DateTime?
  @@unique([rifaId, number])
}

model Buyer {
  id          String       @id @default(cuid())
  name        String
  whatsapp    String
  email       String?
  rifaId      String
  rifa        Rifa         @relation(fields: [rifaId], references: [id])
  numbers     RifaNumber[]
  transactions Transaction[]
  createdAt   DateTime     @default(now())
}

model Transaction {
  id            String            @id @default(cuid())
  amount        Decimal           @db.Decimal(10,2)
  status        TransactionStatus @default(PENDING)
  method        PaymentMethod
  externalId    String?
  pixQrCode     String?
  pixQrCodeText String?
  boletoUrl     String?
  rifaId        String
  rifa          Rifa              @relation(fields: [rifaId], references: [id])
  buyerId       String
  buyer         Buyer             @relation(fields: [buyerId], references: [id])
  numbers       Int[]
  paidAt        DateTime?
  expiresAt     DateTime?
  createdAt     DateTime          @default(now())
}

enum Plan { FREE PRO INSTITUTIONAL }
enum Category { SORTEIO ARRECADACAO VIAGEM MISSAO SAUDE ESPORTE OUTRO }
enum RifaStatus { DRAFT ACTIVE PAUSED CLOSED DRAWN CANCELLED }
enum NumberStatus { AVAILABLE RESERVED PAID }
enum DrawMethod { MANUAL AUTOMATIC DATE PERCENTAGE LOTERIA_FEDERAL }
enum PaymentMethod { PIX CREDIT_CARD DEBIT_CARD BOLETO }
enum TransactionStatus { PENDING PAID EXPIRED REFUNDED CANCELLED }
enum BalloonShape { CIRCLE HEART STAR HEXAGON DIAMOND SHIELD FLOWER }
```

---

## ESTRUTURA DE PASTAS

```
/app
  /(auth)
    /login          → Página de login
    /register       → Página de cadastro
    /forgot-password → Recuperar senha
    /reset-password  → Redefinir senha
  /(dashboard)
    /dashboard       → Visão geral
    /rifas           → Listar minhas rifas
    /rifas/nova      → Criar rifa (wizard 3 etapas)
    /rifas/[id]      → Detalhes da rifa
    /rifas/[id]/editar → Editar rifa
    /rifas/[id]/compradores → Lista de compradores
    /rifas/[id]/sorteio → Realizar sorteio
    /conta           → Configurações da conta
    /planos          → Upgrade de plano
  /r/[slug]          → Página PÚBLICA da rifa (sem auth)
  /r/[slug]/resultado → Resultado do sorteio (público)
  /api
    /auth/[...nextauth]
    /rifas           → CRUD de rifas
    /rifas/[id]/numbers → Reservar/liberar números
    /payments/pix    → Criar cobrança PIX
    /payments/stripe → Criar payment intent
    /payments/webhook/mercadopago → Webhook MP
    /payments/webhook/stripe      → Webhook Stripe
    /rifas/[id]/draw → Realizar sorteio
    /notifications/whatsapp → Enviar WhatsApp
```

---

## FUNCIONALIDADES A IMPLEMENTAR (por ordem de prioridade)

### FASE 1 — MVP OBRIGATÓRIO

#### F1. Autenticação
- [ ] Cadastro com nome, e-mail, senha (bcrypt, mínimo 8 chars, 1 número)
- [ ] Verificação de e-mail (link com token JWT, expira em 24h)
- [ ] Login com e-mail/senha
- [ ] Login social com Google (OAuth 2.0 via NextAuth)
- [ ] Recuperação de senha (link por e-mail, expira em 1h, uso único)
- [ ] Middleware de proteção de rotas do dashboard

#### F2. Criar Rifa
Wizard em 3 etapas com validação por etapa:

**Etapa 1 — Informações:**
- Título (obrigatório, max 80 chars)
- Descrição (editor simples, max 500 chars)
- Categoria (dropdown)
- Imagem de capa (upload Cloudinary — apenas usuários Pro)

**Etapa 2 — Números e Preço:**
- Quantidade de números: [10, 25, 50, 100, 200, 500, 1000, personalizado]
- Valor por número (mínimo R$1,00)
- Data de encerramento (opcional)
- Percentual mínimo para sorteio (padrão 100%)
- Limite por comprador (opcional)
- Tipo de sorteio: manual, automático por data, automático por % vendida

**Etapa 3 — Revisão e publicação:**
- Preview completo da rifa
- Botões: "Salvar rascunho" e "Publicar"

#### F3. Página Pública da Rifa (`/r/[slug]`)

Layout:
```
[ Foto do prêmio ]
[ Título da rifa ]
[ Descrição ]
[ Barra de progresso: X de Y números vendidos ]
[ Contador regressivo até o sorteio (se tiver data) ]

[ Grid de números ]
  - DISPONÍVEL: fundo branco, borda cinza
  - RESERVADO: fundo amarelo (expira em 30min)
  - PAGO: fundo verde, riscado
  - Clique para selecionar (múltiplos)
  - Botão "Quero sorte!" → seleciona aleatórios

[ Botão: COMPRAR (X) NÚMERO(S) — R$ XX,XX ]
```

Modal de compra (ao clicar em Comprar):
```
Etapa 1: Dados do comprador
  - Nome completo (obrigatório)
  - WhatsApp (obrigatório, format: (99) 99999-9999)
  - E-mail (opcional)
  
Etapa 2: Escolha de pagamento
  - PIX (recomendado) — badge "Confirmação imediata"
  - Cartão de crédito/débito
  - Boleto bancário
  
Etapa 3: Pagamento
  PIX: QR Code + código copia-cola + timer 30min
  Cartão: formulário Stripe Elements
  Boleto: link + instruções
  
Etapa 4: Confirmação
  - Animação de sucesso
  - Seus números: [lista]
  - "Você receberá confirmação no WhatsApp"
  - Botão: "Compartilhar esta rifa"
```

#### F4. Dashboard
- Card: Total arrecadado (todas as rifas)
- Card: Rifas ativas
- Card: Números vendidos (total)
- Lista de rifas com: título, status, progresso, valor arrecadado, ações
- Clique em rifa → detalhes com lista de compradores

#### F5. Sistema de Reserva (concorrência)
- Ao selecionar números: reservar por 30 minutos no banco
- Job/cron a cada 5 minutos para liberar reservas expiradas
- Mostrar na página: "X números reservados (aguardando pagamento)"
- Número reservado aparece em amarelo para outros usuários

#### F6. Pagamentos
**PIX via Mercado Pago:**
```javascript
// Fluxo:
// 1. Criar preferência MP com valor e identificador
// 2. Retornar QR Code (base64) e texto copia-cola
// 3. Webhook /api/payments/webhook/mercadopago confirma pagamento
// 4. Ao confirmar: marcar números como PAID, enviar WhatsApp
```

**Cartão via Stripe:**
```javascript
// Fluxo:
// 1. Criar Payment Intent no backend
// 2. Frontend usa Stripe Elements para capturar cartão
// 3. Confirmar payment intent
// 4. Webhook /api/payments/webhook/stripe confirma
// 5. Ao confirmar: marcar números como PAID, enviar WhatsApp
```

#### F7. Notificações WhatsApp
Enviar mensagem automática nos seguintes eventos:
- Compra confirmada (para comprador): "✅ Compra confirmada! Seus números na rifa [TÍTULO]: [NÚMEROS]. Boa sorte! 🍀"
- Nova venda (para organizador): "🎟️ Nova compra! [NOME] comprou [N] número(s) na sua rifa [TÍTULO]. Total: R$[VALOR]"
- Resultado do sorteio (para ganhador): "🎉 PARABÉNS [NOME]! Você ganhou a rifa [TÍTULO] com o número [N]! Entre em contato com [ORGANIZADOR]: [WHATSAPP]"

#### F8. Sorteio
- Botão "Realizar Sorteio" no dashboard (visível só se rifa ativa e % mínima atingida)
- Algoritmo: `Math.random()` com seed criptográfico (`crypto.randomBytes`)
- Registrar: `winnerNumber`, `winnerId`, `drawnAt`, hash SHA256 dos dados
- Atualizar status da rifa para `DRAWN`
- Notificar ganhador via WhatsApp
- Página pública `/r/[slug]/resultado` com animação de revelação

### FASE 2 — FUNCIONALIDADES IMPORTANTES

#### F9. Compartilhamento
- QR Code gerado automaticamente (biblioteca `qrcode`)
- Botão WhatsApp com texto pré-preenchido
- Meta tags Open Graph dinâmicas por rifa (foto, título, progresso)
- Copiar link com um clique

#### F10. Notificações em Tempo Real (Supabase Realtime)
- Dashboard do organizador atualiza automaticamente quando:
  - Nova compra é confirmada
  - Reserva expira
  - Meta é atingida

#### F11. Planos e Limites
```typescript
const PLAN_LIMITS = {
  FREE: {
    maxActiveRifas: 3,
    canUploadImages: false,
    customBalloonShapes: false,
    platformFee: 0.05, // 5%
  },
  PRO: {
    maxActiveRifas: Infinity,
    canUploadImages: true,
    customBalloonShapes: true,
    platformFee: 0.02, // 2%
  },
  INSTITUTIONAL: {
    maxActiveRifas: Infinity,
    canUploadImages: true,
    customBalloonShapes: true,
    platformFee: 0.01, // 1%
  }
}
```

### FASE 3 — VERSÃO PRO VISUAL

#### F12. Personalização Visual (apenas Pro)
- Upload de imagem de capa e galeria (até 10 fotos)
- Formas dos balões: CIRCLE, HEART, STAR, HEXAGON, DIAMOND
- Cor primária da página (color picker)
- Renderizar forma correta no grid de números:
  ```css
  /* HEART */
  .balloon-heart { clip-path: url(#heart-clip); }
  /* STAR */
  .balloon-star { clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%); }
  ```

#### F13. Gerador de Card para Stories
- Canvas HTML5 gerando imagem 1080x1920px
- Template com: foto da rifa, título, progresso, QR Code, "Participe!"
- Botão download PNG
- Otimizado para Instagram e WhatsApp Status

---

## REGRAS DE NEGÓCIO CRÍTICAS

```
1. RESERVA: Número só é bloqueado definitivamente após pagamento confirmado
2. RESERVA EXPIRADA: Liberar automaticamente a cada 5 minutos via cron
3. CONCORRÊNCIA: Usar transação de banco para reservar números (evitar race condition)
4. SORTEIO: Só permitir se rifa ACTIVE e % mínima atingida
5. EDIÇÃO: Não permitir editar quantidade de números se já tiver venda
6. CANCELAMENTO: Ao cancelar rifa, criar estornos automáticos para compradores
7. SLUG: Gerar slug único a partir do título (slugify + verificar colisão)
8. WEBHOOK: Validar assinatura do Mercado Pago e Stripe antes de processar
9. TAXA: Descontar taxa da plataforma automaticamente ao calcular valor líquido
10. RIFA PRIVADA: Não indexar no Google, não aparecer em buscas, só acessar com link
```

---

## SEGURANÇA OBRIGATÓRIA

```
- Rate limiting: 5 tentativas de login/hora por IP (usar upstash/ratelimit)
- CAPTCHA no formulário de compra pública (hCaptcha ou Turnstile)
- Validar assinaturas de webhooks (Stripe secret + MP signature)
- Sanitizar inputs com zod em todas as API routes
- Não expor dados sensíveis (email de compradores) na página pública
- CORS restrito ao próprio domínio
- Headers de segurança via next.config.js (CSP, HSTS, X-Frame-Options)
- Senha com bcrypt, custo 12
- Tokens JWT com expiração adequada
```

---

## COMPONENTES UI OBRIGATÓRIOS

Construa estes componentes reutilizáveis:

```
<NumberGrid rifaId={id} />          → Grid de números com estados visuais
<BuyModal rifaId={id} />            → Modal de compra multi-etapa
<ProgressBar current={n} total={n} /> → Barra de progresso da venda
<CountdownTimer date={Date} />      → Contador regressivo
<QRCodeDisplay value={url} />       → QR Code com botão de download
<ShareButtons rifaUrl={url} />      → Compartilhar (WhatsApp, cópia, QR)
<BuyerTable buyers={[]} />          → Tabela de compradores no dashboard
<RifaStatusBadge status={} />       → Badge colorido de status
<PaymentMethodSelector />           → Seletor PIX/Cartão/Boleto
<PixPayment transactionId={id} />   → Tela de pagamento PIX com QR
<DrawAnimation winnerId={id} />     → Animação do sorteio
<PlanGate plan="PRO" />             → Wrapper que bloqueia features Pro
```

---

## VALIDAÇÕES (Zod Schemas)

```typescript
// Criar Rifa
const createRifaSchema = z.object({
  title: z.string().min(3).max(80),
  description: z.string().max(500).optional(),
  category: z.enum(['SORTEIO', 'ARRECADACAO', 'VIAGEM', 'MISSAO', 'SAUDE', 'ESPORTE', 'OUTRO']),
  totalNumbers: z.number().min(10).max(10000),
  numberPrice: z.number().min(1).max(10000),
  drawDate: z.date().optional(),
  minPercentToRaffle: z.number().min(1).max(100).default(100),
  maxPerBuyer: z.number().min(1).optional(),
  isPrivate: z.boolean().default(false),
})

// Compra pública
const purchaseSchema = z.object({
  name: z.string().min(3).max(100),
  whatsapp: z.string().regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/),
  email: z.string().email().optional(),
  numbers: z.array(z.number()).min(1).max(50),
  paymentMethod: z.enum(['PIX', 'CREDIT_CARD', 'DEBIT_CARD', 'BOLETO']),
  rifaId: z.string().cuid(),
})
```

---

## FLUXO DE PAGAMENTO PIX (detalhado)

```
1. POST /api/payments/pix
   Body: { rifaId, buyerId, numbers[], amount }
   
2. Backend:
   a. Validar que números ainda estão disponíveis (transação SQL)
   b. Criar registro Transaction (status: PENDING)
   c. Marcar números como RESERVED com expiração +30min
   d. Chamar Mercado Pago API para criar cobrança PIX
   e. Salvar pixQrCode e pixQrCodeText na transaction
   f. Retornar { transactionId, qrCode, qrCodeText, expiresAt }

3. Frontend: exibir QR Code + polling a cada 5s em /api/payments/[id]/status

4. POST /api/payments/webhook/mercadopago
   a. Validar assinatura do webhook
   b. Verificar status = "approved"
   c. Atualizar Transaction.status = PAID
   d. Marcar números como PAID
   e. Atualizar Rifa.totalRaised
   f. Enviar WhatsApp para comprador
   g. Enviar WhatsApp para organizador
   h. Se rifa 100% vendida e drawMethod = PERCENTAGE → disparar sorteio automático

5. Se polling retornar PAID: redirecionar para tela de sucesso
6. Se expirar: liberar números, mostrar mensagem de expiração
```

---

## AMBIENTE E VARIÁVEIS

Crie `.env.example` com:
```env
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="SUA_NEXTAUTH_URL"
NEXTAUTH_SECRET="..."

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Mercado Pago
MERCADO_PAGO_ACCESS_TOKEN="..."
MERCADO_PAGO_WEBHOOK_SECRET="..."

# Stripe
STRIPE_SECRET_KEY="sk_..."
STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Cloudinary
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Resend
RESEND_API_KEY="re_..."
RESEND_FROM_EMAIL="noreply@rifa.com.br"

# WhatsApp (Evolution API)
EVOLUTION_API_URL="..."
EVOLUTION_API_KEY="..."
EVOLUTION_INSTANCE="..."

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL="..."
UPSTASH_REDIS_REST_TOKEN="..."

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## DESIGN VISUAL

### Paleta de Cores
```css
:root {
  --primary: #7C3AED;        /* Roxo vibrante */
  --primary-light: #A78BFA;
  --primary-dark: #5B21B6;
  --success: #10B981;        /* Verde pago */
  --warning: #F59E0B;        /* Amarelo reservado */
  --danger: #EF4444;
  --background: #FAFAFA;
  --surface: #FFFFFF;
  --text: #111827;
  --muted: #6B7280;
}
```

### Responsividade
- Mobile first obrigatório
- Grid de números: 5 colunas no mobile, 8 no tablet, 10 no desktop
- Todas as ações críticas (comprar, pagar) funcionam perfeitamente em celular
- Modal de compra: fullscreen no mobile, centered no desktop

### Feedback Visual Obrigatório
- Loading states em todos os botões de ação
- Toast notifications (sonner) para todas as ações
- Skeleton loading nas listas
- Animações suaves nas transições (framer-motion)

---

## ORDEM DE IMPLEMENTAÇÃO

Siga rigorosamente esta ordem:

```
1. Setup inicial (Next.js + Prisma + NextAuth + Tailwind + shadcn)
2. Schema do banco + migrations
3. Sistema de autenticação completo (registro, login, recuperação)
4. CRUD de rifas (criar, editar, listar, deletar)
5. Geração automática de números ao criar rifa
6. Página pública com grid de números
7. Modal de compra + formulário de dados
8. Integração PIX (Mercado Pago)
9. Webhook de confirmação + atualização de status
10. Notificações WhatsApp (comprador + organizador)
11. Dashboard com dados reais
12. Sistema de reserva com expiração automática
13. Integração Stripe (cartão)
14. Sorteio manual com algoritmo criptográfico
15. Página de resultado pública
16. Compartilhamento (link, QR Code, WhatsApp)
17. Open Graph dinâmico por rifa
18. Limites por plano (PlanGate)
19. Personalização visual Pro (imagens, formas)
20. Notificações em tempo real (Supabase Realtime)
21. Gerador de card para Stories
22. Testes E2E dos fluxos críticos
23. Deploy em produção (Vercel + Railway)
```

---

## TESTES OBRIGATÓRIOS

Implemente testes E2E com Playwright para:
```
- Fluxo completo: criar rifa → compartilhar → comprar → pagar PIX → confirmar
- Reserva expira se não pagar em 30 minutos
- Sorteio registra winner e notifica via WhatsApp
- Usuário Free não consegue fazer upload de imagem
- Webhook Mercado Pago confirma pagamento corretamente
```

---

## ENTREGÁVEIS FINAIS

Ao concluir, entregue:
- [ ] Código fonte completo no GitHub
- [ ] `.env.example` documentado
- [ ] `README.md` com instruções de setup local
- [ ] Schema Prisma com todas as migrations
- [ ] Deploy funcionando em produção
- [ ] Documentação das APIs (Swagger ou README)

---

## RESTRIÇÕES E PROIBIÇÕES

```
❌ NÃO usar localStorage para dados sensíveis
❌ NÃO expor chaves de API no frontend
❌ NÃO processar pagamentos sem validar webhook
❌ NÃO permitir sorteio sem % mínima atingida
❌ NÃO enviar spam de WhatsApp (máx 1 msg por evento)
❌ NÃO armazenar dados de cartão (usar Stripe Elements)
❌ NÃO usar `any` no TypeScript
❌ NÃO fazer chamadas de API diretamente nos componentes (usar hooks/server actions)
```

---

**Comece pela etapa 1. A cada etapa concluída, liste o que foi feito e pergunte se pode avançar ou se há ajustes antes de continuar.**
