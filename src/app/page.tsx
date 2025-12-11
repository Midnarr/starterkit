import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>; // <-- Next 15 tambien pide que searchParams sea Promise
}) {
  
  const signIn = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // AQUI EL CAMBIO: agregamos await
    const supabase = await createClient(); 

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=No pudimos iniciar sesión");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    // AQUI EL CAMBIO: agregamos await
    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Error al registrarse");
    }

    return redirect("/login?message=Registrado correctamente. Revisa tu email para confirmar");
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 shadow rounded-xl">
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          Bienvenido
        </h2>
        
        <form className="mt-8 space-y-6">
           {/* El formulario queda igual que antes */}
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <input
                name="email"
                type="email"
                required
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Email"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                required
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              formAction={signIn}
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Entrar
            </button>
            <button
              formAction={signUp}
              className="group relative flex w-full justify-center rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Registrarse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}