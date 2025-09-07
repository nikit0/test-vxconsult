## VXConsult Web App

### O que é?

O VXConsult é uma aplicação web desenvolvida em React + TypeScript, utilizando Vite como bundler. O objetivo do projeto é fornecer uma plataforma moderna para autenticação de usuários, navegação protegida, e visualização de mapas, com uma arquitetura modular e escalável.

---

## Funcionamento Geral

-   **Frontend:** React (com TypeScript)
-   **Bundler:** Vite
-   **Gerenciamento de estado/contexto:** React Context API
-   **Estilização:** Tema customizável (ver `src/core/theme`)

A aplicação é composta por páginas de login, registro e home, além de componentes reutilizáveis como mapas e rotas protegidas.

---

## Estrutura de Pastas

```
src/
  components/         # Componentes reutilizáveis (ex: Map)
  contexts/           # Contextos globais (ex: AuthContext)
  core/
    theme/            # Temas e estilos globais
    utils/            # Utilitários (ex: colors, cpf)
  pages/
    home/             # Página inicial
    login/            # Página de login
    register/         # Página de registro
```

---

## Hooks Customizados

### `useAuth`

-   Localização: `src/contexts/AuthContext.tsx`
-   Função: Gerencia o estado de autenticação do usuário, fornecendo métodos como `login`, `logout`, e acesso ao usuário autenticado.
-   Uso típico:
    ```tsx
    const { user, login, logout } = useAuth()
    ```
-   Integrado ao `AuthContext` para prover autenticação global.

---

## Contextos

### `AuthContext`

-   Localização: `src/contexts/AuthContext.tsx`
-   Função: Prover o contexto de autenticação para toda a aplicação, permitindo acesso ao estado do usuário e métodos de autenticação em qualquer componente.

---

## Componentes Principais

### `Map`

-   Localização: `src/components/Map.tsx`
-   Função: Exibe um mapa interativo (com várias opções e + opções estando logado).

---

## Páginas

### Login (`src/pages/login/index.tsx`)

-   Permite ao usuário autenticar-se.
-   Botões:
    -   **Entrar:** Realiza o login usando as credenciais fornecidas.
    -   **Registrar:** Redireciona para a página de registro.

### Registro (`src/pages/register/index.tsx`)

-   Permite criar uma nova conta.
-   Botões:
    -   **Registrar:** Cria a conta com os dados informados.
    -   **Voltar:** Retorna para a tela de login.

### Home (`src/pages/home/index.tsx`)

-   Página inicial após login.
-   Botões:
    -   **Logout:** Encerra a sessão do usuário.
    -   **Acessar Mapa:** (Se disponível) Exibe o componente de mapa.

---

## Temas e Utilitários

-   **Tema:** Arquivos em `src/core/theme` permitem customização de cores e estilos globais.
-   **Cores:** Utilitários em `src/core/utils/colors.ts` para randomizar as cores dos polígonos do mapa.
-   **CPF:** Utilitários em `src/core/utils/cpf.ts` validar e formatar CPF.

---

## Como rodar o projeto

1. Instale as dependências:
    ```powershell
    npm install
    ```
2. Rode o projeto em modo desenvolvimento:
    ```powershell
    npm run dev
    ```
3. Acesse via navegador em `http://localhost:5173` (ou porta configurada).

---

## Observações

-   O projeto é totalmente responsivo tanto para telas normais, quanto para celular.
-   O projeto pode ser expandido facilmente com novos hooks, contextos e páginas.
-   Para acessar o estado de autenticação em qualquer componente, utilize o hook `useAuth`.
