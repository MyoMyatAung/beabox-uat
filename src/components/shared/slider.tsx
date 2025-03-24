import AsyncDecryptedImage from "@/utils/asyncDecryptedImage";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useNavigate } from "react-router-dom";
const Slider = ({ ads }: any) => {
  const [autoPlay, setAutoPlay] = useState(false);
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const handleOnChange = (index: any) => {
    setSelectedIndex(index);
  };
  const handleBannerClick = (clickLink: string) => {
    if (clickLink && clickLink.startsWith("http")) {
      window.open(clickLink, "_blank");
    } else {
      navigate(`/player/${clickLink}`);
    }
  };
  useEffect(() => {
    setAutoPlay(true); // Activate autoPlay once on mount
  }, []);
  return (
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
      {ads?.map((banner: any, index: any) => (
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
            imageUrl={banner.image}
            alt={`Slide ${index + 1}`}
          />
        </div>
      ))}
    </Carousel>
  );
};

export default Slider;
