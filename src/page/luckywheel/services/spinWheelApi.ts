import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_CONFIG } from "../config/api.config";
import { PrizeResponse } from "../models/prize.model";
import { Order } from "../models/order.model";
import { SpinResult } from "../models/spin-result.model";
import { PaginatedResponse } from "../models/paginated-response.model";
import { ProfileResponse } from "../models/profile.model";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";
import { RootState } from "@/store/store";

// Event types
interface Event {
  id: string;
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
}

interface EventResponse {
  status: boolean;
  message: string;
  data: Event[];
}

interface EventDetailResponse {
  status: boolean;
  message: string;
  data: Event;
}

interface OrderRequestData {
  prize_id: string;
  full_name: string;
  address: string;
  mobile_number: string;
}

const decryptResponse = (response: { data: string }) => {
  try {
    const decryptedData = decryptWithAes(response.data);
    return JSON.parse(decryptedData);
  } catch (err) {
    console.error("Error decrypting response:", err);
    throw new Error("Failed to decrypt response.");
  }
};

export const spinWheelApi = createApi({
  reducerPath: 'spinWheelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState)?.persist?.user?.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('encrypt', 'true');
      headers.set('Accept-Language', 'cn');
      headers.set('X-Client-Version', '2002');
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPrizeList: builder.query<PrizeResponse, void>({
      query: () => ({
        url: convertToSecureUrl(API_CONFIG.ENDPOINTS.SPIN_WHEEL.PRIZES),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    getOrderList: builder.query<PaginatedResponse<Order>, number>({
      query: (page = 1) => ({
        url: convertToSecureUrl(`${API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_ORDER}?page=${page}`),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    spin: builder.mutation<SpinResult, void>({
      query: () => ({
        url: convertToSecureUrl(API_CONFIG.ENDPOINTS.SPIN_WHEEL.SPIN),
        method: 'POST',
      }),
      transformResponse: decryptResponse,
    }),

    getWinHistory: builder.query<PaginatedResponse<SpinResult>, number>({
      query: (page = 1) => ({
        url: convertToSecureUrl(`${API_CONFIG.ENDPOINTS.SPIN_WHEEL.HISTORY}?page=${page}`),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    getCouponList: builder.query<any[], void>({
      query: () => ({
        url: convertToSecureUrl(API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_COUPON),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    requestOrder: builder.mutation<Order, OrderRequestData>({
      query: (data) => ({
        url: convertToSecureUrl(API_CONFIG.ENDPOINTS.SPIN_WHEEL.REQUEST_ORDER),
        method: 'POST',
        body: convertToSecurePayload(data),
        headers: {
          'Accept-Language': 'en',
        },
      }),
      transformResponse: decryptResponse,
    }),

    getProfile: builder.query<ProfileResponse, void>({
      query: () => ({
        url: convertToSecureUrl('/profile/get-own-profile'),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    getCurrentEvent: builder.query<EventResponse, void>({
      query: () => ({
        url: convertToSecureUrl('/events/current'),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),

    getEventDetails: builder.query<EventDetailResponse, string>({
      query: (eventId) => ({
        url: convertToSecureUrl(`/events/detail?event_id=${eventId}`),
        method: 'GET',
      }),
      transformResponse: decryptResponse,
    }),
  }),
});

export const {
  useGetPrizeListQuery,
  useGetOrderListQuery,
  useSpinMutation,
  useGetWinHistoryQuery,
  useGetCouponListQuery,
  useRequestOrderMutation,
  useGetProfileQuery,
  useGetCurrentEventQuery,
  useGetEventDetailsQuery,
} = spinWheelApi; 