import type { Control, FieldErrors } from "react-hook-form";

interface FormattedCEPInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
  fetchAddress?: (cep: string) => Promise<void>;
  isLoadingCep?: boolean;
}

export const FormattedCEPInput = ({
  control,
  errors,
  fetchAddress,
  isLoadingCep = false,
}: FormattedCEPInputProps) => {
  return (
    <div className="space-y-3">
      <label
        htmlFor="zip_code"
        className="block text-sm font-medium text-gray-700"
      >
        CEP
      </label>
      <div className="relative">
        <input
          id="zip_code"
          {...control.register("zip_code")}
          placeholder="00000-000"
          onChange={(e) => {
            const text = e.target.value;
            const formatted = text
              .replace(/\D/g, "")
              .replace(/(\d{5})(\d)/, "$1-$2")
              .substring(0, 9);
            e.target.value = formatted;
          }}
          onBlur={async (e) => {
            const value = e.target.value;
            if (
              value &&
              value.replace(/\D/g, "").length === 8 &&
              fetchAddress
            ) {
              await fetchAddress(value);
            }
          }}
          className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white shadow-sm ${
            errors.zip_code
              ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
              : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          }`}
        />
        {isLoadingCep && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      {errors.zip_code && (
        <p className="text-red-600 text-sm mt-1">
          {typeof errors.zip_code.message === "string"
            ? errors.zip_code.message
            : "CEP inválido"}
        </p>
      )}
    </div>
  );
};
