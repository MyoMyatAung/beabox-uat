const base_url = "http://107.148.47.94:8800/api/v1";
const token =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vMTA3LjE0OC40Ny45NDo4ODAwL2FwaS92MS9sb2dpbiIsImlhdCI6MTczNDc1OTkyNiwiZXhwIjoxNzM1MzY0NzI2LCJuYmYiOjE3MzQ3NTk5MjYsImp0aSI6IkVzdTBSMHprNGVtN1g2MloiLCJzdWIiOiI1MSIsInBydiI6IjIzYmQ1Yzg5NDlmNjAwYWRiMzllNzAxYzQwMDg3MmRiN2E1OTc2ZjcifQ.pIdIXyXOLvLXJeBpME7pIv6kJ2N7qkLyXyUvVscnkHA";

export const getMyProfile = async () => {
  const res = await fetch(`${base_url}/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  return data?.data;
};
