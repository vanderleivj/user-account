export interface PixPaymentResponse {
  message: string;
  payment: {
    id: string;
    status: string;
  };
}

const API_BASE_URL =
  import.meta.env.VITE_ADMIN_API_URL ||
  "https://admin-santo-encontro.vercel.app";

/**
 * Faz upload de comprovante PIX via API do admin
 */
export async function uploadPixProof(
  userId: string | null,
  email: string | null,
  planType: string,
  amount: number,
  file: File
): Promise<PixPaymentResponse> {
  const formData = new FormData();
  formData.append("file", file);

  if (userId) {
    formData.append("userId", userId);
  }
  if (email) {
    formData.append("email", email);
  }

  formData.append("planType", planType);
  formData.append("amount", amount.toString());

  const response = await fetch(`${API_BASE_URL}/api/payments/pix/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: "Erro ao enviar comprovante",
    }));
    throw new Error(errorData.error || "Erro ao enviar comprovante");
  }

  const data = await response.json();
  return data;
}

/**
 * Verifica status do pagamento PIX do usuário
 */
export async function checkPixPaymentStatus(userId: string): Promise<{
  payments: Array<{
    id: string;
    status: "pending" | "approved" | "rejected";
    created_at: string;
  }>;
}> {
  const response = await fetch(
    `${API_BASE_URL}/api/payments/pix/status?userId=${userId}`
  );

  if (!response.ok) {
    throw new Error("Erro ao verificar status do pagamento");
  }

  const data = await response.json();
  return data;
}
