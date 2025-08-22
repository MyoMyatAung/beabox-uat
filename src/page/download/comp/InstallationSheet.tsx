import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import OtherContent from "./OtherContent";

type Props = {
    onClose: () => void;
}

const InstallationSheet: React.FC<Props> = ({ onClose }) => {
    return <>
        <div className="fixed bottom-0 px-4 h-4/5 overflow-y-auto rounded-t-xl bg-black w-full">
            <div className="flex items-center justify-between mb-2 sticky pt-2 top-0 bg-black z-10">
                <h1 className="text-center flex-1">Installation Tutorial</h1>
                <button onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="24" height="24" rx="12" fill="white" fill-opacity="0.04" />
                        <path d="M12 11.1668L14.9168 8.25L15.75 9.0832L12.8332 12L15.75 14.9168L14.9168 15.75L12 12.8332L9.0832 15.75L8.25 14.9168L11.1668 12L8.25 9.0832L9.0832 8.25L12 11.1668Z" fill="white" fill-opacity="0.8" />
                    </svg>
                </button>
            </div>
            <Tabs defaultValue="other" className="w-full">
                <TabsList className="bg-transparent">
                    <TabsTrigger className="text-white text-sm data-[state=active]:bg-transparent border-b border-b-transparent rounded-none data-[state=active]:border-b-[#FF70C6] data-[state=active]:border-b data-[state=active]:text-white" value="huawei">Huawei</TabsTrigger>
                    <TabsTrigger className="text-white text-sm data-[state=active]:bg-transparent border-b border-b-transparent rounded-none data-[state=active]:border-b-[#FF70C6] data-[state=active]:border-b data-[state=active]:text-white" value="xiaomi">Xiaomi</TabsTrigger>
                    <TabsTrigger className="text-white text-sm data-[state=active]:bg-transparent border-b border-b-transparent rounded-none data-[state=active]:border-b-[#FF70C6] data-[state=active]:border-b data-[state=active]:text-white" value="vivo">Vivo</TabsTrigger>
                    <TabsTrigger className="text-white text-sm data-[state=active]:bg-transparent border-b border-b-transparent rounded-none data-[state=active]:border-b-[#FF70C6] data-[state=active]:border-b data-[state=active]:text-white" value="oppo">Oppo</TabsTrigger>
                    <TabsTrigger className="text-white text-sm data-[state=active]:bg-transparent border-b border-b-transparent rounded-none data-[state=active]:border-b-[#FF70C6] data-[state=active]:border-b data-[state=active]:text-white" value="other">Other</TabsTrigger>
                </TabsList>
                <TabsContent value="other">
                    <OtherContent />
                </TabsContent>
                <TabsContent value="huawei">
                    <OtherContent />
                </TabsContent>
                <TabsContent value="xiaomi">
                    <OtherContent />
                </TabsContent>
                <TabsContent value="vivo">
                    <OtherContent />
                </TabsContent>
                <TabsContent value="oppo">
                    <OtherContent />
                </TabsContent>
            </Tabs>
        </div>
    </>
}

export default InstallationSheet;