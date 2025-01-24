import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "../ui/input";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import FollowerList from "./follow/follower-list";
import FollowingList from "./follow/following-list";
import { act, useState } from "react";

const FollowTabs = () => {
  const defaultFollowTab = useSelector(
    (state: any) => state.profile.defaultFollowTab
  );
  console.log(defaultFollowTab);
  const [active, setActive] = useState(defaultFollowTab);
  // const dispatch = useDispatch();
  return (
    <Tabs defaultValue={defaultFollowTab} className="my-5">
      <TabsList className="grid w-[200px] mx-auto grid-cols-2 bg-transparent">
        <TabsTrigger
          onClick={() => setActive("follower")}
          className="text-[#888888] data-[state=active]:text-white data-[state=active]:bg-transparent text-[15px] flex items-center"
          value="follower"
        >
          <div className="flex flex-col">
            <span className="">粉丝</span>
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
            <span className="">关注列表</span>
            <div
              className={`h-[3px] rounded-full w-[70px] ${
                active == "following" ? "bg-white" : "bg-transparent"
              }`}
            ></div>
          </div>
        </TabsTrigger>
      </TabsList>
      <div className="bg-[#1E1C28] w-full rounded-full shadow-md my-5 flex items-center pl-4">
        <FaSearch />
        <Input
          placeholder="搜索用户"
          className="bg-[#1E1C28] rounded-full border-0 focus:border-transparent focus-visible:ring-0"
        />
      </div>
      <TabsContent value="follower">
        <FollowerList />
      </TabsContent>
      <TabsContent value="following">
        <FollowingList />
      </TabsContent>
    </Tabs>
  );
};

export default FollowTabs;
