import { useForm } from 'react-hook-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getTechnicians } from '../../api/technicians';
import { getDrivers } from '../../api/drivers';

const DEFAULT_VALUES = {
  registration_number: '',
  vehicle_model: '',
  mileage: '',
  last_service_date: '',
  status: 'active',
  technician_id: '',
  driver_id: '',
  image: null,
};

export function useServiceVanForm(initialData, open) {
  const isEdit = Boolean(initialData?.id);
  const [technicians, setTechnicians] = useState([]);
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    async function fetchOptions() {
      try {
        const [techRes, driverRes] = await Promise.all([
          getTechnicians(),
          getDrivers(),
        ]);
        if (cancelled) return;
        const techList = techRes?.data || techRes || [];
        const driverList = driverRes?.data || driverRes || [];
        const mapTech = (t) => ({
          ...t,
          id: t.technician_id || t._id || t.id,
          name: t.name || '',
        });
        const mapDriver = (d) => ({
          ...d,
          id: d.driver_id || d._id || d.id,
          name: d.name || '',
        });
        setTechnicians(Array.isArray(techList) ? techList.map(mapTech) : []);
        setDrivers(Array.isArray(driverList) ? driverList.map(mapDriver) : []);
      } catch (error) {
        if (!cancelled) {
          console.log('useServiceVanForm', 'Failed to fetch technicians/drivers', error);
        }
      }
    }
    fetchOptions();
    return () => { cancelled = true; };
  }, [open]);

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
        registration_number: initialData.registrationNumber || initialData.registration_number || '',
        vehicle_model: initialData.vehicleModel || '',
        mileage: String(initialData.mileage ?? ''),
        last_service_date: initialData.lastService || '',
        status: initialData.status || 'active',
        technician_id: initialData.technicianId || initialData.technician_id || '',
        driver_id: initialData.driverId || initialData.driver_id || '',
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
      registration_number: (data.registration_number || '').trim(),
      vehicle_model: (data.vehicle_model || '').trim(),
      mileage: Number.isNaN(mileageNum) ? 0 : Math.max(0, mileageNum),
      last_service_date: (data.last_service_date || '').trim(),
      status: data.status || 'active',
      technician_id: (data.technician_id || '').trim() || null,
      driver_id: (data.driver_id || '').trim() || null,
    };
    if (data.image instanceof File) {
      payload.image = data.image;
    } else if (data.image && typeof data.image === 'string') {
      payload.image = data.image.trim();
    }
    return payload;
  }, []);

  const validationRules = {
    registration_number: {
      required: 'Registration number is required',
    },
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
    technicians,
    drivers,
  };
}
