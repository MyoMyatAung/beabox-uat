import BannerText from "./assets/banner_text.png";
import BannerGif from './assets/vid_gif1.gif';
import Title1 from './assets/download_title1.png';
import Title2 from './assets/download_title2.png';
import Title3 from './assets/download_title3.png';
import Sample1 from './assets/sample1.gif';
import Sample2 from './assets/sample2.gif';
import Sample3 from './assets/sample3.gif';
import Sample4 from './assets/sample4.gif';
import Sample5 from './assets/sample5.gif';
import Sample6 from './assets/sample6.gif';
import Footer from './assets/download_footer.gif';
import InstallationSheet from "./comp/InstallationSheet";
import { useState } from "react";
const Download = () => {
    const [showInstallationSheet, setShowInstallationSheet] = useState(false);
    const handleClose = () => {
        setShowInstallationSheet(false);
    };
    const handleOpen = () => {
        setShowInstallationSheet(true);
    };
    return <>
        <div className="max-w-screen-md bg-white mx-auto">
            <div className="relative rounded-b-2xl border-b-[#FB3470] border-b-[7px] overflow-hidden">
                <img src={BannerGif} width="100%" alt="Download Banner" />
                <img src={BannerText} alt="Download Banner" className="w-full h-auto mt-4 absolute bottom-0" />
            </div>
            <div className="p-2">
                <img src={Title1} alt="Download Banner" className="w-full h-auto mt-4" />
                <img src={Title2} alt="Download Banner" className="w-full h-auto mt-4" />
                <div className="grid grid-cols-2 gap-2 p-1 mt-4">
                    <div className="p-0.5 rounded-lg bg-[#CD3EFF]">
                        <img src={Sample1} width="100%" height={106} className="h-[106px] rounded-lg" alt="Sample 1" />
                        <div className="p-2">
                            <p className="text-xl text-white text-center">淫妻 乱伦</p>
                        </div>
                    </div>
                    <div className="p-0.5 rounded-lg bg-[#CD3EFF]">
                        <img src={Sample2} width="100%" height={106} className="h-[106px] rounded-lg" alt="Sample 1" />
                        <div className="p-2">
                            <p className="text-xl text-white text-center">淫妻 乱伦</p>
                        </div>
                    </div>
                    <div className="p-0.5 rounded-lg bg-[#CD3EFF]">
                        <img src={Sample3} width="100%" height={106} className="h-[106px] rounded-lg" alt="Sample 1" />
                        <div className="p-2">
                            <p className="text-xl text-white text-center">淫妻 乱伦</p>
                        </div>
                    </div>
                    <div className="p-0.5 rounded-lg bg-[#CD3EFF]">
                        <img src={Sample4} width="100%" height={106} className="h-[106px] rounded-lg" alt="Sample 1" />
                        <div className="p-2">
                            <p className="text-xl text-white text-center">淫妻 乱伦</p>
                        </div>
                    </div>
                </div>
                <img src={Title3} alt="Download Banner" className="w-full h-auto mt-4" />
                <div className="grid grid-cols-2 gap-2 p-1 mt-4">
                    <img src={Sample5} width="100%" height={246} className="h-[246px] rounded-lg" alt="Sample 1" />
                    <img src={Sample6} width="100%" height={246} className="h-[246px] rounded-lg" alt="Sample 1" />
                </div>
            </div>
            <img onClick={handleOpen} src={Footer} width="100%" height={98} className="h-[98ox]" alt="Sample 1" />
        </div>
        {showInstallationSheet && <InstallationSheet onClose={handleClose} />}
    </>
}

export default Download;