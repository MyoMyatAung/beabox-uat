import {
  useChangePrivateProfileStatsMutation,
  useChangeVisibilityMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import {
  setPrivateProfile,
  setProfileData,
  setVisibility,
} from "@/store/slices/persistSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const withProfileData = (WrapperCompo: any) => {
  const HOC = (props: any) => {
    const dispatch = useDispatch();
    const persistState = useSelector((state: any) => state.persist);
    const { data, refetch, isLoading } = useGetMyProfileQuery("");
    const [changePrivateProfileStats] = useChangePrivateProfileStatsMutation();
    const [changeVisibility] = useChangeVisibilityMutation();
    const changePrivateProfileStatsHandler = async (data: any) => {
      await changePrivateProfileStats({
        // status: e.target.checked ? "on" : "off",
        status: data,
      });
      dispatch(
        setPrivateProfile(
          data
          // e.target.checked ? "on" : "off"
        )
      );
    };
    const changeVisibilityHandler = async (visibility: any) => {
      await changeVisibility({
        status: visibility,
      });
      dispatch(setVisibility(visibility));
    };
    useEffect(() => {
      dispatch(setProfileData(data?.data));
      dispatch(setPrivateProfile(data?.data?.private_profile));
      dispatch(setVisibility(data?.data?.liked_video_visibility));
    }, [data]);
    useEffect(() => {
      refetch();
    }, [persistState]);
    return (
      <WrapperCompo
        {...props}
        private_profile={persistState.private_profile}
        liked_video_visibility={persistState.visibility}
        changePrivateProfileStatsHandler={changePrivateProfileStatsHandler}
        changeVisibilityHandler={changeVisibilityHandler}
      />
    );
  };
  return HOC;
};

export default withProfileData;
