import { AffiliateProductCard } from "./AffiliateProductCard";
import { AFFILIATE_PRODUCTS } from "@/lib/affiliateProducts";

export function AffiliateInline() {
  return (
    <section aria-label="Recommended products" className="xl:hidden">
      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          Top Picks
        </p>

        <div className="scrollbar-none -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
          {AFFILIATE_PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="w-[180px] shrink-0 snap-start sm:w-[200px]"
            >
              <AffiliateProductCard product={product} />
            </div>
          ))}
        </div>

        <p className="text-[10px] leading-snug text-muted-foreground/70">
          As an Amazon Associate we earn from qualifying purchases.
        </p>
      </div>
    </section>
  );
}
