const demodata = [
  { name: "Dee", msg: "Started following you" },
  { name: "Dee Dee", msg: "posted a video" },
  { name: "Ken", msg: "commented your video" },
  { name: "James", msg: "liked your video" },
  { name: "May", msg: "Started following you" },
  { name: "John", msg: "reply to your comment" },
  { name: "Doe", msg: "Started following you" },
  { name: "Dee", msg: "Started following you" },
  { name: "Dee Dee", msg: "posted a video" },
  { name: "Ken", msg: "commented your video" },
  { name: "James", msg: "liked your video" },
  { name: "May", msg: "Started following you" },
  { name: "John", msg: "reply to your comment" },
  { name: "Doe", msg: "Started following you" },
];

const OtherNoti = () => {
  return (
    <>
      {demodata.map((item) => (
        <div className="flex items-start gap-2" key={item.name}>
          <img
            src="https://i.pinimg.com/236x/5a/ee/d9/5aeed9e9e4bcc16503f5c982e649fee0.jpg"
            className="w-10 h-10 object-cover rounded-full"
            alt=""
          />
          <div className="w-full">
            <div className="flex items-center text-[14px] justify-between">
              <p>{item.name}</p>
              {/* <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> */}
            </div>
            <div className="flex items-end justify-between w-full ">
              <p className="text-[10px] w-[80%] text-[#888]">{item.msg}</p>
              <p className="text-[10px] text-[#888]">1 day</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default OtherNoti;
