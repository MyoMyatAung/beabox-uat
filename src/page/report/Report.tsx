import { useNavigate, useParams } from "react-router-dom";
import {
  useGetReportsQuery,
  useStoreReportMutation,
} from "../home/services/homeApi";
import "./report.css";
import { useDispatch } from "react-redux";
import { showToast } from "../home/services/errorSlice";
import loader from "../../page/home/vod_loader.gif";

const Report = () => {
  const { type, id } = useParams();

  const { data, isLoading } = useGetReportsQuery({});
  const [triggerReport] = useStoreReportMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleBack = () => {
    navigate(-1);
  };

  const handleReport = async (content: any) => {
    try {
      const response: any = await triggerReport({
        model_id: id,
        type: type,
        report_content: content,
      });

      if (response?.data) {
        dispatch(
          showToast({
            message: "您已举报过此内容",
            type: "success",
          })
        );
      } else {
        dispatch(
          showToast({
            message: "您已举报过此内容",
            type: "error",
          })
        );
      }

      navigate(-1);
    } catch (error) {
      console.log(error);
    }
  };

  const reports = data?.data;

  return (
    <div className="text-white bg-[#16131C] min-h-screen p-5">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={handleBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
          >
            <path
              d="M9.45638 0.326135C9.35813 0.242721 9.24141 0.176541 9.11291 0.131386C8.98441 0.0862314 8.84665 0.0629883 8.70753 0.0629883C8.56841 0.0629883 8.43065 0.0862314 8.30215 0.131386C8.17365 0.176541 8.05693 0.242721 7.95868 0.326135L0.92714 6.28078C0.848699 6.34707 0.786466 6.42581 0.744005 6.51249C0.701544 6.59918 0.679688 6.6921 0.679688 6.78595C0.679688 6.8798 0.701544 6.97272 0.744005 7.05941C0.786466 7.14609 0.848699 7.22484 0.92714 7.29113L7.95868 13.2458C8.3733 13.5969 9.04176 13.5969 9.45638 13.2458C9.87099 12.8947 9.87099 12.3286 9.45638 11.9775L3.33022 6.78237L9.46484 1.58729C9.87099 1.24334 9.87099 0.670085 9.45638 0.326135Z"
              fill="white"
            />
          </svg>
        </button>
        <div className="text-lg font-bold">举报违规内容</div>
        <div></div>
      </div>

      {isLoading ? (
        <div className="h-[80vh] flex justify-center items-center">
          <img src={loader} className="w-[100px] h-[100px]" alt="Loading" />
        </div>
      ) : (
        <div className="">
          {/* Loop Through Groups */}
          {reports &&
            Object.keys(reports).map((group) => (
              <div key={group} className="mb-7 border-b-[1px] border-[#222]">
                {/* Group Header */}
                <div className="report_title mb-2">{group}</div>
                {/* List of Reports in Group */}
                {reports[group].map((item: any) => (
                  <div
                    onClick={() => handleReport(item?.content)}
                    key={item.id}
                    className="flex justify-between items-center py-2 rounded-md mb-2"
                  >
                    <span className="report_text">{item.content}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="6"
                      height="11"
                      viewBox="0 0 6 11"
                      fill="none"
                    >
                      <path
                        d="M0.205987 0.537167C0.270848 0.472142 0.347901 0.420552 0.432731 0.385351C0.517561 0.35015 0.608502 0.332031 0.700346 0.332031C0.79219 0.332031 0.883131 0.35015 0.967961 0.385351C1.05279 0.420552 1.12984 0.472142 1.1947 0.537167L5.83664 5.17911C5.88843 5.23078 5.92951 5.29217 5.95754 5.35974C5.98557 5.42732 6 5.49976 6 5.57292C6 5.64607 5.98557 5.71851 5.95754 5.78609C5.92951 5.85366 5.88843 5.91505 5.83664 5.96673L1.1947 10.6087C0.920991 10.8824 0.4797 10.8824 0.205987 10.6087C-0.0677252 10.335 -0.0677252 9.89366 0.205987 9.61995L4.25023 5.57012L0.200402 1.5203C-0.0677242 1.25217 -0.0677252 0.805294 0.205987 0.537167Z"
                        fill="#888888"
                      />
                    </svg>
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Report;
