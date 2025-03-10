import FilterNav from "@/components/create-center/filter-nav";
import TopNav from "@/components/create-center/top-nav";
import UploadList from "@/components/create-center/upload-list";
import Loader from "@/components/shared/loader";
import { paths } from "@/routes/paths";
import { useGetPostListQuery } from "@/store/api/createCenterApi";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const YourVideos = () => {
  const navigate = useNavigate();
  const { data, isLoading } = useGetPostListQuery("");
  console.log(data);
  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <TopNav
            center={"Your Videos"}
            right={<Trash onClick={() => navigate(paths.recycle)} size={18} />}
          />
          <FilterNav />
          <UploadList list={data?.data} />
          <div className="pb-10"></div>
        </>
      )}
    </>
  );
};

export default YourVideos;
