import {
  useChangeRegionMutation,
  useGetRegionQuery,
} from "@/store/api/profileApi";
import { FaAngleRight } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../shared/loader";
import { setRegion } from "@/store/slices/persistSlice";
import SmallLoader from "../shared/small-loader";

const EditRegion = () => {
  const { data } = useGetRegionQuery("");

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<any>(false);
  const region = useSelector((state: any) => state.persist.region);
  const [selectedRegion, setSelectedRegion] = useState<any>(region);
  //   const [changeGender] = useChangeGenderMutation();
  const [changeRegion, { isLoading }] = useChangeRegionMutation();
  const selectedRegionRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const changeRegionHandler = async () => {
    const { data } = await changeRegion(selectedRegion);
    if (data?.status) {
      closeRef.current?.click();
      dispatch(setRegion(selectedRegion));
    }
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen == true) {
      setSelectedRegion(region);
      setTimeout(() => {
        if (selectedRegionRef.current) {
          selectedRegionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 0);
    }
  }, [isOpen, region]);

  return (
    <Drawer onOpenChange={() => setIsOpen(true)}>
      <div className="text-[14px] flex items-center justify-between">
        <h1>地区</h1>
        <DrawerTrigger asChild>
          <p
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 text-[#888]"
          >
            {region?.province}, {region?.city} <FaAngleRight />
          </p>
        </DrawerTrigger>
      </div>
      <DrawerContent className="border-0 bg-[#121012]">
        {isLoading ? <Loader /> : <></>}
        <div className="w-full px-5 py-7">
          <div className="flex flex-col items-center gap-5">
            <div className="h-[180px] overflow-scroll no-scrollbar w-full space-y-5">
              {data?.data?.map((region: any) => (
                <React.Fragment key={region?.provinceName}>
                  <div
                    ref={
                      selectedRegion?.city === region?.cities[0]?.name &&
                      selectedRegion.province === region?.provinceName
                        ? selectedRegionRef
                        : null
                    }
                    className={`flex gap-5 justify-around items-center ${
                      selectedRegion?.city == region?.cities[0]?.name &&
                      selectedRegion.province == region?.provinceName
                        ? "text-[#fff] text-[20px]"
                        : "text-[#888888] text-[16px]"
                    } `}
                    onClick={() =>
                      setSelectedRegion({
                        city: region?.cities[0]?.name,
                        province: region?.provinceName,
                      })
                    }
                  >
                    <p>{region?.provinceName}</p>
                    <p>{region?.cities[0]?.name}</p>
                  </div>
                  <div className="w-full h-[1px] bg-[#FFFFFF0A]"></div>
                </React.Fragment>
              ))}
            </div>
            <div className="flex gap-5 w-full">
              {/* <DrawerClose asChild> */}
              <Button
                onClick={() => {
                  closeRef.current?.click();
                  setIsOpen(false);
                }}
                className="w-full rounded-lg bg-[#FFFFFF0A] hover:bg-[#FFFFFF0A]"
              >
                取消
              </Button>
              {/* </DrawerClose> */}
              <Button
                onClick={() => changeRegionHandler()}
                className="w-full rounded-lg bg-[#CD3EFF1F] hover:bg-[#CD3EFF1F] text-[#CD3EFF]"
              >
                {isLoading ? <SmallLoader /> : "节省"}
                {/* Save */}
              </Button>
            </div>
          </div>
          <DrawerClose ref={closeRef} className="hidden" />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditRegion;
