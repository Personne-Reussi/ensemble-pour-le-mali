import Logo from "./Logo";

const navLinks = [
  { label: "Accueil", href: "#accueil" },
  { label: "Projets", href: "#projets" },
  { label: "Notre organisation", href: "#organisation" },
  { label: "Actualités", href: "#actualites" },
  { label: "Contact", href: "#contact" },
];

const socials = ["f", "X", "◎", "▶", "in"];

export default function Footer() {
  return (
    <footer id="contact" className="bg-[#1C2620] text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 pb-10 border-b border-white/10">
          <a href="#accueil" className="flex items-center gap-3">
            <Logo size={38} />
            <div className="leading-tight">
              <p className="font-heading font-semibold text-white text-[16px]">
                Ensemble pour le Mali
              </p>
              <p className="text-[11px] text-gray-400">
                Solidarité · Développement · Impact
              </p>
            </div>
          </a>

          <nav className="flex flex-wrap gap-x-8 gap-y-2 text-[14px]">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-white transition">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((s, i) => (
              <a
                key={i}
                href="#"
                className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition text-[13px]"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6">
          <p className="text-[13px] text-gray-500">
            © {new Date().getFullYear()} Ensemble pour le Mali. Tous droits réservés.
          </p>
          <p className="font-hand text-ocre text-xl">
            Ensemble, construisons un avenir meilleur.
          </p>
          <div className="flex gap-5 text-[13px] text-gray-500">
            <a href="/mentions-legales" className="hover:text-white transition">
              Mentions légales
            </a>
            <a href="/confidentialite" className="hover:text-white transition">
              Politique de confidentialité
            </a>
            <a href="/admin" className="hover:text-white transition">
              Espace admin
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
