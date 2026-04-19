import { AffiliateSidebar } from "./AffiliateSidebar";
import { AFFILIATE_PRODUCTS } from "@/lib/affiliateProducts";

export function ContentWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 xl:grid xl:grid-cols-[1fr_280px] xl:gap-8">
      <div className="min-w-0">{children}</div>
      <aside className="hidden xl:block">
        <div className="sticky top-20 pt-8">
          <AffiliateSidebar products={AFFILIATE_PRODUCTS} />
        </div>
      </aside>
    </div>
  );
}
