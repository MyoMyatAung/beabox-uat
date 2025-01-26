import { dateForamtter } from "@/lib/utils";

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

const OtherNoti = ({ item }: any) => {
  return (
    <>
      <div className="flex items-start gap-2">
        <img
          src={
            item?.metadata?.image ||
            "https://i.pinimg.com/236x/80/b6/b6/80b6b647fbd4929f1f5ad0affeab7e21.jpg"
          }
          className="w-10 h-10 object-cover rounded-full"
          alt=""
        />
        <div className="w-full">
          <div className="flex items-center text-[14px] justify-between">
            <p>{item.title}</p>
            {/* <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> */}
          </div>
          <div className="flex items-end justify-between w-full ">
            <p className="text-[10px] w-[80%] text-[#888]">{item.message}</p>
            <p className="text-[10px] text-[#888]">
              {dateForamtter(item?.created_at)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default OtherNoti;
