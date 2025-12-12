import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import CheckoutButton from "@/components/CheckoutButton";

export default async function DashboardPage(props: {
  searchParams: Promise<{ payment?: string }>;
}) {
  // 1. READ PARAMS
  const searchParams = await props.searchParams;
  const showSuccessMessage = searchParams.payment === "success";

  // 2. VERIFY USER
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // 3. FETCH NOTES
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("created_at", { ascending: false });

  // 4. ACTION: ADD NOTE
  const addNote = async (formData: FormData) => {
    "use server";
    const title = formData.get("title") as string;
    if (!title) return;
    const supabase = await createClient();
    await supabase.from("notes").insert({ title });
    revalidatePath("/dashboard");
  };

  // 5. ACTION: SIGN OUT
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
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <form action={signOut}>
            <button className="text-sm text-red-600 hover:underline">
              Sign Out
            </button>
          </form>
        </div>

        {/* --- PAYMENT UI LOGIC --- */}
        {showSuccessMessage ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative animate-fade-in-down" role="alert">
            <strong className="font-bold">Payment Received! 🎉 </strong>
            <span className="block sm:inline">You are now a Premium member. Thanks for your support.</span>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold">Premium Plan 🚀</h2>
              <p className="text-indigo-100 mt-1">
                Unlock unlimited features for just <span className="font-bold">$10/month</span>.
              </p>
            </div>
            <CheckoutButton />
          </div>
        )}
        {/* ---------------------------------- */}

        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-4">My Notes</h3>
          
          <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
            <form action={addNote} className="flex gap-4">
              <input
                name="title"
                type="text"
                placeholder="Write a new idea..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-4 py-2 border"
                required
              />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition">
                Add
              </button>
            </form>
          </div>

          <div className="space-y-3">
            {notes?.length === 0 ? (
              <p className="text-center text-gray-500 py-8 border-2 border-dashed rounded-lg">
                You don't have any notes yet. Create the first one!
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