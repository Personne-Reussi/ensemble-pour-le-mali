import Image from "next/image";
import type { NewsItem } from "@/lib/types";

export default function NewsSection({ news }: { news: NewsItem[] }) {
  return (
    <div id="actualites" className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading font-semibold text-[18px]">Actualités</h3>
        <a href="/actualites" className="text-green font-semibold text-[13px] flex items-center gap-1">
          Voir toutes <span>→</span>
        </a>
      </div>
      <div className="space-y-4">
        {news.length === 0 ? (
          <p className="text-gray-400 text-[13px] text-center py-8">
            Aucune actualité publiée pour le moment.
          </p>
        ) : (
          news.map((item) => (
            <a key={item.id} href={`/actualites/${item.id}`} className="flex gap-3 group">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                <Image src={item.image_url} alt={item.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 mb-0.5">{item.date}</p>
                <p className="text-[14px] font-medium leading-snug group-hover:text-green transition">
                  {item.title}
                </p>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
