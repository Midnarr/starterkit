import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import CheckoutButton from "@/components/CheckoutButton";

// 1. Recibimos los props para leer la URL (Next.js 15)
export default async function DashboardPage(props: {
  searchParams: Promise<{ payment?: string }>;
}) {
  // 2. Esperamos los parámetros
  const searchParams = await props.searchParams;
  const showSuccessMessage = searchParams.payment === "success";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  const addNote = async (formData: FormData) => {
    "use server";
    const title = formData.get("title") as string;
    if (!title) return;
    const supabase = await createClient();
    await supabase.from("notes").insert({ title });
    revalidatePath("/dashboard");
  };

  const signOut = async () => {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
          <form action={signOut}>
            <button className="text-sm text-red-600 hover:underline">
              Cerrar Sesión
            </button>
          </form>
        </div>

        {/* --- LÓGICA CONDICIONAL DE PAGO --- */}
        {showSuccessMessage ? (
          // Si el pago fue exitoso, mostramos esto:
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">¡Pago Exitoso! </strong>
            <span className="block sm:inline">Gracias por suscribirte al Plan Pro.</span>
          </div>
        ) : (
          // Si no ha pagado (o no viene de stripe), mostramos el banner de venta:
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Plan Premium 🚀</h2>
              <p className="text-indigo-100 mt-1">
                Desbloquea funciones ilimitadas por solo <span className="font-bold">$10/mes</span>.
              </p>
            </div>
            <CheckoutButton />
          </div>
        )}
        {/* ---------------------------------- */}

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Mis Notas</h3>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <form action={addNote} className="flex gap-4">
              <input
                name="title"
                type="text"
                placeholder="Escribe una nueva idea..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                required
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
                Agregar
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {notes?.length === 0 ? (
              <p className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                No tienes notas aún. ¡Crea la primera!
              </p>
            ) : (
              notes?.map((note) => (
                <div key={note.id} className="bg-white p-4 rounded-lg shadow-sm border flex justify-between items-center hover:shadow-md transition">
                  <span className="text-gray-800 font-medium">{note.title}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}