import { type Control, Controller, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { type InputHTMLAttributes } from 'react';

interface FormInputProps<TFieldValues extends FieldValues> extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'name' | 'defaultValue'
> {
  control: Control<TFieldValues>;
  name: Path<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: string;
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = 'text',
  className,
  ...inputProps
}: FormInputProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col space-y-1.5">
          <Label
            htmlFor={name}
            className={`text-sm font-semibold tracking-wide ${
              error ? 'text-destructive' : 'text-foreground'
            }`}
          >
            {label}
          </Label>
          <Input
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={!!error}
            className={`border-border bg-background rounded-sm focus-visible:ring-1 ${
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'focus-visible:ring-primary'
            } ${className || ''}`}
            {...field}
            {...inputProps}
          />
          {error && (
            <span className="text-destructive mt-1 text-xs font-medium">{error.message}</span>
          )}
        </div>
      )}
    />
  );
}
