import loader from "@/page/home/vod_loader.gif";

const MinLoader = () => {
  return (
    <div className="w-full bg-transparent  py-5 flex justify-center items-center">
      <img src={loader} alt="" className="w-20" />
    </div>
  );
};

export default MinLoader;
