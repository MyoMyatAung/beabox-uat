import {
  useGetFollowerListQuery,
  useGetFollowingListQuery,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const withFollowData = (WrapperCompo: any) => {
  const HOC = (props: any) => {
    const dispatch = useDispatch();
    const { data } = useGetMyProfileQuery("");

    const user_code = data
      ? data?.data?.user_code
      : useSelector((state: any) => state.persist.profileData?.user_code);
    const user_id = data
      ? data?.data?.id
      : useSelector((state: any) => state?.persist?.user?.id);
    // const user_code = data?.data?.user_code;
    // const user_id = data?.data?.id;

    // console.log(user_id, user_code);
    const nickname = useSelector((state: any) => state?.persist?.user?.nickname);
    const isDrawerOpen = useSelector(
      (state: any) => state.profile.isDrawerOpen
    );

    // const {
    //   data: followers,
    //   isLoading: followersLoading,
    //   refetch: followerRefetch,
    // } = useGetFollowerListQuery(user_code);
    // const {
    //   data: following,
    //   isLoading: followingLoading,
    //   refetch: followingRefetch,
    // } = useGetFollowingListQuery(user_id);
    // useEffect(() => {
    //   followerRefetch();
    //   followingRefetch();
    // }, [isDrawerOpen]);
    return (
      <WrapperCompo
        {...props}
        // followers={followers?.data}
        // following={following?.data}
        // followersLoading={followersLoading}
        // followingLoading={followingLoading}
        nickname={nickname}
      />
    );
  };
  return HOC;
};

export default withFollowData;
