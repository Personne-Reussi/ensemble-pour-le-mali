"use client";

import { useState, useRef, useEffect } from "react";
import { MALI_REGIONS } from "@/lib/mali-regions";
import type { AdminProject } from "@/lib/admin-data";
import HelpTooltip from "./HelpTooltip";

const inputClass =
  "w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green";

interface NominatimSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
}

// Essaie de faire correspondre le champ "state" renvoyé par Nominatim
// (souvent formaté différemment, ex. "Région de Kayes") à une entrée de
// notre liste officielle. Ne force rien si aucune correspondance nette.
function matchRegion(nominatimState: string | undefined): string | null {
  if (!nominatimState) return null;
  const normalized = nominatimState.toLowerCase();
  return MALI_REGIONS.find((r) => normalized.includes(r.toLowerCase())) ?? null;
}

export default function LocationFields({ project }: { project?: AdminProject | null }) {
  const [region, setRegion] = useState(project?.region ?? "");
  const [city, setCity] = useState(project?.location_name ?? "");
  const [address, setAddress] = useState(project?.address ?? "");
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(
    project?.latitude != null && project?.longitude != null
      ? { lat: String(project.latitude), lon: String(project.longitude) }
      : null
  );

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<NominatimSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSearchChange(value: string) {
    setSearch(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          format: "json",
          addressdetails: "1",
          countrycodes: "ml",
          limit: "5",
          q: value,
        });
        const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
        const data: NominatimSuggestion[] = await res.json();
        setSuggestions(data);
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 350);
  }

  function handleSelect(suggestion: NominatimSuggestion) {
    const addr = suggestion.address ?? {};
    const matchedRegion = matchRegion(addr.state);
    const matchedCity = addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? "";
    const roadLine = [addr.road, addr.suburb ?? addr.neighbourhood].filter(Boolean).join(", ");

    if (matchedRegion) setRegion(matchedRegion);
    if (matchedCity) setCity(matchedCity);
    setAddress(roadLine || suggestion.display_name.split(",")[0]);
    setCoords({ lat: suggestion.lat, lon: suggestion.lon });

    setSearch("");
    setSuggestions([]);
    setOpen(false);
  }

  // Toute modification manuelle après une sélection invalide les
  // coordonnées choisies automatiquement : à l'enregistrement, le
  // géocodage recalculera à partir du nouveau texte plutôt que de garder
  // une position qui ne correspond plus à ce qui est affiché.
  function clearCoordsOnManualEdit() {
    if (coords) setCoords(null);
  }

  return (
    <div className="sm:col-span-2 space-y-5">
      <div ref={wrapperRef} className="relative">
        <label className="flex items-center text-[13px] font-medium text-gray-600 mb-1.5">
          Rechercher un lieu
          <HelpTooltip text="Optionnel — remplit automatiquement Région/Ville/Adresse et la position GPS avec un lieu réel. Le plus fiable." />
        </label>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          className={inputClass}
          placeholder="Ex. Marché central, Sikasso"
          autoComplete="off"
        />
        {loading && (
          <p className="text-[12px] text-gray-400 mt-1">Recherche...</p>
        )}
        {open && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-3.5 py-2.5 text-[13px] hover:bg-green/5 border-b border-gray-50 last:border-0"
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-[13px] font-medium text-gray-600 mb-1.5">Région</label>
          <select
            name="region"
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              clearCoordsOnManualEdit();
            }}
            className={inputClass}
          >
            <option value="">Sélectionner une région</option>
            {MALI_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
            Ville / Quartier
          </label>
          <input
            name="location_name"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              clearCoordsOnManualEdit();
            }}
            className={inputClass}
            placeholder="Sikasso"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center text-[13px] font-medium text-gray-600 mb-1.5">
          Adresse précise (optionnel)
          <HelpTooltip text="Utilise la recherche ci-dessus pour un résultat fiable. Si tapée à la main et introuvable, la position retombe automatiquement sur la ville puis la région — jamais sur rien du tout." />
        </label>
        <input
          name="address"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            clearCoordsOnManualEdit();
          }}
          className={inputClass}
          placeholder="Quartier Médine, près du marché central"
        />
      </div>

      {/* Coordonnées GPS : plus besoin de les afficher, la recherche
          ci-dessus (ou le géocodage automatique à l'enregistrement) s'en
          charge. On les garde en champs cachés pour transmettre la
          position exacte choisie via la recherche. */}
      <input type="hidden" name="latitude" value={coords?.lat ?? ""} />
      <input type="hidden" name="longitude" value={coords?.lon ?? ""} />
    </div>
  );
}
