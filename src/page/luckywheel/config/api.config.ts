export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL,
  ENDPOINTS: {
    SPIN_WHEEL: {
      PRIZES: "/spin-wheel/prizes",
      MY_ORDER: "/spin-wheel/my-order",
      SPIN: "/spin-wheel/spin",
      HISTORY: "/spin-wheel/history",
      MY_COUPON: "/spin-wheel/my-coupon",
      REQUEST_ORDER: "/spin-wheel/request-order",
    },
  },
} as const;
