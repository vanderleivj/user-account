import type { Control, FieldErrors } from "react-hook-form";

interface FormattedPhoneInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

export const FormattedPhoneInput = ({
  control,
  errors,
}: FormattedPhoneInputProps) => {
  return (
    <div className="space-y-3">
      <label
        htmlFor="phone"
        className="block text-sm font-medium text-gray-700"
      >
        WhatsApp
      </label>
      <input
        id="phone"
        {...control.register("phone")}
        placeholder="(00) 00000-0000"
        onChange={(e) => {
          const text = e.target.value;
          const formatted = text
            .replace(/\D/g, "")
            .replace(/^(\d{2})(\d)/g, "($1) $2")
            .replace(/(\d)(\d{4})$/, "$1-$2")
            .substring(0, 15);
          e.target.value = formatted;
        }}
        className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 bg-white shadow-sm ${
          errors.phone
            ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        }`}
      />
      {errors.phone && (
        <p className="text-red-600 text-sm mt-1">
          {typeof errors.phone.message === "string"
            ? errors.phone.message
            : "Telefone inválido"}
        </p>
      )}
    </div>
  );
};
