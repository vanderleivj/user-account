export interface Plan {
  id: string;
  stripe_price_id: string;
  stripe_product_id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  interval:
    | "day"
    | "week"
    | "month"
    | "quarterly"
    | "semiannual"
    | "year"
    | "one_time";
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface PlanConfig {
  id: string;
  originalId?: string; // UUID original do banco de dados
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string | null;
  interval_count: number | null;
  features: string[];
  isPopular?: boolean;
  isFree?: boolean;
  stripeProductId?: string;
  stripePriceId?: string;
}
