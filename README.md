# 🪙 Grana da Feira

---

## 🎯 Objetivo

Criar um sistema de dinheiro virtual para ser usado durante a feira cultural de uma escola, facilitando doações, compras e controle de saldo dos alunos, de forma simples, eficiente e digital.

---

## 🧠 Funcionamento Geral

🎁 **Doação**: O aluno faz uma doação real e recebe créditos virtuais.

💰 **Saldo**: O aluno pode consultar seu saldo e extrato.

🛍️ **Compra**: O aluno compra produtos na loja física usando os créditos virtuais. Se faltar saldo, complementa com dinheiro real (que não é manipulado pelo sistema).

🔑 **Login**: Cada aluno acessa com seu e-mail institucional e senha (inicialmente é sua data de nascimento, depois precisa ser trocada).

🗃️ **Controle**: Admins podem adicionar créditos (doações) e registrar compras.

📛 **ID de Compra**: Antes de realizar uma compra, o aluno gera um **ID de compra único** no sistema.

> Esse ID é informado ao caixa através da numeração ou por QR Code no momento da compra física e serve como chave para registrar a transação no sistema.
> O ID de compra garante a **autenticação da compra**, evita fraudes e permite que o sistema associe corretamente a transação ao aluno.

🧾 **Fluxo**:

O Aluno faz uma doação → O Adm registra a doação gerando créditos ao Aluno → O Aluno gera o ID de Compra → O Operador do Caixa insere ID e valor → Sistema debita

---

## 🧰 Stack Técnica

- **Framework**: [Next.js](https://nextjs.org/) (fullstack)
- **Banco de dados**: [Supabase](https://supabase.com/) — apenas como _backend-as-a-service_ (PostgreSQL), **sem uso do Auth**
- **Deploy**: [Vercel](https://vercel.com/)
- **Estilização**: Tailwind CSS
- **Validação**: Zod
- **Autenticação**: JWT — assinado no backend, armazenado em cookie HTTP-only

## 🗂️ Estrutura Geral do Projeto

```txt
├── app/ # Páginas e rotas do Next.js (App Router)
│ ├── api/ # Rotas internas da API (login, doação, compra etc.)
│ ├── (public)/ # Telas públicas: login, troca de senha
│ └── (protected)/ # Telas protegidas: dashboard do aluno e painel admin

├── components/ # Componentes reutilizáveis da interface
├── lib/ # Lógicas auxiliares (ex: JWT, Supabase)
├── scripts/ # Scripts utilitários, como seed de usuários via CSV
├── utils/ # Funções auxiliares (formatação, autenticação, etc.)
├── validation/ # Schemas de validação com Zod
├── public/ # Imagens e arquivos estáticos
```
