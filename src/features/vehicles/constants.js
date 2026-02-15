import t1Img from '../../assets/cars/T1.png';
import t2Img from '../../assets/cars/T2.png';
import dashingImg from '../../assets/cars/DASHING.png';
import x70Img from '../../assets/cars/x70.png';
import t2IdmImg from '../../assets/cars/T2 i-DM.png';
import x70PlusImg from '../../assets/cars/X70 plus.png';
import g700Img from '../../assets/cars/G700.png';

export const CATEGORY_OPTIONS = [
  { value: 'suv', label: 'SUV' },
  { value: 'sedan', label: 'Sedan' },
  { value: 'hatchback', label: 'Hatchback' },
];

export const INITIAL_VEHICLES = [
  {
    id: 'VH-001',
    image: t1Img,
    category: 'suv',
    modelName: 'JETOUR T1',
  },
  {
    id: 'VH-002',
    image: t2Img,
    category: 'suv',
    modelName: 'JETOUR T2',
  },
  {
    id: 'VH-003',
    image: dashingImg,
    category: 'suv',
    modelName: 'JETOUR Dashing',
  },
  {
    id: 'VH-004',
    image: x70Img,
    category: 'suv',
    modelName: 'JETOUR X70',
  },
  {
    id: 'VH-005',
    image: t2IdmImg,
    category: 'suv',
    modelName: 'JETOUR T2 i-DM',
  },
  {
    id: 'VH-006',
    image: x70PlusImg,
    category: 'suv',
    modelName: 'JETOUR X70 Plus',
  },
  {
    id: 'VH-007',
    image: g700Img,
    category: 'suv',
    modelName: 'JETOUR G700',
  },
];
