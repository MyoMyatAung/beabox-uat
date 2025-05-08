import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { act, useState } from "react";
import { Input } from "@/components/ui/input";
import FollowerList2 from "./follower-list2";
import FollowingList2 from "./following-list2";
import { useGetMyOwnProfileQuery } from "@/store/api/profileApi";
import FollowerList from "./follower-list";
import FollowingList from "./following-list";

const FollowTabs2 = ({ id, defaultFollowTab, closeTab }: any) => {
  const user = useSelector((state: any) => state?.persist?.user) || "";
  const { data: userData } = useGetMyOwnProfileQuery("", {
    skip: !user,
  });
  const me = userData?.data;

  const [active, setActive] = useState(defaultFollowTab);
  const [searchTerm, setSearchTerm] = useState<any>("");
  return (
    <Tabs defaultValue={defaultFollowTab} className="flex flex-col">
      <div className="bg-[#16131C] w-full z-[1500] sticky top-[45px]">
        <div className="w-full bg-[#16131C] z-[1500]">
          <TabsList className="grid w-[200px] mx-auto grid-cols-2 bg-transparent">
            <TabsTrigger
              onClick={() => setActive("follower")}
              className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent text-[15px] flex items-center"
              value="follower"
            >
              <div className="flex flex-col ">
                <span className="font-[16px]">粉丝</span>
                <div
                  className={`h-[3px] rounded-full w-[50px] ${
                    active == "follower" ? "bg-white" : "bg-transparent"
                  }`}
                ></div>
              </div>
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setActive("following")}
              className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent text-[15px] flex items-center"
              value="following"
            >
              <div className="flex flex-col">
                <span className="font-[16px]">关注列表</span>
                <div
                  className={`h-[3px] rounded-full w-[70px] ${
                    active == "following" ? "bg-white" : "bg-transparent"
                  }`}
                ></div>
              </div>
            </TabsTrigger>
          </TabsList>
        </div>
        <div className="py-2">
          <div className="bg-[#1E1C28] w-full rounded-full shadow-md flex items-center pl-4">
            <FaSearch />
            <Input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索用户"
              className="bg-[#1E1C28] rounded-full border-0 focus:border-transparent focus-visible:ring-0"
            />
          </div>
        </div>
      </div>
      <div className="py-3 px-2 flex-1">
        <TabsContent value="follower">
          <FollowerList searchTerm={searchTerm} id={id} allowToFetch={false} />
        </TabsContent>
        <TabsContent value="following">
          <FollowingList searchTerm={searchTerm} id={id} allowToFetch={false} />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default FollowTabs2;
