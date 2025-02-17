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

const EditRegion = ({ province, city }: any) => {
  const { data } = useGetRegionQuery("");

  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState<any>(false);
  const region = useSelector((state: any) => state.persist.region);
  const [selectedRegion, setSelectedRegion] = useState<any>(null);

  const [selectedCity, setSelectedCity] = useState(region?.city);
  const [changeRegion, { data: cdata, error: cerror, isLoading }] =
    useChangeRegionMutation();
  const selectedRegionRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const selectedCityRef = useRef<HTMLDivElement>(null);

  const changeRegionHandler = async () => {
    const { data } = await changeRegion({
      city: selectedCity,
      province: selectedRegion?.provinceName,
    });
    if (data?.status) {
      closeRef.current?.click();
      dispatch(
        setRegion({
          city: selectedCity,
          provinceName: selectedRegion?.provinceName,
        })
      );
    }
    setIsOpen(false);
  };

  // console.log(cdata, cerror);

  useEffect(() => {
    if (isOpen == true) {
      setTimeout(() => {
        if (selectedRegionRef.current) {
          selectedRegionRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 0);
    }
  }, [isOpen, selectedRegion, region]);

  useEffect(() => {
    if (region) {
      const selected = data?.data?.filter(
        (item: any) => item?.provinceName == region?.provinceName
      );
      if (selected) setSelectedRegion(selected[0]);
    } else {
      setSelectedRegion(data?.data[0]);
    }
    // console.log(selected, "selected");
  }, [data]);

  useEffect(() => {
    dispatch(
      setRegion({
        city: city,
        provinceName: province,
      })
    );
  }, [city, province]);

  return (
    <Drawer onOpenChange={() => setIsOpen(true)}>
      <DrawerTrigger asChild>
        <div className="text-[14px] flex items-center justify-between">
          <h1>地区</h1>
          <p
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 text-[#888]"
          >
            {region?.provinceName?.length && region.city?.length
              ? `${region?.provinceName}, ${region?.city}`
              : ""}
            <FaAngleRight />
          </p>
        </div>
      </DrawerTrigger>
      <DrawerContent className="border-0 bg-[#121012]">
        {isLoading ? <Loader /> : <></>}
        <div className="w-full px-5 py-7">
          <div className="flex flex-col items-center gap-5">
            <div className="h-[180px] flex w-full gap-3">
              <div className="left  h-full flex-1 overflow-y-auto no-scrollbar space-y-5 flex flex-col items-center">
                {data?.data?.map((sregion: any) => (
                  <p
                    ref={
                      sregion?.provinceName == selectedRegion?.provinceName
                        ? selectedRegionRef
                        : null
                    }
                    className={`${
                      sregion?.provinceName == selectedRegion?.provinceName
                        ? "text-[#fff] text-[20px]"
                        : "text-[#888888] text-[16px]"
                    }`}
                    onClick={() => setSelectedRegion(sregion)}
                  >
                    {sregion?.provinceName}
                  </p>
                ))}
              </div>
              <div className="right h-full flex-1 overflow-y-auto no-scrollbar space-y-5 flex flex-col items-center">
                {selectedRegion?.cities?.map((item: any) => (
                  <p
                    // ref={selectedCity == item?.name ? selectedRegionRef : null}
                    className={`${
                      selectedCity == item?.name
                        ? "text-[#fff] text-[20px]"
                        : "text-[#888888] text-[16px]"
                    }`}
                    onClick={() => setSelectedCity(item?.name)}
                  >
                    {item?.name}
                  </p>
                ))}
              </div>
              {/* {data?.data?.map((region: any) => (
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
              ))} */}
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
                {isLoading ? <SmallLoader /> : "确认"}
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
