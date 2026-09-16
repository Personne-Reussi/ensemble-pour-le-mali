import { redirect } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

// Tout ce qui vit dans app/admin/(protected)/** exige une session valide.
// app/admin/(auth)/login/** reste public (groupe de routes séparé),
// donc pas de boucle de redirection possible.
export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-offwhite flex items-center justify-center px-6">
        <div className="max-w-md text-center">
          <h1 className="font-heading font-semibold text-[20px] mb-2">
            Supabase n&apos;est pas encore configuré
          </h1>
          <p className="text-gray-500 text-[14px]">
            Remplis <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[13px]">.env.local</code> avec
            ton URL et ta clé anon Supabase (voir{" "}
            <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[13px]">.env.local.example</code>),
            puis relance le serveur pour accéder à l&apos;espace admin.
          </p>
        </div>
      </div>
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return <AdminShell userEmail={user.email ?? ""}>{children}</AdminShell>;
}
