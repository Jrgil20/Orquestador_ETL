# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# Orchestration Service

## Configuración de Supabase

1. Copia el archivo `.env.example` a `.env` en la raíz de `/orchestration`.
2. Completa los valores de `SUPABASE_URL`, `SUPABASE_API_KEY` y `SUPABASE_TABLE` según tu proyecto de Supabase.

El archivo `.env` nunca debe subirse al repositorio (ya está en `.gitignore`).
