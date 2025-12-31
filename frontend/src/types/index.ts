export type UserRole = 'operator' | 'supervisor' | 'customer' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  siteId?: string;
}

export interface UtilityReading {
  id: string;
  equipmentType: 'chiller' | 'boiler' | 'compressor';
  equipmentId: string;
  timestamp: Date;
  operatorId: string;
  operatorName: string;
  t1: number;
  t2: number;
  p1: number;
  p2: number;
  flowRate: number;
  remarks: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface ChemicalPreparation {
  id: string;
  chemicalName: string;
  equipmentId: string;
  concentration: number;
  waterVolume: number;
  chemicalQuantity: number;
  timestamp: Date;
  operatorId: string;
  operatorName: string;
  remarks: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface AirValidation {
  id: string;
  roomName: string;
  isoClass: 5 | 6 | 7 | 8;
  roomVolume: number;
  gridReadings: number[];
  averageVelocity: number;
  flowRateCFM: number;
  totalCFM: number;
  ach: number;
  designSpec: number;
  result: 'pass' | 'fail';
  timestamp: Date;
  operatorId: string;
  operatorName: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface Instrument {
  id: string;
  name: string;
  make: string;
  model: string;
  serialNumber: string;
  calibrationDate: Date;
  calibrationDueDate: Date;
  certificateUrl?: string;
  status: 'valid' | 'expiring' | 'expired';
}

export interface Site {
  id: string;
  name: string;
  location: string;
  customerId: string;
}
