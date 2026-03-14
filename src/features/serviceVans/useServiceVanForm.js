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

  const mapTechnician = useCallback(
    (t) => ({
      ...t,
      id: t?.technician_id || t?._id || t?.id || '',
      name: t?.name || '',
    }),
    []
  );

  const mapDriver = useCallback(
    (d) => ({
      ...d,
      id: d?.driver_id || d?._id || d?.id || '',
      name: d?.name || '',
    }),
    []
  );

  const mergeUniqueById = useCallback((primaryList, secondaryList) => {
    const seen = new Set();
    const merged = [...primaryList, ...secondaryList].filter((item) => {
      const id = String(item?.id || '').trim();
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
    return merged;
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const techDetails = initialData?.technicianDetails || initialData?.technician_details;
    const driverDetails = initialData?.driverDetails || initialData?.driver_details;
    const selectedTechnician = techDetails ? mapTechnician(techDetails) : null;
    const selectedDriver = driverDetails ? mapDriver(driverDetails) : null;

    // Ensure currently assigned users remain visible while options load.
    if (selectedTechnician) setTechnicians([selectedTechnician]);
    else setTechnicians([]);
    if (selectedDriver) setDrivers([selectedDriver]);
    else setDrivers([]);

    async function fetchOptions() {
      try {
        const [techRes, driverRes] = await Promise.all([
          getTechnicians(),
          getDrivers(),
        ]);
        if (cancelled) return;
        const techList = techRes?.data || techRes || [];
        const driverList = driverRes?.data || driverRes || [];
        const mappedTechs = Array.isArray(techList) ? techList.map(mapTechnician) : [];
        const mappedDrivers = Array.isArray(driverList) ? driverList.map(mapDriver) : [];
        setTechnicians(
          mergeUniqueById(selectedTechnician ? [selectedTechnician] : [], mappedTechs)
        );
        setDrivers(mergeUniqueById(selectedDriver ? [selectedDriver] : [], mappedDrivers));
      } catch (error) {
        if (!cancelled) {
          console.log('useServiceVanForm', 'GET /technicians + GET /drivers', error);
        }
      }
    }
    fetchOptions();
    return () => { cancelled = true; };
  }, [open, initialData, mapTechnician, mapDriver, mergeUniqueById]);

  const selectedTechnicianId = useMemo(
    () =>
      initialData?.technicianId ||
      initialData?.technician_id ||
      initialData?.technicianDetails?.technician_id ||
      initialData?.technicianDetails?._id ||
      initialData?.technician_details?.technician_id ||
      initialData?.technician_details?._id ||
      '',
    [initialData]
  );

  const selectedDriverId = useMemo(
    () =>
      initialData?.driverId ||
      initialData?.driver_id ||
      initialData?.driverDetails?.driver_id ||
      initialData?.driverDetails?._id ||
      initialData?.driver_details?.driver_id ||
      initialData?.driver_details?._id ||
      '',
    [initialData]
  );

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
        vehicle_model: initialData.vehicleModel || initialData.vehicle_model || '',
        mileage: String(initialData.mileage ?? ''),
        last_service_date: initialData.lastService || initialData.last_service_date || '',
        status: initialData.status || 'active',
        technician_id: selectedTechnicianId,
        driver_id: selectedDriverId,
        image: initialData.photo || initialData.image || null,
      });
    } else {
      reset(DEFAULT_VALUES);
    }
  }, [initialData, open, reset, selectedTechnicianId, selectedDriverId]);

  useEffect(() => {
    if (!open || !isEdit) return;
    if (technicians.length > 0 && selectedTechnicianId) {
      setValue('technician_id', selectedTechnicianId);
    }
    if (drivers.length > 0 && selectedDriverId) {
      setValue('driver_id', selectedDriverId);
    }
  }, [open, isEdit, technicians, drivers, selectedTechnicianId, selectedDriverId, setValue]);

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
