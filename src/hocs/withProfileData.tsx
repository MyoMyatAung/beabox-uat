import {
  useChangePrivateProfileStatsMutation,
  useChangeVisibilityMutation,
  useGetMyProfileQuery,
} from "@/store/api/profileApi";
import {
  setPrivateProfile,
  setProfileData,
  setSecurityQues,
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
    const [changeVisibility, { isLoading: visibilityLoading }] =
      useChangeVisibilityMutation();

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
      dispatch(
        setSecurityQues({
          ques: data?.data?.security_question,
          ans: data?.datat?.answer,
        })
      );
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
        visibilityLoading={visibilityLoading}
      />
    );
  };
  return HOC;
};

export default withProfileData;
