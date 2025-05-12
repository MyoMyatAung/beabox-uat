export type EventDetail = {
  remaining_amount: string;
  duration: number;
  today_earnings: string;
  invited_people: string;
  registered_users: string;
  cumulative_earnings: string;
  this_month_earnings: string;
  last_month_earnings: string;
  event_start_time: number;
  event_end_time:number;
  server_timezone: string
}

export interface CurrentEventResponse {
  data: {
    id: string;
  };
  message: string;
  status: boolean;
}