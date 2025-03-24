import { useGetCoverListQuery } from "@/store/api/createCenterApi";
import { X } from "lucide-react";

const Covers = ({ setShowAvatar }: any) => {
  const { data } = useGetCoverListQuery("");
  console.log(data, "covers");
  return (
    <div className="bg-[#000000CC] w-full flex justify-center items-center h-screen fixed top-0 left-0 z-[9999]">
      <div className="bg-[#16131C] rounded-[22px] w-[90%] h-[90%] flex flex-col justify-between">
        <div className="">
          <TopBar setShowAvatar={setShowAvatar} />
        </div>
        <div className="flex-1 overflow-hidden overflow-y-scroll hide-sb">
          <div className="px-5 flex flex-col gap-5">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Magni officiis, error aspernatur quia fugiat accusantium quibusdam excepturi perferendis, molestias inventore ea soluta est? Iure, sequi ut. Reprehenderit in maiores quas consequuntur repellendus dolore architecto eveniet harum consectetur repudiandae, aliquid perferendis quo quia nulla, esse eos obcaecati pariatur provident iusto eum, cum odio voluptate. Consequuntur sunt quaerat animi quo est quos commodi temporibus cum enim repellat aut, hic assumenda labore similique dicta iste ullam reiciendis, sint vel, nihil quibusdam? Libero impedit maxime nulla officiis sunt exercitationem error nemo eos. Officia amet exercitationem perspiciatis incidunt dolorum ratione aliquam soluta iure rem fugiat aliquid odio excepturi, beatae perferendis? Obcaecati illum sint et aliquid suscipit, quod esse dolores labore quibusdam cum! Molestiae, magni unde veritatis architecto, tempore vero expedita similique incidunt consectetur nihil magnam non quia debitis aliquam laboriosam! Assumenda nostrum dolores magni sint molestias porro odit explicabo, dolorem natus vel velit, aliquam doloremque dignissimos consequatur adipisci voluptatibus. Maiores asperiores odio at aperiam neque itaque recusandae hic sed unde. Qui animi id alias ratione iusto exercitationem consequuntur in ducimus dolore veniam, ut dolor vero accusamus dolorum explicabo est molestias, ipsa eum iste. Enim praesentium corporis vel inventore exercitationem totam esse dolore eaque fugit laudantium et sed nemo, autem iste explicabo unde vero adipisci dolorum sequi obcaecati ipsum quis. Nesciunt explicabo laborum provident illo repellendus culpa harum nobis voluptatum tempora unde! Natus tempore ex, optio odio dignissimos vero praesentium sunt quasi doloribus fugiat et quo deserunt perspiciatis excepturi sequi eos quisquam veritatis quis illo. Pariatur dolorem iste quo nobis nisi soluta explicabo alias tempora? Harum ipsa reprehenderit ut nesciunt molestiae fuga quaerat voluptates totam distinctio tempore, soluta eligendi assumenda nam, aliquid est ab quam id consequuntur qui sit neque laboriosam, mollitia dolorum obcaecati. Nisi omnis obcaecati magni ratione est expedita, sint temporibus. Ipsa aliquid unde assumenda quaerat accusamus dignissimos dolores, eligendi consequuntur! Accusantium reprehenderit a in, aliquam expedita neque recusandae repellat quasi officiis dolores nihil quae ullam rerum quidem culpa! Ipsam et earum quibusdam adipisci aliquam explicabo quod sint beatae officiis minus. Voluptatem, saepe itaque, fugit at molestiae ipsa consectetur maiores recusandae rerum qui delectus, dolore fugiat minus! Aspernatur, eveniet alias cumque dicta quidem quibusdam molestiae rerum repudiandae nobis impedit. Cum voluptatum odit magnam porro quae suscipit amet sed? In deleniti beatae animi dolorem praesentium. Consectetur sit totam laudantium magnam eaque reprehenderit accusamus earum velit neque molestias voluptatum nostrum ab vel temporibus ad quam fugit autem nulla, aspernatur fugiat ex! Odit quidem reiciendis maxime qui voluptatibus enim, quasi recusandae dolorum temporibus iusto laborum ad ratione praesentium fuga autem hic blanditiis eos ex dignissimos delectus? Iure doloremque inventore, accusamus ducimus hic quas. Iusto harum eveniet, facilis iste, a placeat repudiandae eos laudantium voluptatem cumque deserunt illo impedit corporis. Ad aliquid modi dolor cupiditate quaerat illo odit ipsa assumenda rem sapiente dicta possimus reprehenderit omnis ipsam, asperiores reiciendis perspiciatis unde voluptatum suscipit. Illum accusamus consequuntur nemo, aliquid quia quos quasi a consequatur libero, nobis minima, dolorem eaque dicta ad officia repudiandae velit molestiae molestias fugit corporis incidunt?
          </div>
        </div>
        <div className="p-5">
          <button
            // onClick={handleUpload}
            className="gradient-bg w-full text-[14px] py-4 rounded-[16px]"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};

export default Covers;

const TopBar = ({ setShowAvatar }: any) => {
  return (
    <div className="flex justify-between items-center p-5">
      <div className=""></div>
      <div className="">
        <p className="text-[18px]">选择头像</p>
      </div>
      <div className="">
        <button
          onClick={() => setShowAvatar(false)}
          className="bg-[#FFFFFF0A] p-1 rounded-full"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
