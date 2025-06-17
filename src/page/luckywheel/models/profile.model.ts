export interface SecurityQuestion {
  id: string;
  user_id: string;
  security_question: string;
  answer: string;
  created_at: string;
  updated_at: string;
}

export interface MyDay {
  uploaded: boolean;
  watched: boolean;
}

export interface Profile {
  id: string;
  username: string;
  nickname: string;
  email: string | null;
  phone: string | null;
  avatar_id: string;
  cover_photo_id: string;
  profile_photo: string;
  cover_photo: string;
  gender: string;
  province: string;
  city: string;
  country: string | null;
  bio: string;
  referral_code: string;
  income_coins: number;
  main_income: number;
  other_income: number;
  total_income: number;
  coins: number;
  private: 'on' | 'off';
  liked_video_visibility: 'on' | 'off';
  content_visibility: 'public' | 'private';
  disallow_follow_request: 'on' | 'off';
  hide_bio: 'on' | 'off';
  share_region: 'on' | 'off';
  security_question: SecurityQuestion;
  is_following: boolean;
  user_code: number;
  level: string;
  level_progress: number;
  referral_by: string;
  account_type: string;
  badge: string;
  user_profile_review_status: string | null;
  user_profile_exist: boolean;
  my_day: MyDay;
  spin_wheel_chance: number;
  followers_count: number;
  following_count: number;
  likes_sum_count: number;
}

export interface ProfileResponse {
  status: boolean;
  message: string;
  data: Profile;
} 