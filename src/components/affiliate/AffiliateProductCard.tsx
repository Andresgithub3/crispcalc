import Image from "next/image";
import type { AffiliateProduct } from "@/lib/affiliateProducts";

export function AffiliateProductCard({
  product,
}: {
  product: AffiliateProduct;
}) {
  return (
    <a
      href={product.url}
      target="_blank"
      rel="nofollow sponsored noopener"
      className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-white">
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 240px, 160px"
          className="object-contain p-2"
        />
        {product.badge && (
          <span className="absolute top-2 left-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
            {product.badge}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.title}
        </h3>
        {product.price && (
          <p className="font-mono text-sm font-semibold tabular-nums text-primary">
            {product.price}
          </p>
        )}
      </div>

      <span className="mt-auto inline-flex items-center justify-center rounded-lg bg-accent/60 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        View on Amazon
      </span>
    </a>
  );
}
