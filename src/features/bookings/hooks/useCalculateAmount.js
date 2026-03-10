import { useCallback, useState, useEffect } from 'react';
import { calculatePackagePrice } from '../../../api/packages';
import { getServiceFee } from '../../../api/settings';

export function useCalculateAmount(isModalOpen) {
  const [isCalculatingAmount, setIsCalculatingAmount] = useState(false);
  const [serviceFee, setServiceFee] = useState(null);

  useEffect(() => {
    if (!isModalOpen) {
      setServiceFee(null);
      return;
    }

    async function fetchServiceFee() {
      try {
        const response = await getServiceFee();
        const fee = response?.data?.service_fee ?? response?.service_fee ?? 0;
        setServiceFee(fee);
        console.log('useCalculateAmount', 'GET /admin/settings/service-fee', 'Response:', response);
      } catch (error) {
        console.log('useCalculateAmount', 'GET /admin/settings/service-fee', 'Error:', error);
        setServiceFee(0);
      }
    }

    fetchServiceFee();
  }, [isModalOpen]);

  const calculateAmount = useCallback(async ({ packageId, vehicleId, mileage }) => {
    if (!packageId || !vehicleId || typeof mileage !== 'number' || Number.isNaN(mileage)) {
      return null;
    }

    setIsCalculatingAmount(true);

    try {
      const response = await calculatePackagePrice({
        package_id: packageId,
        vehicle: {
          vehicle_id: vehicleId,
          mileage,
        },
      });

      console.log('useCalculateAmount', 'POST /packages/calculate-price', 'Response:', response);

      if (response?.success && response?.price != null) {
        const fee = serviceFee ?? 0;
        const totalAmount = Number(response.price) + Number(fee);
        return totalAmount;
      }

      return null;
    } catch (error) {
      console.log('useCalculateAmount', 'POST /packages/calculate-price', 'Error:', error);
      return null;
    } finally {
      setIsCalculatingAmount(false);
    }
  }, [serviceFee]);

  return {
    calculateAmount,
    isCalculatingAmount,
    serviceFee,
  };
}
