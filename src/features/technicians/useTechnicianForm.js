import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo } from 'react';
import { DEFAULT_COUNTRY_CODE } from './constants';
import { parseContactToCountryCodeAndPhone, validateCivilId, getRatingVal } from './helpers';

const DEFAULT_VALUES = {
  name: '',
  country_code: DEFAULT_COUNTRY_CODE,
  contact: '',
  email: '',
  password: '',
  civil_id: '',
  nationality: '',
  gender: 'male',
  status: 'active',
  image: null,
  rating: '0',
};

export function useTechnicianForm(initialData, open) {
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
      const parsedContact = parseContactToCountryCodeAndPhone(
        initialData.contact,
        DEFAULT_COUNTRY_CODE
      );
      const country_code = String(initialData.country_code || '').replace(/\D/g, '') || parsedContact.country_code;
      const phone = (initialData.contact || parsedContact.phone || '').replace(/\D/g, '').slice(0, 15);
      reset({
        name: initialData.name || '',
        country_code,
        contact: phone,
        email: initialData.email || '',
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
      setValue('image', file, { shouldValidate: true });
      clearErrors('image');
    },
    [setValue, clearErrors]
  );

  const buildPayload = useCallback((data) => {
    const ratingVal = getRatingVal(data.rating);
    const countryCode = (data.country_code || '').replace(/\D/g, '') || DEFAULT_COUNTRY_CODE;
    const phoneDigits = (data.contact || '').trim().replace(/\D/g, '');
    const payload = {
      name: (data.name || '').trim(),
      country_code: phoneDigits ? `+${countryCode}` : '',
      contact: phoneDigits,
      email: (data.email || '').trim(),
      civil_id: (data.civil_id || '').trim(),
      nationality: (data.nationality || '').trim(),
      gender: data.gender || 'male',
      status: data.status || 'active',
      rating: ratingVal,
    };
    const passwordVal = (data.password || '').trim();
    if (passwordVal) {
      payload.password = passwordVal;
    }
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
    country_code: {},
    contact: {
      required: 'Contact is required',
      minLength: { value: 8, message: 'Contact must be 8-15 digits' },
      maxLength: { value: 15, message: 'Contact must be 8-15 digits' },
    },
    email: {
      required: 'Email is required',
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Enter a valid email',
      },
    },
    password: (isEdit
      ? { minLength: { value: 6, message: 'Password must be at least 6 characters' } }
      : {
          required: 'Password is required',
          minLength: { value: 6, message: 'Password must be at least 6 characters' },
        }),
    civil_id: {
      required: 'Civil ID is required',
    },
    gender: {
      required: 'Gender is required',
    },
    status: {
      required: 'Status is required',
    },
    image: isEdit
      ? {}
      : {
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
    clearErrors,
    setImageFromFile,
    buildPayload,
    validationRules,
    isEdit,
  };
}
