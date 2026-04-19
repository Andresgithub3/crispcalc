import { AffiliateProductCard } from "./AffiliateProductCard";
import type { AffiliateProduct } from "@/lib/affiliateProducts";

export function AffiliateSidebar({
  products,
}: {
  products: AffiliateProduct[];
}) {
  const shown = products.slice(0, 4);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        Top Picks
      </p>

      <div className="flex flex-col gap-3">
        {shown.map((product) => (
          <AffiliateProductCard key={product.id} product={product} />
        ))}
      </div>

      <p className="text-[10px] leading-snug text-muted-foreground/70">
        As an Amazon Associate we earn from qualifying purchases.
      </p>
    </div>
  );
}
