import type { AdminProject } from "@/lib/admin-data";
import LocationFields from "./LocationFields";

const statusOptions = [
  { value: "pending", label: "En attente" },
  { value: "active", label: "En cours" },
  { value: "completed", label: "Terminé" },
  { value: "archived", label: "Archivé" },
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green";

export default function ProjectForm({
  action,
  project,
}: {
  action: (formData: FormData) => void;
  project?: AdminProject | null;
}) {
  return (
    <form action={action} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2">
          <Field label="Titre du projet">
            <input
              name="title"
              required
              defaultValue={project?.title}
              className={inputClass}
              placeholder="Forage à Sikasso"
            />
          </Field>
        </div>

        <div className="sm:col-span-2">
          <Field label="Description">
            <textarea
              name="description"
              rows={3}
              defaultValue={project?.description ?? ""}
              className={inputClass}
              placeholder="Construction d'un forage pour l'accès à l'eau potable..."
            />
          </Field>
        </div>

        <Field label="Statut">
          <select name="status" defaultValue={project?.status ?? "pending"} className={inputClass}>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Avancement physique (%)">
          <input
            type="number"
            name="physical_progress"
            min={0}
            max={100}
            defaultValue={project?.physical_progress ?? 0}
            className={inputClass}
          />
        </Field>

        <Field label="Budget cible (FCFA)">
          <input
            type="number"
            name="budget_target"
            min={0}
            required
            defaultValue={project?.budget_target}
            className={inputClass}
          />
        </Field>

        <Field label="Financement actuel (FCFA)">
          <input
            type="text"
            readOnly
            disabled
            value={
              project
                ? `${new Intl.NumberFormat("fr-FR").format(project.current_funding)} FCFA`
                : "0 FCFA (se remplira avec les premiers dons)"
            }
            className={`${inputClass} bg-gray-50 text-gray-500 cursor-not-allowed`}
          />
          <p className="text-[12px] text-gray-400 mt-1">
            Calculé automatiquement à partir des dons validés (voir{" "}
            <a href="/admin/donations" className="text-green underline">
              Dons
            </a>
            ) — ne se modifie plus ici directement.
          </p>
        </Field>

        <LocationFields project={project} />

        <Field label="Image mise en avant (URL)">
          <input
            name="featured_image_url"
            defaultValue={project?.featured_image_url ?? ""}
            className={inputClass}
            placeholder="https://..."
          />
        </Field>

        <div className="sm:col-span-2">
          <Field label="Photo panoramique 360° (URL, optionnel)">
            <input
              name="panorama_image_url"
              defaultValue={project?.panorama_image_url ?? ""}
              className={inputClass}
              placeholder="https://..."
            />
            <p className="text-[12px] text-gray-400 mt-1">
              Doit être une image équirectangulaire (ratio 2:1) — la plupart
              des apps &quot;mode panorama&quot; de smartphone ou des
              caméras 360° exportent directement dans ce format. Si rempli,
              une visite virtuelle interactive apparaît sur la fiche
              publique du projet.
            </p>
          </Field>
        </div>

        <Field label="Date de début">
          <input
            type="date"
            name="start_date"
            defaultValue={project?.start_date ?? ""}
            className={inputClass}
          />
        </Field>

        <Field label="Date de fin">
          <input
            type="date"
            name="end_date"
            defaultValue={project?.end_date ?? ""}
            className={inputClass}
          />
        </Field>
      </div>

      <button
        type="submit"
        className="bg-green text-white font-semibold text-[14px] px-6 py-2.5 rounded-full hover:bg-green-dark transition"
      >
        {project ? "Enregistrer les modifications" : "Créer le projet"}
      </button>
    </form>
  );
}
