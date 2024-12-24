import React, { useState } from "react";
import Header from "./comp/Header";
import "./explore.css";
import Banner from "./comp/Banner";
import PopApp from "./comp/PopApp";
import Recommand from "./comp/Recommand";
import Latest from "./comp/Latest";

const Explore = () => {
  const [activeTab, setActiveTab] = useState("Recommend"); // State to track active tab

  return (
    <div className=" max-w-[800px] flex flex-col justify-center items-cente px-[20px] pb-[100px]">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <Banner />
      <div className="mt-[20px]">
        {activeTab === "Recommend" && (
          <div className="">
            <PopApp />
            <Recommand title="Chinese Drama" />
            <Recommand title="Latest Drama" />
          </div>
        )}
        {activeTab === "Latest" && <Latest />}
        {activeTab === "Hollywood" && <div>Hollywood Content</div>}
      </div>
    </div>
  );
};

export default Explore;
