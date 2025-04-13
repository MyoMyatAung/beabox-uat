import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useNavigate } from "react-router-dom";
const Slider = ({ ads }: any) => {
  console.log(ads);
  const extendedSlides = [ads[ads.length - 1], ...ads, ads[0]];
  const [autoPlay, setAutoPlay] = useState(false);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleOnChange = (index: any) => {
    setSelectedIndex(index);
  };
  const handleBannerClick = (clickLink: string) => {
    if (clickLink && clickLink.startsWith("http")) {
      const a = document.createElement('a');
      a.href = clickLink;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.click();
    } else {
      navigate(`/player/${clickLink}`);
    }
  };
  useEffect(() => {
    setAutoPlay(true); // Activate autoPlay once on mount
  }, []);
  return (
    <>
      <Carousel
        showThumbs={false}
        showArrows={false}
        showStatus={false}
        showIndicators={false}
        autoPlay={autoPlay}
        infiniteLoop={true}
        centerMode
        centerSlidePercentage={87}
        selectedItem={selectedIndex}
        onChange={handleOnChange}
      >
        {extendedSlides?.map((banner: any, index: any) => (
          <div
            className="justify-center h-[172px] items-center px-[8px] flex flex-col relative bg-[#16131C]"
            key={index}
            onClick={() => handleBannerClick(banner?.url)}
          >
            <AsyncDecryptedImage
              className={`rounded-[12px] transition-all duration-300 ${
                selectedIndex === index
                  ? "w-[332px] h-[162px]" // Active slide size
                  : "w-[290px] h-[148px]" // Non‑active slide size
              }`}
              imageUrl={banner?.image}
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
      <ul className="flex justify-center items-center gap-[4px] w-full mt-2">
        {ads.map((_: any, dotIndex: any) => (
          <li
            key={dotIndex}
            className={`w-[6px] h-[6px] rounded-full ${
              selectedIndex === dotIndex ? "bg-white" : "bg-[#888]"
            }`}
            onClick={() => handleOnChange(dotIndex)}
            role="button"
            tabIndex={0}
          ></li>
        ))}
      </ul>
    </>
  );
};

export default Slider;
