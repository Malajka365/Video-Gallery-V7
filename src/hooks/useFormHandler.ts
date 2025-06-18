import { useState, useCallback } from 'react';

interface UseFormHandlerProps<T> {
  initialValues: T;
  validate: (values: T) => { [key: string]: string };
  onSubmit: (values: T) => Promise<void>;
}

interface UseFormHandlerReturn<T> {
  formData: T;
  errors: { [key: string]: string };
  isLoading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  setErrors: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
}

export function useFormHandler<T extends object>({
  initialValues,
  validate,
  onSubmit,
}: UseFormHandlerProps<T>): UseFormHandlerReturn<T> {
  const [formData, setFormData] = useState<T>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for the field being changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    // Clear submit error as well
    if (errors.submit) {
        setErrors(prev => ({
            ...prev,
            submit: '',
        }));
    }
  }, [errors]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors
    try {
      await onSubmit(formData);
    } catch (error: any) {
      // Set a general submit error, or specific if provided by onSubmit
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'An error occurred.',
      }));
    } finally {
      setIsLoading(false);
    }
  }, [formData, validate, onSubmit]);

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
    setErrors, // Expose setErrors for more complex error handling if needed outside
  };
}
