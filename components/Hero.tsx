import Image from "next/image";

export default function Hero() {
  return (
    <section id="accueil" className="relative overflow-hidden">
      <div className="relative h-[560px] lg:h-[620px]">
        <Image
          src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?q=80&w=1974&auto=format&fit=crop"
          alt="Enfant malien au coucher du soleil"
          fill
          priority
          className="object-cover object-[70%_30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/10" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 h-full flex flex-col justify-center">
          <div className="max-w-xl">
            <p className="text-white/90 text-[13px] font-semibold tracking-[0.15em] mb-4">
              TRANSPARENCE &nbsp;·&nbsp; SOLIDARITÉ &nbsp;·&nbsp; DÉVELOPPEMENT
            </p>
            <h1 className="font-heading font-extrabold text-white text-[40px] sm:text-[48px] leading-[1.1] mb-5">
              Ensemble pour un
              <br />
              <span className="text-green">Mali</span> plus solidaire
            </h1>
            <p className="text-white/85 text-[16px] leading-relaxed mb-8 max-w-md">
              Découvrez comment vos dons et votre engagement financent des
              projets concrets : accès à l&apos;eau, éducation, santé,
              développement local.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/projets"
                className="flex items-center gap-2 bg-green text-white font-semibold px-6 py-3.5 rounded-full hover:bg-green-dark transition shadow-lg shadow-black/20"
              >
                <svg width="17" height="17" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21s-6.7-4.35-9.3-8.1C.8 10.1 1.6 6.3 4.9 5c2-.8 4 0 5.1 1.7C11.1 5 13.1 4.2 15.1 5c3.3 1.3 4.1 5.1 2.2 7.9C14.7 16.65 12 21 12 21z" />
                </svg>
                Faire un don
              </a>
              <a
                href="#benevole"
                className="flex items-center gap-2 border-2 border-white/70 text-white font-semibold px-6 py-3.5 rounded-full hover:bg-white/10 transition"
              >
                <svg width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Devenir bénévole
              </a>
            </div>
          </div>
        </div>

        <p className="font-hand hidden lg:block absolute right-10 top-16 text-ocre text-2xl rotate-[-3deg] leading-tight text-right drop-shadow">
          Des projets concrets
          <br />
          pour un meilleur avenir
        </p>
      </div>
    </section>
  );
}
