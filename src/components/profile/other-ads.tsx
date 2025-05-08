import ImageWithPlaceholder from "@/page/explore/comp/imgPlaceHolder";
import { useSelector } from "react-redux";

const OtherAds = () => {
  const { applicationData, isLoading } = useSelector(
    (state: any) => state.explore
  );
  console.log(applicationData?.application);
  return (
    <div className="pt-5">
      {applicationData?.application?.length > 0 &&
        applicationData?.application.map((appSection: any) => (
          <div key={appSection.id} className="">
            <div className="grid grid-cols-6 gap-[5px]">
              {appSection?.apps?.map((app: any) => (
                <a
                  key={app.id}
                  href={app.url}
                  target="_blank"
                  className="flex flex-col justify-center items-center gap-[4px]"
                >
                  <ImageWithPlaceholder
                    className="min-w-[56px] min-h-[56px] rounded-[6px] border-[#222]"
                    src={app.image}
                    width={""}
                    height={""}
                    alt={app.title}
                  />
                  <h1 className="text-white text-[12px] font-[400]">
                    {app.title}
                  </h1>
                </a>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
};

export default OtherAds;
