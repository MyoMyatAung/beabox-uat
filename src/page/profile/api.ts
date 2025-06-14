const base_url = import.meta.env.VITE_API_URL;
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTA3LjE0OC40Ny45NDo4ODAwL2FwaS92MS9sb2dpbiIsImlhdCI6MTczNDc1OTkyNiwiZXhwIjoxNzM1MzY0NzI2LCJuYmYiOjE3MzQ3NTk5MjYsImp0aSI6IkVzdTBSMHprNGVtN1g2MloiLCJzdWIiOiI1MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.pIdIXyXOLvLXJeBpME7pIv6kJ2N7qkLyXyUvVscnkHA";

import { getDeviceInfo } from "@/lib/deviceInfo";

export const getMyProfile = async () => {
  const deviceInfo = getDeviceInfo();
  const res = await fetch(`${base_url}/profile/me`, {
    headers: {
      "X-Client-Version": "2002",
      "Device-Id": deviceInfo.uuid,
      "User-Agent": deviceInfo.osVersion,
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data?.data;
};
