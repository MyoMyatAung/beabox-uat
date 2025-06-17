import axios from "axios";
import { API_CONFIG } from "../config/api.config";
import { Prize, PrizeResponse } from "../models/prize.model";
import { Order } from "../models/order.model";
import { SpinResult } from "../models/spin-result.model";
import { PaginatedResponse } from "../models/paginated-response.model";
import { Profile, ProfileResponse } from "../models/profile.model";
import { convertToSecurePayload, convertToSecureUrl } from "@/lib/encrypt";
import { decryptWithAes } from "@/lib/decrypt";
// import { convertToSecureUrl } from "../libs/encrypt";
// import { decryptWithAes } from "../libs/decrypt";
// import { convertToSecurePayload } from "@/lib/encrypt";

// Add event types
interface Event {
  id: string;
  type: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
  // Add other event properties as needed
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

const encryptRes = (data: any) => {
  try {
    const decryptedData = decryptWithAes(data?.data);
    return JSON.parse(decryptedData);
  } catch (err) {
    console.error("Error decrypting response:", err);
    throw new Error("Failed to decrypt response.");
  }
};

class SpinWheelService {
  private token: string;

  constructor(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      encrypt: "true",
      Authorization: `Bearer ${this.token}`,
      "Accept-Language": "cn",
      "X-Client-Version": "2002",
    };
  }

  // // Get prize list
  // async getPrizeList(type: string = ""): Promise<PrizeResponse> {
  //   try {
  //     const response = await axios.get(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.PRIZES}`,
  //       {
  //         headers: this.getHeaders(),
  //         params: { type },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async getPrizeList(type: string = ""): Promise<PrizeResponse> {
    try {
      const response = await axios.get(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.PRIZES}`
        ),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get order list
  // async getOrderList(page: number = 1): Promise<PaginatedResponse<Order>> {
  //   try {
  //     const response = await axios.get(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_ORDER}`,
  //       {
  //         headers: this.getHeaders(),
  //         params: { page },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async getOrderList(page: number = 1): Promise<PaginatedResponse<Order>> {
    try {
      const response = await axios.get(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_ORDER}?page=${page}`
        ),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // async spin(): Promise<SpinResult> {
  //   try {
  //     const response = await axios.post(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.SPIN}`,
  //       {},
  //       {
  //         headers: this.getHeaders(),
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async spin(): Promise<SpinResult> {
    try {
      const response = await axios.post(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.SPIN}`
        ),
        {},
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // // Get win history
  // async getWinHistory(
  //   page: number = 1
  // ): Promise<PaginatedResponse<SpinResult>> {
  //   try {
  //     const response = await axios.get(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.HISTORY}`,
  //       {
  //         headers: this.getHeaders(),
  //         params: { page },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // Get win history
  async getWinHistory(
    page: number = 1
  ): Promise<PaginatedResponse<SpinResult>> {
    try {
      const response = await axios.get(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.HISTORY}?page=${page}`
        ),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // // Get coupon list
  // async getCouponList(): Promise<any[]> {
  //   try {
  //     const response = await axios.get(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_COUPON}`,
  //       {
  //         headers: this.getHeaders(),
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  // Get coupon list
  async getCouponList(): Promise<any[]> {
    try {
      const response = await axios.get(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.MY_COUPON}`
        ),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // // Request order
  // async requestOrder(data: {
  //   prize_id: string;
  //   full_name: string;
  //   address: string;
  //   mobile_number: string;
  // }): Promise<Order> {
  //   try {
  //     const response = await axios.post(
  //       `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.REQUEST_ORDER}`,
  //       data,
  //       {
  //         headers: {
  //           ...this.getHeaders(),
  //           "Accept-Language": "en",
  //         },
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async requestOrder(data: {
    prize_id: string;
    full_name: string;
    address: string;
    mobile_number: string;
  }): Promise<Order> {
    try {
      const response = await axios.post(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SPIN_WHEEL.REQUEST_ORDER}`
        ),
        convertToSecurePayload(data),

        {
          headers: {
            ...this.getHeaders(),
            "Accept-Language": "en",
          },
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }
  // // Get profile
  // async getProfile(): Promise<ProfileResponse> {
  //   try {
  //     const response = await axios.get(
  //       `${API_CONFIG.BASE_URL}/profile/get-own-profile`,
  //       {
  //         headers: this.getHeaders(),
  //       }
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw this.handleError(error);
  //   }
  // }

  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await axios.get(
        convertToSecureUrl(`${API_CONFIG.BASE_URL}/profile/get-own-profile`),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get current event
  async getCurrentEvent(): Promise<EventResponse> {
    try {
      const response = await axios.get(
        convertToSecureUrl(`${API_CONFIG.BASE_URL}/events/current`),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get event details by ID
  async getEventDetails(eventId: string): Promise<EventDetailResponse> {
    try {
      console.log("event id is=>", eventId);
      const response = await axios.get(
        convertToSecureUrl(
          `${API_CONFIG.BASE_URL}/events/detail?event_id=${eventId}`
        ),
        {
          headers: this.getHeaders(),
        }
      );
      return encryptRes(response.data);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      return new Error(error.response?.data?.message || "An error occurred");
    }
    return error;
  }
}

export default SpinWheelService;
