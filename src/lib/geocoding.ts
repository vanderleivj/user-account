const LOCATIONIQ_API_KEY = "pk.5a28199800f4d70d921f30067c57e1b9";
const LOCATIONIQ_BASE_URL = "https://us1.locationiq.com/v1";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  display_name: string;
  address?: {
    city?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface GeocodingError {
  error: string;
  message: string;
}

/**
 * Converte um endereço em coordenadas usando a LocationIQ API
 * @param address - Endereço completo para geocoding
 * @returns Promise com coordenadas e detalhes do endereço
 */
export async function geocodeAddress(
  address: string
): Promise<GeocodingResult> {
  try {
    const response = await fetch(
      `${LOCATIONIQ_BASE_URL}/search?` +
        new URLSearchParams({
          key: LOCATIONIQ_API_KEY,
          q: address,
          format: "json",
          addressdetails: "1",
          limit: "1",
          countrycodes: "br", // Limitar ao Brasil
          accept_language: "pt-BR",
        }),
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      throw new Error("Endereço não encontrado");
    }

    const result = data[0];

    const geocodingResult: GeocodingResult = {
      latitude: Number.parseFloat(result.lat),
      longitude: Number.parseFloat(result.lon),
      display_name: result.display_name,
      address: result.address
        ? {
            city:
              result.address.city ||
              result.address.town ||
              result.address.village,
            state: result.address.state,
            country: result.address.country,
            postcode: result.address.postcode,
          }
        : undefined,
    };
    return geocodingResult;
  } catch (error: any) {
    console.error("❌ Erro no geocoding:", error);

    if (error.message?.includes("401")) {
      throw new Error("API Key inválida");
    } else if (error.message?.includes("429")) {
      throw new Error("Limite de requisições excedido");
    } else if (error.name === "AbortError") {
      throw new Error("Timeout na requisição");
    } else {
      throw new Error(`Erro ao geocodificar endereço: ${error.message}`);
    }
  }
}

/**
 * Valida se as coordenadas são válidas
 * @param latitude - Latitude
 * @param longitude - Longitude
 * @returns true se as coordenadas são válidas
 */
export function isValidCoordinates(
  latitude: number,
  longitude: number
): boolean {
  return (
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)
  );
}

/**
 * Formata endereço para geocoding
 * @param address - Endereço a ser formatado
 * @returns Endereço formatado
 */
export function formatAddressForGeocoding(address: {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}): string {
  const parts = [];

  if (address.street) parts.push(address.street);
  if (address.city) parts.push(address.city);
  if (address.state) parts.push(address.state);
  if (address.zipCode) parts.push(address.zipCode);

  return parts.join(", ");
}
