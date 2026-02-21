import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';

const DEFAULT_VALUES = {
  vehicle_model: '',
  mileage: '',
  last_service_date: '',
  status: 'active',
  image: null,
};

export function useServiceVanForm(initialData, open) {
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

  const image = watch('image');

  const imagePreview = useMemo(() => {
    if (!image) return '';
    if (image instanceof File) return URL.createObjectURL(image);
    return String(image);
  }, [image]);

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
        vehicle_model: initialData.vehicleModel || '',
        mileage: String(initialData.mileage ?? ''),
        last_service_date: initialData.lastService || '',
        status: initialData.status || 'active',
        image: initialData.photo || initialData.image || null,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, open, reset]);

  const setImageFromFile = useCallback(
    (file) => {
      if (!file) return;
      setValue('image', file, { shouldValidate: true });
    },
    [setValue]
  );

  const buildPayload = useCallback((data) => {
    const mileageNum = parseInt(String(data.mileage || '0'), 10);
    const payload = {
      vehicle_model: (data.vehicle_model || '').trim(),
      mileage: Number.isNaN(mileageNum) ? 0 : Math.max(0, mileageNum),
      last_service_date: (data.last_service_date || '').trim(),
      status: data.status || 'active',
    };
    if (data.image instanceof File) {
      payload.image = data.image;
    } else if (data.image && typeof data.image === 'string') {
      payload.image = data.image.trim();
    }
    return payload;
  }, []);

  const validationRules = {
    vehicle_model: {
      required: 'Vehicle model is required',
    },
    mileage: {
      required: 'Mileage is required',
      validate: (v) => {
        const num = parseInt(String(v || '0'), 10);
        return (!Number.isNaN(num) && num >= 0) || 'Mileage must be 0 or greater';
      },
    },
    status: {
      required: 'Status is required',
    },
    image: {
      required: 'Image is required',
      validate: (v) =>
        (v instanceof File || (v && String(v).trim())) ? true : 'Image is required',
    },
  };

  return {
    register,
    control,
    handleSubmit,
    errors,
    image,
    imagePreview,
    setValue,
    setError,
    setImageFromFile,
    buildPayload,
    validationRules,
    isEdit,
  };
}
