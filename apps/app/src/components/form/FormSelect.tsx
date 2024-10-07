import type { InputProps } from 'ui';
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'ui';
import type { FieldValues, Path, PathValue } from 'react-hook-form';
import { useFormContext, useController } from 'react-hook-form';
import { FormControl } from 'ui/src/components/ui/form';
import { useState } from 'react';
import { FormFieldset } from './FormFieldset';

export type FormSelectProps<T> = Omit<
  InputProps,
  'id' | 'name' | 'invalid' | 'readOnly'
> & {
  path: Path<T>;
  label?: string;
  options: {
    label: string;
    value: PathValue<T, Path<T>>;
  }[];
};

export function FormSelect<T extends FieldValues>({
  path,
  placeholder,
  options,
  label,
  onChange,
  disabled,
  children,
}: FormSelectProps<T>) {
  const { control, setValue } = useFormContext<T>();

  const { field, fieldState } = useController<T>({
    name: path,
    control,
  });

  const [open, setOpen] = useState(false);

  return (
    <FormFieldset<T> label={label} path={path}>
      <Popover
        onOpenChange={v => {
          setOpen(v);
        }}
        open={open}
      >
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              className={cn(
                'w-full justify-between',
                !field.value && 'text-muted-foreground',
                fieldState.invalid && 'border-red-500',
              )}
              disabled={disabled}
              role='combobox'
              variant='outline'
            >
              <span className='truncate'>
                {field.value
                  ? options.find(option => option.value === field.value)?.label
                  : placeholder}
              </span>
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className='w-[200px] p-0'>
          <Command>
            <CommandInput className='h-9' placeholder={placeholder} />
            <CommandEmpty>No option found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange && onChange(option.value);
                      setValue(path, option.value);
                      setOpen(false);
                    }}
                    value={option.value}
                  >
                    {option.label}
                  </CommandItem>
                ))}
                {children}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </FormFieldset>
  );
}
