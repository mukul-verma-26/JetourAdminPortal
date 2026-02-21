import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { CATEGORY_OPTIONS } from './constants';

const DEFAULT_VALUES = {
  vehicle_category: CATEGORY_OPTIONS[0]?.value || 'suv',
  vehicle_model: '',
  vehicle_image: null,
};

export function useVehicleForm(initialData, open) {
  const isEdit = Boolean(initialData?.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    reset,
  } = useForm({
    defaultValues: DEFAULT_VALUES,
    mode: 'onBlur',
  });

  const vehicle_image = watch('vehicle_image');

  const imagePreview = useMemo(() => {
    if (!vehicle_image) return '';
    if (vehicle_image instanceof File) return URL.createObjectURL(vehicle_image);
    return String(vehicle_image);
  }, [vehicle_image]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      reset({
        vehicle_category: initialData.category || initialData.vehicle_category || 'suv',
        vehicle_model: initialData.modelName || initialData.vehicle_model || '',
        vehicle_image: initialData.image || initialData.vehicle_image || null,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, open, reset]);

  const setImageFromFile = useCallback(
    (file) => {
      if (!file) return;
      setValue('vehicle_image', file, { shouldValidate: true });
    },
    [setValue]
  );

  const buildPayload = useCallback((data) => {
    const categoryLabel = CATEGORY_OPTIONS.find((o) => o.value === data.vehicle_category)?.label
      || String(data.vehicle_category || '').toUpperCase();
    const payload = {
      vehicle_category: categoryLabel,
      vehicle_model: (data.vehicle_model || '').trim(),
    };
    if (data.vehicle_image instanceof File) {
      payload.vehicle_image = data.vehicle_image;
    } else if (data.vehicle_image && typeof data.vehicle_image === 'string') {
      payload.vehicle_image = data.vehicle_image.trim();
    }
    return payload;
  }, []);

  const validationRules = {
    vehicle_category: {
      required: 'Vehicle category is required',
    },
    vehicle_model: {
      required: 'Model name is required',
    },
    vehicle_image: {
      required: 'Vehicle image is required',
      validate: (v) =>
        (v instanceof File || (v && String(v).trim())) ? true : 'Vehicle image is required',
    },
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    vehicle_image,
    imagePreview,
    setValue,
    setError,
    setImageFromFile,
    buildPayload,
    validationRules,
    isEdit,
  };
}
