import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

interface Plan {
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
  originalId?: string;
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

export const usePlans = () => {
  const [plans, setPlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("plans")
        .select("*")
        .eq("is_active", true)
        .order("price", { ascending: true });

      if (fetchError) {
        throw new Error(fetchError.message || "Erro ao buscar planos");
      }

      const convertedPlans =
        data?.map((plan: Plan) => ({
          id: plan.interval,
          originalId: plan.id,
          name: plan.name,
          description: plan.description || "",
          price: plan.price,
          currency: plan.currency,
          interval: plan.interval === "one_time" ? null : plan.interval,
          interval_count: plan.interval === "one_time" ? null : 1,
          features: plan.features || [],
          isPopular: plan.features?.includes("popular") || false,
          isFree: plan.price === 0,
          stripeProductId: plan.stripe_product_id,
          stripePriceId: plan.stripe_price_id,
        })) || [];

      setPlans(convertedPlans);
    } catch (err) {
      console.error("Erro ao buscar planos:", err);
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const refetch = () => {
    fetchPlans();
  };

  return {
    plans,
    loading,
    error,
    refetch,
  };
};
