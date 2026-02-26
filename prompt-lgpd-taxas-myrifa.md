# PROMPT — Documentos Legais + Estrutura de Taxas
# MyRifa — Plataforma Comercial de Rifas Online
# Para: Advogado IA / IA Jurídica / ChatGPT / Claude

---

## CONTEXTO DO PROJETO

Você é um advogado especialista em Direito Digital, LGPD e contratos de plataformas digitais no Brasil. Sua tarefa é redigir todos os documentos legais e a estrutura de taxas para a plataforma **MyRifa**.

**O que é o MyRifa:**
- Plataforma SaaS brasileira onde pessoas físicas e jurídicas criam rifas online
- Organizador cria uma rifa, compartilha link, compradores pagam via PIX ou cartão
- Plataforma cobra taxa automática sobre cada rifa encerrada
- Existem 3 planos: Gratuito, Pro (R$49,90/mês) e Institucional (R$149,90/mês)
- Compradores não precisam criar conta — informam apenas nome e WhatsApp
- Pagamentos processados via Mercado Pago (PIX) e Stripe (cartão)
- Dados armazenados no Supabase (servidores podendo ser fora do Brasil)
- Domínio: myrifa.com
- CNPJ: a ser registrado (MEI ou ME)
- Cidade sede: a definir pelo fundador

**Leia tudo antes de começar. Entregue cada documento completo, sem resumos.**

---

## DOCUMENTO 1 — TERMOS DE USO

Redija os Termos de Uso completos para o MyRifa cobrindo obrigatoriamente:

### 1.1 Definições
Defina claramente os termos usados no documento:
- Plataforma
- Organizador
- Comprador
- Rifa
- Número
- Sorteio
- Taxa da Plataforma
- Plano

### 1.2 Aceitação dos Termos
- Como os termos são aceitos (uso da plataforma = aceite)
- Atualização dos termos e como o usuário será notificado
- O que acontece se o usuário não aceitar

### 1.3 Cadastro e Conta
- Requisitos para criar conta (maior de 18 anos, dados verdadeiros)
- Responsabilidade pelo uso da conta
- Suspensão e encerramento de conta
- Proibição de múltiplas contas

### 1.4 Regras para Criação de Rifas
Inclua explicitamente:
- O organizador é o único responsável pela entrega do prêmio
- O MyRifa é apenas intermediador tecnológico, não garante a entrega do prêmio
- É proibido criar rifas de: armas, drogas, itens ilegais, conteúdo adulto, animais, documentos
- O organizador deve ter o prêmio em mãos ou garantia de entrega
- Rifas fraudulentas serão encerradas e o organizador poderá ser banido e notificado às autoridades
- Limite de rifas simultâneas por plano

### 1.5 Legalidade das Rifas no Brasil
Inclua uma seção explicando:
- A legislação brasileira sobre rifas (Decreto-Lei nº 6.259/44 e regulamentações)
- Que rifas para fins beneficentes, comunitários ou pessoais são permitidas
- Que rifas com fins estritamente comerciais/lucrativos podem exigir autorização da Caixa Econômica Federal
- Que o MyRifa não se responsabiliza por irregularidades legais praticadas pelo organizador
- Que o organizador assume total responsabilidade pela legalidade de sua rifa

### 1.6 Pagamentos e Taxas
- Como funcionam as taxas da plataforma (detalhadas na seção de Estrutura de Taxas)
- Prazo de repasse ao organizador
- Política de reembolso ao comprador
- Chargeback e disputas
- Que o MyRifa não armazena dados de cartão (processado pelo Stripe)

### 1.7 Sorteio
- O organizador é responsável por realizar o sorteio
- O algoritmo do MyRifa é apenas uma ferramenta, a responsabilidade é do organizador
- Comprovante de sorteio gerado pela plataforma
- O que acontece se o sorteio não for realizado no prazo

### 1.8 Cancelamento de Rifa
- Quando o organizador pode cancelar
- Obrigação de reembolso aos compradores em caso de cancelamento
- Penalidades por cancelamentos recorrentes
- O MyRifa pode cancelar rifas suspeitas de fraude

### 1.9 Limitação de Responsabilidade
- O MyRifa é intermediador, não vendedor
- Não garante funcionamento ininterrupto
- Não se responsabiliza por falhas de terceiros (Mercado Pago, Stripe, WhatsApp)
- Limitação de indenização ao valor pago pelo organizador nos últimos 3 meses

### 1.10 Propriedade Intelectual
- Marca MyRifa registrada
- Proibição de cópia ou engenharia reversa
- Conteúdo enviado pelo usuário: licença de uso pela plataforma

### 1.11 Foro e Lei Aplicável
- Lei brasileira
- Foro da cidade sede do MyRifa
- Tentativa de mediação antes de ação judicial

---

## DOCUMENTO 2 — POLÍTICA DE PRIVACIDADE (LGPD)

Redija a Política de Privacidade completa em conformidade com a **Lei nº 13.709/2018 (LGPD)** cobrindo:

### 2.1 Controlador dos Dados
- Nome da empresa MyRifa (razão social a preencher)
- CNPJ (a preencher)
- E-mail do DPO/responsável: privacidade@myrifa.com
- Endereço

### 2.2 Dados Coletados

**Do Organizador (usuário com conta):**
- Nome completo
- E-mail
- Senha (hash, nunca o texto puro)
- WhatsApp
- Chave PIX
- Foto de perfil (opcional)
- Dados de pagamento (token Stripe, nunca número do cartão)
- IP de acesso, device, navegador
- Histórico de rifas criadas

**Do Comprador (sem conta):**
- Nome completo
- WhatsApp
- E-mail (opcional)
- CPF (opcional, se exigido pelo organizador)
- Números comprados
- Dados do pagamento (processados por Mercado Pago/Stripe)
- IP de acesso

### 2.3 Finalidade do Tratamento de Dados
Para cada dado coletado, explicar:
- Por que é coletado
- Base legal (art. 7º LGPD): consentimento, execução de contrato, legítimo interesse, obrigação legal
- Por quanto tempo é armazenado

### 2.4 Compartilhamento de Dados
Explicar que dados são compartilhados com:
- **Mercado Pago**: processamento de pagamentos PIX
- **Stripe**: processamento de pagamentos por cartão
- **Supabase**: armazenamento (pode estar fora do Brasil — transferência internacional)
- **Z-API**: envio de mensagens WhatsApp
- **Resend**: envio de e-mails transacionais
- **Vercel**: hospedagem da aplicação
- Autoridades: em caso de determinação judicial

### 2.5 Transferência Internacional de Dados
- Supabase e Vercel podem armazenar dados fora do Brasil
- Medidas adotadas para proteção (criptografia, contratos de adequação)
- Conformidade com art. 33 da LGPD

### 2.6 Direitos do Titular (art. 18 LGPD)
Explicar cada direito com o como exercer via e-mail:
- Confirmação de existência de tratamento
- Acesso aos dados
- Correção de dados incompletos ou desatualizados
- Anonimização, bloqueio ou eliminação
- Portabilidade
- Eliminação dos dados tratados com consentimento
- Informação sobre compartilhamento
- Revogação do consentimento
- Prazo de resposta: 15 dias

### 2.7 Segurança dos Dados
- Criptografia em trânsito (HTTPS/TLS)
- Criptografia em repouso (Supabase)
- Senhas armazenadas com hash bcrypt
- Acesso restrito por função (RLS no Supabase)
- Backups automáticos
- Procedimento em caso de vazamento (notificação à ANPD em 72h)

### 2.8 Cookies e Rastreamento
- Cookies essenciais (sessão, autenticação)
- Cookies de análise (se usar PostHog/Analytics)
- Como desabilitar cookies

### 2.9 Dados de Menores
- Plataforma proibida para menores de 18 anos
- O que fazer se identificar menor de idade

### 2.10 Retenção e Exclusão de Dados
- Dados de conta: enquanto a conta existir + 5 anos após encerramento (obrigação fiscal)
- Dados de transação: 5 anos (obrigação fiscal/contábil)
- Dados do comprador: 2 anos após a última transação
- Logs de acesso: 6 meses (Marco Civil da Internet)

### 2.11 Encarregado de Dados (DPO)
- Nome ou cargo
- E-mail: privacidade@myrifa.com
- Como acionar

---

## DOCUMENTO 3 — POLÍTICA DE COOKIES

Documento curto e claro explicando:
- O que são cookies
- Quais cookies o MyRifa usa (listar cada um)
- Como aceitar ou recusar
- Banner de consentimento de cookies (descrição do que deve aparecer)

---

## DOCUMENTO 4 — POLÍTICA DE REEMBOLSO

Redija uma política clara e objetiva cobrindo:

### Para o Comprador:
- Comprador pode solicitar reembolso em até 7 dias após a compra (CDC)
- Após 7 dias, reembolso apenas se o organizador cancelar a rifa
- Prazo de devolução: até 10 dias úteis via PIX
- Como solicitar: e-mail suporte@myrifa.com com número do pedido
- Casos onde reembolso não é aplicável (rifa já sorteada, número já ganhou)

### Para o Organizador:
- Taxa da plataforma não é reembolsável após rifa encerrada
- Mensalidade Pro: reembolso proporcional apenas no primeiro mês (R$49,90)
- Cancelamento de plano: funcionalidades disponíveis até fim do período pago
- Rifas canceladas pelo MyRifa por fraude: sem reembolso da taxa

---

## DOCUMENTO 5 — ESTRUTURA DE TAXAS DA PLATAFORMA

Crie um documento técnico-comercial completo definindo:

### 5.1 Taxas por Plano

**Plano Gratuito:**
- Mensalidade: R$ 0,00
- Taxa por rifa encerrada: 5% do valor total arrecadado
- Máximo de rifas simultâneas: 3
- Taxa mínima por rifa: R$ 2,00 (mesmo que 5% seja menor)
- Funcionalidades: básicas (sem imagem, sem personalização)

**Plano Pro — R$ 49,90/mês:**
- Taxa por rifa encerrada: 2% do valor total arrecadado
- Máximo de rifas simultâneas: ilimitado
- Taxa mínima por rifa: R$ 1,00
- Funcionalidades: imagens, formas personalizadas, relatórios, sem branding

**Plano Institucional — R$ 149,90/mês:**
- Taxa por rifa encerrada: 1% do valor total arrecadado
- Máximo de rifas simultâneas: ilimitado
- Taxa mínima por rifa: R$ 0,50
- Funcionalidades: tudo do Pro + domínio próprio, múltiplos admins, API

### 5.2 Cálculo da Taxa (com exemplos)

Exemplo 1 — Plano Gratuito:
```
Rifa com 100 números a R$10,00 cada
Total arrecadado: R$1.000,00
Taxa plataforma (5%): R$50,00
Valor líquido ao organizador: R$950,00
```

Exemplo 2 — Plano Pro:
```
Rifa com 500 números a R$5,00 cada
Total arrecadado: R$2.500,00
Taxa plataforma (2%): R$50,00
Mensalidade Pro (proporcional ao mês): R$49,90
Valor líquido ao organizador: R$2.450,00
```

Exemplo 3 — Rifa pequena (taxa mínima):
```
Rifa com 10 números a R$2,00 cada
Total arrecadado: R$20,00
5% seria: R$1,00 (abaixo da taxa mínima)
Taxa cobrada: R$2,00 (taxa mínima)
Valor líquido ao organizador: R$18,00
```

### 5.3 Quando a Taxa é Cobrada
- A taxa é descontada automaticamente no momento do encerramento da rifa
- O valor líquido fica disponível para saque em até 2 dias úteis
- A taxa é calculada sobre o valor efetivamente recebido (excluindo reembolsos)

### 5.4 Taxas dos Meios de Pagamento
Esclarecer que além da taxa MyRifa, existem taxas das operadoras:

**PIX via Mercado Pago:**
- Conta PJ Mercado Pago: 0,99% por transação
- Essa taxa é descontada do valor bruto antes do repasse

**Cartão via Stripe:**
- 2,9% + R$0,30 por transação aprovada
- Essa taxa é descontada pelo Stripe antes do repasse

**Exemplo de cálculo completo (Plano Gratuito, pagamento cartão):**
```
Comprador paga: R$100,00
Taxa Stripe (2,9% + R$0,30): R$3,20
Valor que chega ao MyRifa: R$96,80
Taxa MyRifa (5% sobre R$100): R$5,00
Valor líquido ao organizador: R$91,80
```

### 5.5 Saques e Repasse
- Saldo disponível para saque: D+2 após confirmação do pagamento
- Método de saque: PIX para chave cadastrada
- Valor mínimo de saque: R$ 10,00
- Saque gratuito: 1 por semana (Gratuito), ilimitado (Pro/Institucional)
- Taxa de saque adicional (Gratuito): R$ 2,00 por saque extra

### 5.6 Estornos e Chargebacks
- Chargeback aprovado pelo banco: o valor é descontado do saldo do organizador
- Se saldo insuficiente: saldo fica negativo e bloqueia novos saques
- Taxa administrativa de chargeback: R$ 15,00 por ocorrência
- Organizadores com mais de 2% de chargeback podem ter conta suspensa

### 5.7 Tabela Resumida

| Item | Gratuito | Pro | Institucional |
|---|---|---|---|
| Mensalidade | R$0 | R$49,90 | R$149,90 |
| Taxa por rifa | 5% | 2% | 1% |
| Taxa mínima | R$2,00 | R$1,00 | R$0,50 |
| Rifas simultâneas | 3 | Ilimitado | Ilimitado |
| Saques gratuitos | 1/semana | Ilimitado | Ilimitado |
| Taxa saque extra | R$2,00 | Grátis | Grátis |
| Chargeback admin | R$15,00 | R$15,00 | R$10,00 |

---

## DOCUMENTO 6 — CONTRATO ENTRE PLATAFORMA E ORGANIZADOR

Redija um contrato de adesão resumido (aceite digital ao criar conta) cobrindo:
- Que o organizador está aderindo às condições da plataforma
- Responsabilidades do organizador (prêmio, sorteio, atendimento ao comprador)
- Responsabilidades do MyRifa (tecnologia, pagamentos, suporte)
- Autorização de cobrança automática das taxas
- Autorização para processar pagamentos em nome do organizador
- Condições de encerramento do contrato

---

## DOCUMENTO 7 — AVISO LEGAL SOBRE RIFAS (texto para exibir na plataforma)

Texto curto (máximo 200 palavras) para exibir na página de criação de rifa, alertando:
- Que rifas com fins estritamente comerciais podem precisar de autorização
- Que o organizador é responsável pela legalidade
- Link para saber mais sobre a legislação
- Que o MyRifa não se responsabiliza por irregularidades

---

## INSTRUÇÕES DE ENTREGA

**Formato:** Markdown bem formatado, pronto para ser copiado para o site

**Tom:** Claro, direto, em português brasileiro. Evite juridiquês desnecessário. O usuário médio deve entender.

**Para cada documento entregue:**
1. Título e versão (ex: "Versão 1.0 — Janeiro 2025")
2. Data da última atualização
3. Campo "[RAZÃO SOCIAL]" onde o nome da empresa deve ser preenchido
4. Campo "[CNPJ]" onde o CNPJ deve ser preenchido
5. Campo "[CIDADE]" onde a cidade sede deve ser preenchida
6. Campo "[DATA DE VIGÊNCIA]" a ser preenchido

**Avisos importantes a incluir em cada documento:**
- "Este documento foi gerado com auxílio de inteligência artificial e deve ser revisado por um advogado antes de entrar em vigor"
- "Em caso de dúvidas, entre em contato: juridico@myrifa.com"

---

## ORDEM DE ENTREGA

Entregue nesta ordem, um por vez, aguardando confirmação:

1. Termos de Uso
2. Política de Privacidade (LGPD)
3. Política de Cookies
4. Política de Reembolso
5. Estrutura de Taxas
6. Contrato Organizador
7. Aviso Legal sobre Rifas

**Comece pelo Documento 1 — Termos de Uso. Entregue completo.**
