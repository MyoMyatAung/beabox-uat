import FilterNav from "@/components/create-center/filter-nav";
import TopNav from "@/components/create-center/top-nav";
import UploadList from "@/components/create-center/upload-list";
import { paths } from "@/routes/paths";
import { Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const YourVideos = () => {
  const navigate = useNavigate();
  return (
    <>
      {/* <div className="sticky top-0"> */}
      <TopNav
        center={"Your Videos"}
        right={<Trash onClick={() => navigate(paths.recycle)} size={18} />}
      />
      <FilterNav />
      {/* </div> */}
      <UploadList />
      <UploadList />
      <UploadList />
      <UploadList />
      <div className="pb-10"></div>
    </>
  );
};

export default YourVideos;
