import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_COUNTRY_CODE } from './constants';
import { buildDriverContactFieldsFromApi, getRatingVal } from './helpers';

const DEFAULT_VALUES = {
  name: '',
  country_code: DEFAULT_COUNTRY_CODE,
  contact: '',
  password: '',
  civil_id: '',
  nationality: '',
  gender: 'male',
  status: 'active',
  image: null,
  rating: '0',
};

export function useDriverForm(initialData, open) {
  const isEdit = Boolean(initialData?.id);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors,
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
      const { countryCode, localPhone } = buildDriverContactFieldsFromApi({
        country_code: initialData.countryCode ?? initialData.country_code,
        contact:
          initialData.localPhone !== undefined
            ? initialData.localPhone
            : initialData.contact,
      });
      reset({
        name: initialData.name || '',
        country_code: countryCode,
        contact: localPhone,
        password: initialData.password || '',
        civil_id: initialData.civilId || initialData.civil_id || '',
        nationality: initialData.nationality || '',
        gender: initialData.gender || 'male',
        status: initialData.status || 'active',
        image: initialData.photo || initialData.image || null,
        rating: String(initialData.rating ?? '0'),
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, open, reset]);

  const setImageFromFile = useCallback(
    (file) => {
      if (!file) return;
      clearErrors('image');
      setValue('image', file, { shouldValidate: true });
    },
    [setValue, clearErrors]
  );

  const buildPayload = useCallback((data) => {
    const ratingVal = getRatingVal(data.rating);
    const countryCodeDigits =
      (data.country_code || '').replace(/\D/g, '') || DEFAULT_COUNTRY_CODE;
    const phoneDigits = (data.contact || '').trim().replace(/\D/g, '');
    const payload = {
      name: (data.name || '').trim(),
      country_code: `+${countryCodeDigits}`,
      contact: phoneDigits,
      password: (data.password || '').trim(),
      civil_id: (data.civil_id || '').trim(),
      nationality: (data.nationality || '').trim(),
      gender: data.gender || 'male',
      status: data.status || 'active',
      rating: ratingVal,
    };
    if (data.image instanceof File) {
      payload.image = data.image;
    } else if (data.image && typeof data.image === 'string') {
      payload.image = data.image.trim();
    }
    return payload;
  }, []);

  const validationRules = {
    name: {
      required: 'Name is required',
    },
    country_code: {
      required: 'Country code is required',
      validate: (v) => {
        const d = String(v || '').replace(/\D/g, '');
        if (!d) return 'Country code is required';
        if (d.length < 1 || d.length > 3) return 'Use 1–3 digits';
        return true;
      },
    },
    contact: {
      required: 'Phone number is required',
      minLength: { value: 8, message: 'Phone number must be 8–15 digits' },
      maxLength: { value: 15, message: 'Phone number must be 8–15 digits' },
    },
    password: {
      required: 'Password is required',
      minLength: { value: 6, message: 'Password must be at least 6 characters' },
    },
    civil_id: {
      required: 'Civil ID is required',
    },
    gender: {
      required: 'Gender is required',
    },
    status: {
      required: 'Status is required',
    },
    image: {
      required: 'Image is required',
      validate: (v) =>
        (v instanceof File || (v && String(v).trim())) ? true : 'Image is required',
    },
    rating: {
      validate: (v) => {
        const num = getRatingVal(v);
        return (num >= 0 && num <= 5) || 'Rating must be 0-5';
      },
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
