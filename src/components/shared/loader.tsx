import loader from "@/page/home/vod_loader.gif";

const Loader = () => {
  return (
    <div className="w-full h-screen bg-transparent absolute flex justify-center items-center z-50">
      <img src={loader} alt="" className="w-20" />
    </div>
  );
};

export default Loader;
