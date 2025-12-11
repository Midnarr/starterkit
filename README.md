# 🚀 MVP SaaS Starter Kit

> **Lanza tu startup en días, no en meses.**
> Este kit contiene todo lo necesario para construir una aplicación SaaS moderna, segura y escalable. Ahorra +40 horas de configuración aburrida.

## ⚡ Características Principales

Este boilerplate no es solo código, es una arquitectura de negocio lista para usar:

- **⚛️ Next.js 15 (App Router):** La última versión del framework de React más potente.
- **🛡️ Autenticación Completa:** Login, Registro y Manejo de Sesiones con **Supabase Auth**.
- **💳 Pagos Integrados:** Pasarela de pago configurada con **Stripe Checkout**.
- **🔒 Base de Datos Segura:** PostgreSQL con **Supabase** y políticas de seguridad RLS (Row Level Security).
- **🎨 UI Moderna:** Estilizado con **Tailwind CSS** y diseño responsivo.
- **👮 Middleware:** Protección de rutas privadas (`/dashboard`) automática.
- **☁️ Listo para Producción:** Configuración optimizada para desplegar en **Vercel**.

---

## 🛠️ Stack Tecnológico

* **Frontend:** Next.js 15, React, Tailwind CSS, TypeScript.
* **Backend / DB:** Supabase (Auth & Postgres).
* **Pagos:** Stripe.
* **Deploy:** Vercel.

---

## 🚀 Guía de Inicio Rápido

Sigue estos pasos para tener tu aplicación corriendo en local en menos de 5 minutos.

### 1. Clonar el repositorio
git clone [https://github.com/TU_USUARIO/mvp-launcher-kit.git](https://github.com/TU_USUARIO/mvp-launcher-kit.git)
cd mvp-launcher-kit

2. Instalar dependencias
npm install

3. Configurar Variables de Entorno
Renombra el archivo .env.example a .env.local y agrega tus claves:

NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000


4. Configurar la Base de Datos (Supabase)
Ve al SQL Editor de tu proyecto en Supabase y ejecuta este script para crear la tabla de demostración:

-- Crear tabla de notas
create table notes (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  user_id uuid references auth.users not null default auth.uid(),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar seguridad (RLS)
alter table notes enable row level security;

-- Política: Ver solo mis notas
create policy "Ver notas propias" on notes for select using ((select auth.uid()) = user_id);

-- Política: Crear solo mis notas
create policy "Crear notas propias" on notes for insert with check ((select auth.uid()) = user_id);

5. Configurar Stripe
Crea un producto en Stripe y copia su API ID (ej: price_1Pxyz...).

Ve a src/app/api/checkout/route.ts y reemplaza el ID del precio en la línea price: "...".

6. Correr el servidor
npm run dev
Visita http://localhost:3000 y ¡listo!

📂 Estructura del Proyecto
El código está organizado para ser escalable y fácil de entender:

src/
├── app/
│   ├── (auth)/      # Rutas públicas (Login/Registro)
│   ├── (dashboard)/ # Rutas protegidas (Panel de Control)
│   ├── api/         # Webhooks y Endpoints de Stripe
│   └── page.tsx     # Landing Page
├── components/      # Botones, Inputs y UI reutilizable
├── libs/            # Configuración de Supabase y Stripe
└── types/           # Definiciones de TypeScript


🚢 Despliegue (Deploy)
La forma más fácil de publicar tu app es con Vercel:

1. Sube tu código a GitHub.
2. Importa el proyecto en Vercel.
3. Agrega las Environment Variables (las mismas del paso 3).
4. Dale a Deploy.
5. Importante: Actualiza NEXT_PUBLIC_BASE_URL en Vercel y la Site URL en Supabase Auth con tu nuevo dominio real.

🤝 Contribución y Soporte
Si encuentras un bug o tienes una idea para mejorar el kit, siéntete libre de abrir un Issue o un Pull Request.

Creado con ❤️ por Midnarr

---

### 🔥 Consejo Pro para vender más:
Para que tu repositorio o producto sea irresistible, te recomiendo que hagas esto ahora mismo:

1.  **Saca capturas de pantalla:** Toma una foto de la pantalla de Login, otra del Dashboard con las notas, y otra del mensaje de "Pago Exitoso".
2.  **Súbelas al README:** Crea una carpeta llamada `public/screenshots` en tu proyecto, guarda las fotos ahí, y agrégalas al markdown así: `![Dashboard Screenshot](/screenshots/dashboard.png)`.

¡Eso aumenta la confianza del comprador un 200%!
