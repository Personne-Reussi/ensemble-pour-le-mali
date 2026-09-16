// Convertit une localisation en coordonnées GPS via Nominatim
// (OpenStreetMap), gratuit et sans clé API. Utilisé par les Server
// Actions de app/admin/actions.ts quand l'admin ne renseigne pas
// latitude/longitude à la main.
//
// On utilise la recherche "structurée" de Nominatim (champs séparés
// street/city/state/country) plutôt qu'une phrase libre concaténée :
// c'est plus fiable, notamment quand une ville et sa région portent le
// même nom (ex. "Kayes" ville vs "Kayes" région au Mali).
//
// Filet de sécurité : si l'adresse précise ne correspond à rien dans les
// données cartographiques (fréquent pour des lieux informels comme "le
// marché"), Nominatim renvoie zéro résultat pour la requête complète —
// même si ville+région seules auraient très bien fonctionné. On retente
// donc en retirant progressivement le niveau de détail le plus fin
// plutôt que d'abandonner et de laisser le projet sans coordonnées.
//
// Limite d'usage Nominatim : ~1 requête/seconde, User-Agent obligatoire.
// Largement suffisant pour un formulaire admin utilisé occasionnellement.

export interface GeocodeResult {
  latitude: number;
  longitude: number;
}

export interface GeocodeQuery {
  address?: string | null;
  city?: string | null;
  region?: string | null;
}

async function fetchNominatim(query: GeocodeQuery): Promise<GeocodeResult | null> {
  const address = query.address?.trim();
  const city = query.city?.trim();
  const region = query.region?.trim();

  if (!address && !city && !region) return null;

  const params = new URLSearchParams({
    format: "json",
    limit: "1",
    country: "Mali",
  });
  if (address) params.set("street", address);
  if (city) params.set("city", city);
  if (region) params.set("state", region);

  try {
    const url = `https://nominatim.openstreetmap.org/search?${params.toString()}`;

    const res = await fetch(url, {
      headers: {
        // Nominatim exige un User-Agent identifiable, sinon les requêtes
        // sont silencieusement bloquées.
        "User-Agent": "ensemble-pour-le-mali-admin/1.0",
      },
    });

    if (!res.ok) {
      console.warn(`[geocoding] Nominatim a répondu ${res.status} pour`, query);
      return null;
    }

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;

    if (!Array.isArray(data) || data.length === 0) {
      return null;
    }

    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return null;
    }

    return { latitude, longitude };
  } catch (error) {
    console.error("[geocoding] échec de la requête", error);
    return null;
  }
}

export async function geocodeLocation(query: GeocodeQuery): Promise<GeocodeResult | null> {
  const { address, city, region } = query;

  // 1. Le plus précis : adresse + ville + région.
  if (address) {
    const result = await fetchNominatim({ address, city, region });
    if (result) return result;
    console.warn(
      `[geocoding] Adresse "${address}" introuvable, repli sur ville/région seules.`
    );
  }

  // 2. Ville + région (l'adresse n'a rien donné, ou n'était pas fournie).
  if (city) {
    const result = await fetchNominatim({ city, region });
    if (result) return result;
  }

  // 3. Région seule, en dernier recours.
  if (region) {
    const result = await fetchNominatim({ region });
    if (result) return result;
  }

  return null;
}
