const actions = [
  {
    title: "Faire un don",
    text: "Soutenez nos projets concrètement et en toute sécurité.",
    href: "#don",
    icon: (
      <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.6 6.3 4.9 5c2-.8 4 0 5.1 1.7C11.1 5 13.1 4.2 15.1 5c3.3 1.3 4.1 5.1 2.2 7.9C14.7 16.65 12 21 12 21z" />
    ),
  },
  {
    title: "Devenir bénévole",
    text: "Apportez vos compétences, partagez votre temps.",
    href: "#benevole",
    icon: (
      <path d="M17 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
    ),
  },
  {
    title: "Suivre nos actions",
    text: "Restez informé de l'avancement des projets.",
    href: "#actualites",
    icon: <path d="M4 19h16M6 15l4-6 3 4 5-7" />,
  },
  {
    title: "Notre transparence",
    text: "Consultez nos rapports financiers et nos dépenses.",
    href: "/rapports",
    icon: (
      <>
        <path d="M12 2l8 3v6c0 5-3.5 8.5-8 11-4.5-2.5-8-6-8-11V5l8-3z" />
        <path d="M9 12l2 2 4-4" />
      </>
    ),
  },
];

export default function CtaSection() {
  return (
    <section id="organisation" className="bg-[#F1F4EE] py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[0.9fr_2.2fr] gap-8 items-start">
          <div>
            <p className="text-green text-[12px] font-semibold tracking-[0.12em] mb-3">
              VOUS AUSSI, AGISSEZ
            </p>
            <h2 className="font-heading font-semibold text-[30px] leading-tight mb-3">
              Chaque geste compte
            </h2>
            <p className="text-gray-500 text-[14px] leading-relaxed">
              Rejoignez notre communauté de bénévoles ou soutenez nos projets en
              faisant un don. Ensemble, nous pouvons aller plus loin.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {actions.map((action) => (
              <div key={action.title} className="bg-white rounded-2xl p-5">
                <svg
                  width="26"
                  height="26"
                  fill="none"
                  stroke="#27AE60"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                  className="mb-3"
                >
                  {action.icon}
                </svg>
                <h4 className="font-heading font-semibold text-[16px] mb-1">
                  {action.title}
                </h4>
                <p className="text-gray-500 text-[13px] leading-snug mb-4">
                  {action.text}
                </p>
                <a
                  href={action.href}
                  className="w-8 h-8 rounded-full bg-green text-white flex items-center justify-center hover:bg-green-dark transition"
                >
                  →
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
