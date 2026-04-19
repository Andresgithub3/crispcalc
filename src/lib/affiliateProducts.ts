export interface AffiliateProduct {
  id: string;
  title: string;
  imageUrl: string;
  url: string;
  price?: string;
  badge?: string;
}

const TAG = "crispcalc-20";

export const AFFILIATE_PRODUCTS: AffiliateProduct[] = [
  {
    id: "ninja-af101",
    title: "Ninja AF101 4-Quart Air Fryer",
    imageUrl:
      "https://m.media-amazon.com/images/I/71ceMPsAigL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B07FDJMC9Q?tag=${TAG}`,
    price: "$69.99",
    badge: "Best Seller",
  },
  {
    id: "cosori-pro-le",
    title: "COSORI Pro LE 5-Quart Air Fryer",
    imageUrl:
      "https://m.media-amazon.com/images/I/71WsOj7QKOL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B0936FGLQS?tag=${TAG}`,
    price: "$79.98",
  },
  {
    id: "instant-vortex-6qt",
    title: "Instant Vortex 6-Quart Air Fryer Oven",
    imageUrl:
      "https://m.media-amazon.com/images/I/81DLVQ0mKUL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B0856HLMGY?tag=${TAG}`,
    price: "$59.95",
  },
  {
    id: "parchment-liners",
    title: "Air Fryer Parchment Paper Liners (100 pcs)",
    imageUrl:
      "https://m.media-amazon.com/images/I/81pu2R4H9OL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B09XDKNL1C?tag=${TAG}`,
    price: "$8.99",
    badge: "Top Accessory",
  },
  {
    id: "silicone-liner",
    title: "Reusable Silicone Air Fryer Liner",
    imageUrl:
      "https://m.media-amazon.com/images/I/71kTg1YTIIL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B09TVLBWDG?tag=${TAG}`,
    price: "$7.99",
  },
  {
    id: "thermopro-thermometer",
    title: "ThermoPro Instant-Read Meat Thermometer",
    imageUrl:
      "https://m.media-amazon.com/images/I/71Jf5RLCKNL._AC_SL1500_.jpg",
    url: `https://www.amazon.com/dp/B01IHHLB3W?tag=${TAG}`,
    price: "$14.99",
  },
];
