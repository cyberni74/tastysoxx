export type Role = "buyer" | "seller";
export type Category = "sneaker" | "sport" | "knie" | "nylon";
export type Material = "Baumwolle" | "Wolle" | "Nylon" | "Synthetik";
export type ListingStatus = "active" | "reserved" | "sold" | "hidden";
export type OrderStatus = "pending_payment" | "paid" | "shipped" | "completed" | "cancelled";

export interface Profile {
  id: string;
  username: string;
  role: Role;
  bio: string;
  country: string;
  age_range: string | null;
  build: string | null;
  shoe_size: string | null;
  avatar_url: string | null;
  verified: boolean;
  is_admin: boolean;
  last_active: string;
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  category: Category;
  material: Material;
  wear_days: number;
  price_cents: number;
  images: string[];
  status: ListingStatus;
  created_at: string;
}

export type ListingWithSeller = Listing & {
  seller: Pick<Profile, "id" | "username" | "verified" | "country" | "avatar_url" | "last_active"> | null;
};

export interface SellerStats {
  seller_id: string;
  rating: number;
  review_count: number;
}

export interface Order {
  id: string;
  number: string;
  buyer_id: string;
  seller_id: string;
  status: OrderStatus;
  subtotal_cents: number;
  shipping_cents: number;
  ship_name: string;
  ship_street: string;
  ship_zip: string;
  ship_city: string;
  ship_country: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  order_id: string;
  listing_id: string;
  title: string;
  price_cents: number;
}

export interface Review {
  id: string;
  order_id: string;
  buyer_id: string;
  seller_id: string;
  rating: number;
  body: string;
  created_at: string;
}

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  listing_id: string | null;
  last_message_at: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
}
