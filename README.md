# PTreino

Aplicativo mobile de treinos e acompanhamento físico, desenvolvido com **React Native (Expo)** no frontend e **Node.js + Express** no backend, com exportação nativa para Android.

---

## Sumário

- [Visão Geral](#visão-geral)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Mobile (React Native)](#mobile-react-native)
- [Backend (Server)](#backend-server)
- [Banco de Dados](#banco-de-dados)
- [Cálculos Físicos](#cálculos-físicos)
- [Como Rodar](#como-rodar)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Rotas da API](#rotas-da-api)

---

## Visão Geral

O PTreino coleta dados do usuário no cadastro para personalizar o plano alimentar e de treino com base em cálculos científicos de gasto energético. O app roda nativamente em Android via Expo e se comunica com uma API REST protegida por JWT.

---

## Estrutura do Projeto

```
ptreino/
├── src/                    # App mobile (React Native)
│   ├── components/
│   │   └── common/         # Componentes reutilizáveis (FormField, OptionSelector, SexSelector)
│   ├── constants/          # Cores e tema (spacing, fontSize, borderRadius)
│   ├── hooks/              # Custom hooks
│   ├── navigation/         # React Navigation — AppNavigator
│   ├── schemas/            # Validação Zod (login, register)
│   ├── screens/            # Telas (LoginScreen, RegisterScreen, HomeScreen)
│   ├── services/           # Cliente HTTP base
│   ├── store/              # Estado global (Zustand)
│   ├── types/              # Tipos TypeScript e RootStackParamList
│   └── utils/              # Funções utilitárias
├── server/                 # Backend Node.js
│   ├── prisma/
│   │   └── schema.prisma   # Schema do banco de dados
│   └── src/
│       ├── controllers/    # Lógica de negócio (auth, user, workout)
│       ├── middlewares/    # Autenticação JWT
│       ├── routes/         # Definição de rotas Express
│       └── utils/          # JWT, Prisma client, cálculos fitness
├── assets/                 # Ícones e imagens do app
├── docker-compose.yml      # Orquestração Docker (server + PostgreSQL)
├── App.tsx                 # Entry point do app
└── app.json                # Configuração Expo (nome, ícones, Android package)
```

---

## Mobile (React Native)

### Stack

| Lib | Uso |
|---|---|
| Expo SDK 57 | Build e runtime |
| React Native 0.86 | Framework mobile |
| TypeScript 6 | Tipagem estática |
| React Navigation | Navegação entre telas |
| React Hook Form | Gerenciamento de formulários |
| Zod | Validação de schemas |
| Zustand | Estado global |

### Navegação

```
Login  (tela inicial, sem header)
  ├──▶  Register  (cadastro completo)
  │         └──▶  Login  (após cadastro ou "já tenho conta")
  └──▶  Home  (após login, sem botão de voltar)
```

### Tela de Cadastro

Formulário dividido em 4 seções:

1. **Dados pessoais** — Nome, e-mail, idade, peso (kg), altura (cm), sexo biológico
2. **Nível de atividade física** — 5 opções com descrição (radio cards)
3. **Objetivo principal** — 3 opções com descrição (radio cards)
4. **Segurança** — Senha + confirmação

### Componentes reutilizáveis

- **`FormField`** — Input com label, placeholder, máscara de teclado e mensagem de erro. Suporta `ref` para foco programático.
- **`SexSelector`** — Botões horizontais: Masculino / Feminino / Outro.
- **`OptionSelector<T>`** — Seletor genérico de opções em cards verticais com radio button e descrição.

### Path aliases

Configurados em `tsconfig.json` e `babel.config.js`:

```ts
@components/*  →  src/components/*
@screens/*     →  src/screens/*
@navigation/*  →  src/navigation/*
@hooks/*       →  src/hooks/*
@services/*    →  src/services/*
@store/*       →  src/store/*
@utils/*       →  src/utils/*
@types/*       →  src/types/*
@constants/*   →  src/constants/*
```

---

## Backend (Server)

### Stack

| Lib | Uso |
|---|---|
| Node.js 22 | Runtime |
| Express 4 | Framework HTTP |
| TypeScript 5 | Tipagem estática |
| Prisma 6 | ORM |
| PostgreSQL 16 | Banco de dados |
| JWT (jsonwebtoken) | Autenticação |
| bcryptjs | Hash de senhas |
| Zod | Validação de entrada |

### Estrutura do servidor

```
server/src/
├── controllers/
│   ├── auth.controller.ts      # register, login
│   ├── user.controller.ts      # getMe
│   └── workout.controller.ts   # CRUD de treinos
├── middlewares/
│   └── auth.ts                 # Verificação do token JWT
├── routes/
│   ├── auth.ts                 # POST /auth/register, /auth/login
│   ├── user.ts                 # GET  /users/me
│   └── workout.ts              # GET/POST/DELETE /workouts
└── utils/
    ├── fitness.ts              # Cálculos TMB / GET / meta calórica
    ├── jwt.ts                  # signToken / verifyToken
    └── prisma.ts               # Instância global do PrismaClient
```

---

## Banco de Dados

### Models

```prisma
User
  id, name, email, password (hash)
  age, sex, weight, height
  activityLevel, goal
  createdAt, updatedAt

Workout
  id, name, userId
  exercises: WorkoutExercise[]

Exercise
  id, name, muscleGroup, description, videoUrl

WorkoutExercise
  workoutId, exerciseId
  sets, reps, restSecs, order
```

### Enums

**`ActivityLevel`**

| Valor | Descrição |
|---|---|
| `sedentary` | Sedentário — pouco ou nenhum exercício |
| `lightly_active` | Levemente ativo — 1–3 dias/semana |
| `moderately_active` | Moderadamente ativo — 3–5 dias/semana |
| `very_active` | Muito ativo — 6–7 dias/semana |
| `extremely_active` | Extremamente ativo — trabalho físico intenso |

**`Goal`**

| Valor | Descrição |
|---|---|
| `weight_loss` | Emagrecimento |
| `hypertrophy` | Hipertrofia (ganho de massa) |
| `maintenance` | Manutenção / Estética |

---

## Cálculos Físicos

### TMB — Taxa Metabólica Basal (Mifflin-St Jeor)

```
Masculino:  TMB = (10 × peso) + (6,25 × altura) − (5 × idade) + 5
Feminino:   TMB = (10 × peso) + (6,25 × altura) − (5 × idade) − 161
Outro:      média das duas fórmulas
```

### GET — Gasto Energético Total

```
GET = TMB × fator de atividade
```

| Nível | Fator |
|---|---|
| Sedentário | 1,20 |
| Levemente ativo | 1,375 |
| Moderadamente ativo | 1,55 |
| Muito ativo | 1,725 |
| Extremamente ativo | 1,90 |

### Meta Calórica Diária

```
Emagrecimento  →  GET − 500 kcal
Hipertrofia    →  GET + 300 kcal
Manutenção     →  GET
```

Esses três valores (`tmb`, `get`, `targetCalories`) são retornados no campo `fitnessProfile` das respostas de `register` e `login`.

---

## Como Rodar

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose

### Mobile

```bash
# Instalar dependências
npm install

# Rodar no Android (com emulador ou dispositivo)
npm run android

# Rodar no Expo Go (QR code)
npm start
```

### Backend com Docker

```bash
# Copiar e ajustar variáveis de ambiente
cp server/.env.example server/.env

# Subir servidor + banco
docker compose up -d

# Ver logs em tempo real
docker compose logs -f server

# Parar tudo
docker compose down
```

O container do servidor aguarda o PostgreSQL ficar saudável e roda as migrations automaticamente no boot via `prisma migrate deploy`.

### Backend em modo desenvolvimento (sem Docker)

```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev
npm run dev         # tsx watch — hot reload
```

### Gerar APK Android

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login na conta Expo
eas login

# Build para Android
eas build --platform android
```

---

## Variáveis de Ambiente

Crie `server/.env` baseado em `server/.env.example`:

```env
DATABASE_URL="postgresql://ptreino:ptreino@db:5432/ptreino"
JWT_SECRET="troque_por_uma_chave_segura"
PORT=3000
```

---

## Rotas da API

### Autenticação (público)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/register` | Cadastra novo usuário, retorna token + fitnessProfile |
| `POST` | `/auth/login` | Autentica usuário, retorna token + fitnessProfile |

### Usuário (requer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/users/me` | Retorna perfil do usuário logado |

### Treinos (requer token)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/workouts` | Lista todos os treinos do usuário |
| `POST` | `/workouts` | Cria novo treino (com exercícios opcionais) |
| `GET` | `/workouts/:id` | Retorna detalhe de um treino |
| `DELETE` | `/workouts/:id` | Remove um treino |

### Health check

```
GET /health  →  { "status": "ok", "timestamp": "..." }
```

### Exemplo de resposta — POST /auth/login

```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@email.com",
    "age": 28,
    "sex": "male",
    "weight": 80,
    "height": 178,
    "activityLevel": "moderately_active",
    "goal": "hypertrophy"
  },
  "fitnessProfile": {
    "tmb": 1872,
    "get": 2902,
    "targetCalories": 3202
  },
  "token": "eyJ..."
}
```
