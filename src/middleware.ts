import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // 1. Creamos una respuesta inicial
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Conectamos con Supabase para verificar la sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Actualizamos las cookies en la respuesta
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 3. Obtenemos al usuario
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 4. Lógica de Protección de Rutas
  // Si NO hay usuario y trata de entrar al dashboard...
  if (!user && request.nextUrl.pathname.startsWith("/dashboard")) {
    // ...lo mandamos al login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Si YA hay usuario y trata de entrar al login...
  if (user && request.nextUrl.pathname.startsWith("/login")) {
    // ...lo mandamos al dashboard (para que no se loguee dos veces)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

// Configuración: En qué rutas se ejecuta este guardia
export const config = {
  matcher: [
    /*
     * Coincide con todas las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico (icono)
     * - imágenes (svg, png, jpg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};