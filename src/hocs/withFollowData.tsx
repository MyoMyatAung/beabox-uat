import {
  useGetFollowerListQuery,
  useGetFollowingListQuery,
} from "@/store/api/profileApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const withFollowData = (WrapperCompo: any) => {
  const HOC = (props: any) => {
    const dispatch = useDispatch();
    const user_code = useSelector(
      (state: any) => state.persist.profileData?.user_code
    );
    const user_id = useSelector((state: any) => state.persist.user?.id);
    const nickname = useSelector((state: any) => state.persist.user?.nickname);
    const { data: followers, isLoading: followersLoading } =
      useGetFollowerListQuery(user_code);
    const { data: following, isLoading: followingLoading } =
      useGetFollowingListQuery(user_id);
    return (
      <WrapperCompo
        {...props}
        followers={followers?.data}
        following={following?.data}
        followersLoading={followersLoading}
        followingLoading={followingLoading}
        nickname={nickname}
      />
    );
  };
  return HOC;
};

export default withFollowData;
