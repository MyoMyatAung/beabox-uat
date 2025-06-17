export interface RequestDetail {
  key: string;
  type: string;
  label: string;
  title: string;
  required: boolean;
}

export interface Prize {
  id: string;
  name: string;
  image: string;
  content: string;
  type: 'cash_payment' | 'appreciation' | 'reward';
  request_details: RequestDetail[] | null;
  probability?: number;
  point?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PrizeResponse {
  status: boolean;
  message: string;
  data: Prize[];
} 