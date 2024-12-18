import { MdChevronRight } from "react-icons/md";

const Home = () => {
  return (
    <div className="relative bg-gray-900 h-screen">
      <div className="flex items-center py-2 justify-between px-4 fixed bottom-[76px] left-0 z-50 w-full bg-black">
        <div className="flex items-center text-[15px] gap-2">
          <p className="">Collections</p>
          <p className="font-thin">Spider-man into the spider verse</p>
        </div>
        <MdChevronRight />
      </div>
      {/* <div className="h-screen -z-50">
        <div className="h-[calc(100%-76px)] w-full relative">
          <div className="bg-red-800 w-full h-full"></div>
        </div>
      </div> */}
    </div>
  );
};

export default Home;
