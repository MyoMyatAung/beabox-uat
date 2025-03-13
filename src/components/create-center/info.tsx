import { useGetConfigQuery } from "@/store/api/createCenterApi";
import { useEffect } from "react";

const Info = ({ status, reason }: any) => {
  const { data, refetch } = useGetConfigQuery({});
  const newData = data?.data?.creator_center_post_filter;

  const getStatusConfig = (status: any) => {
    return (
      newData?.find((item: any) => item.keyword === status) || {
        title: status,
        bg_color_code: "#3e3c45", // Default bg color
        text_color_code: "white", // Default text color
      }
    );
  };

  const { title, bg_color_code, text_color_code } = getStatusConfig(status);
  useEffect(() => {
    refetch();
  }, [status]);
  return (
    <div className={`bg-[${bg_color_code}] m-5 p-3 rounded-[12px]`}>
      <p>
        <span
          className={`text-[${text_color_code}] text-[18px] capitalize font-semibold`}
        >
          {status} -
        </span>
        <span className={`text-[16px] text-[${text_color_code}]`}>
          {reason}
        </span>
      </p>
    </div>
  );
};

export default Info;
