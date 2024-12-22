import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTA3LjE0OC40Ny45NDo4ODAwL2FwaS92MS9sb2dpbiIsImlhdCI6MTczNDc1OTkyNiwiZXhwIjoxNzM1MzY0NzI2LCJuYmYiOjE3MzQ3NTk5MjYsImp0aSI6IkVzdTBSMHprNGVtN1g2MloiLCJzdWIiOiI1MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.pIdIXyXOLvLXJeBpME7pIv6kJ2N7qkLyXyUvVscnkHA";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://107.148.47.94:8800/api/v1" }),
  endpoints: (builder) => ({
    getMyProfile: builder.query<any, string>({
      query: () => ({
        url: `/profile/me`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useGetMyProfileQuery } = profileApi;
