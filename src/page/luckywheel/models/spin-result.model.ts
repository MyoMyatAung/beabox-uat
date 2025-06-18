import { Prize } from './prize.model';

export interface SpinResult {
  status: boolean;
  message: string;
  data: Prize;
} 