import loader from "@/page/home/vod_loader.gif";

const Loader = () => {
  return (
    <div className="w-full bg-transparent h-screen absolute flex justify-center items-center z-50">
      {/* <img src={loader} alt="" className="w-20" /> */}
      <div className="bg-[#000000E5] p-1 rounded">
        <img src={loader} alt="Loading" className="w-14" />
      </div>
    </div>
  );
};

export default Loader;
