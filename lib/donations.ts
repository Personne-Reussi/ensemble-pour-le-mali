// Alphabet volontairement privé des caractères ambigus (0/O, 1/I/l) pour
// que le code reste facile à recopier à la main depuis un écran.
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateTrackingCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return `DON-${code}`;
}

export const donationStatusLabels: Record<string, { label: string; description: string }> = {
  pending: {
    label: "En attente de paiement",
    description: "Ton intention de don est enregistrée. Effectue le paiement puis reviens valider ci-dessus.",
  },
  awaiting_confirmation: {
    label: "En attente de confirmation",
    description: "Merci ! L'association va vérifier la réception du paiement et valider ton don sous peu.",
  },
  validated: {
    label: "Validé — merci !",
    description: "Ton don a été confirmé et compte désormais dans la cagnotte du projet.",
  },
  rejected: {
    label: "Non confirmé",
    description: "Ce don n'a pas pu être confirmé. Contacte-nous si tu penses qu'il s'agit d'une erreur.",
  },
};

export const paymentProviderLabels: Record<string, string> = {
  orange_money: "Orange Money",
  wave: "Wave",
  other: "Autre",
};
