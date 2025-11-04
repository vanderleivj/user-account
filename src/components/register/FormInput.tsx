import { Controller } from "react-hook-form";
import type { Control, FieldErrors } from "react-hook-form";

interface FormInputProps {
  readonly control: Control<any>;
  readonly name: string;
  readonly label: string;
  readonly type?: string;
  readonly placeholder?: string;
  readonly errors: FieldErrors<any>;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly min?: string;
  readonly max?: string;
  readonly helperText?: string;
  readonly getInputClasses?: (fieldError: any, isLoading?: boolean) => string;
  readonly isLoading?: boolean;
}

export function FormInput({
  control,
  name,
  label,
  type = "text",
  placeholder,
  errors,
  required = false,
  disabled = false,
  min,
  max,
  helperText,
  getInputClasses,
  isLoading = false,
}: FormInputProps) {
  const fieldError = errors[name];
  let inputClasses: string;
  if (getInputClasses) {
    inputClasses = getInputClasses(fieldError, isLoading);
  } else if (fieldError) {
    inputClasses =
      "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100 bg-white/80 backdrop-blur-sm";
  } else {
    inputClasses =
      "border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 bg-white/80 backdrop-blur-sm";
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-slate-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            disabled={disabled || isLoading}
            min={min}
            max={max}
            className={`w-full px-4 py-3 text-base rounded-full border transition-all duration-200 ${inputClasses}`}
          />
        )}
      />
      {fieldError && (
        <p className="text-red-600 text-sm mt-1">
          {fieldError.message as string}
        </p>
      )}
      {helperText && !fieldError && (
        <p className="text-slate-500 text-sm">{helperText}</p>
      )}
    </div>
  );
}
