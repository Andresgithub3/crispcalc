// import { AffiliateSidebar } from "./AffiliateSidebar";
// import { AFFILIATE_PRODUCTS } from "@/lib/affiliateProducts";

/**
 * Layout wrapper for content pages. The affiliate sidebar is disabled
 * until the Amazon Associates tag (`crispcalc-20`) is registered.
 * Re-enable by uncommenting the imports and the <aside> block below.
 */
export function ContentWithSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
      <div className="min-w-0">{children}</div>
      {/* <aside className="hidden xl:block">
        <div className="sticky top-20 pt-8">
          <AffiliateSidebar products={AFFILIATE_PRODUCTS} />
        </div>
      </aside> */}
    </div>
  );
}
