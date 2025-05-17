import { useState } from "react";

const Ads = ({ ads, type }: { ads: any; type: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`videoFooter2 px-[10px] w-full`}
      style={{
        bottom: type === "ads_virtual" ? "10px" : "30px",
      }}
    >
      <div className="w-full">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="footer_head_text font-cnFont">{ads?.title}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
            >
              <path
                d="M15 10C15 13.0376 12.5376 15.5 9.5 15.5C6.46243 15.5 4 13.0376 4 10C4 6.96243 6.46243 4.5 9.5 4.5C12.5376 4.5 15 6.96243 15 10Z"
                fill="white"
              />
              <path
                d="M8.6718 0.602885C8.48726 0.702536 8.05175 1.07899 7.33574 1.7581C7.08846 1.99061 6.94821 2.09396 6.86332 2.11241C6.68247 2.14563 6.28018 2.09765 5.69335 1.97216C5.30951 1.89096 5.06591 1.86144 4.7522 1.85775C4.3499 1.85037 4.31669 1.85406 4.15429 1.95002C3.98821 2.04967 3.75569 2.3154 3.75569 2.41136C3.75569 2.4372 3.73355 2.51101 3.70402 2.57745C3.67449 2.64388 3.62651 2.79151 3.59699 2.90224C3.51948 3.19012 3.42721 3.55181 3.36816 3.78802C3.2316 4.34164 3.19838 4.43391 3.10612 4.52987C3.04337 4.5963 2.75549 4.74024 2.31998 4.92847C0.92856 5.52637 0.766167 5.64448 0.677588 6.12059C0.640681 6.32358 0.795693 6.93625 1.17215 8.06931C1.27918 8.3941 1.29764 8.53804 1.24228 8.66722C1.21644 8.73365 0.97285 9.1138 0.707114 9.5161C-0.0125858 10.5901 -0.0827105 10.771 0.0612296 11.1622C0.164571 11.4316 0.419234 11.69 1.04297 12.1587C1.58183 12.561 1.72577 12.7086 1.8734 13.0076C1.98412 13.229 1.98781 13.2585 1.96936 13.5427C1.914 14.3326 1.90292 15.0707 1.94721 15.2663C2.02472 15.6096 2.19819 15.8162 2.52666 15.9528C2.67429 16.0155 3.19469 16.0857 3.98821 16.1484C4.62671 16.2001 4.7522 16.237 4.93305 16.4215C5.01793 16.5064 5.08437 16.5876 5.08437 16.6061C5.08437 16.6245 5.18402 16.8054 5.30581 17.0084C5.42761 17.2077 5.52726 17.3811 5.52726 17.3885C5.52726 17.4107 5.85574 17.8868 6.01444 18.0971C6.09564 18.2042 6.23958 18.3333 6.33185 18.3887C6.47948 18.4773 6.54222 18.4921 6.78212 18.4884C7.11429 18.4847 7.30621 18.4035 8.57215 17.7391C8.80835 17.6173 8.90801 17.5841 9.0704 17.5804C9.25863 17.5767 9.33613 17.6063 10.1481 18.0086C10.6537 18.2595 11.104 18.4551 11.211 18.4773C11.6133 18.5548 11.8643 18.4404 12.1965 18.0344C12.3035 17.9015 12.3921 17.7834 12.3921 17.7687C12.3921 17.7539 12.4548 17.6469 12.536 17.5288C12.6135 17.4107 12.7796 17.1302 12.9051 16.9087C13.289 16.2296 13.3037 16.2222 14.2707 16.1336C15.4407 16.0229 15.5662 16.0008 15.8282 15.8347C15.9906 15.7314 16.0976 15.5911 16.1714 15.3733C16.2379 15.1851 16.2489 14.303 16.1936 13.5944C16.1419 12.9227 16.1161 12.9633 16.9871 12.2731C17.7253 11.6826 17.9873 11.4168 18.0796 11.1548C18.1423 10.9703 18.1497 10.9112 18.1128 10.7525C18.0648 10.52 17.9652 10.2948 17.8212 10.0845C17.7585 9.99221 17.7068 9.90732 17.7068 9.89625C17.7068 9.88148 17.5666 9.68587 17.3968 9.46074C17.227 9.23191 17.0535 8.96617 17.0092 8.86652C16.8727 8.5528 16.917 7.99919 17.1052 7.64488C17.2824 7.31271 17.4817 6.57824 17.4854 6.26822C17.4854 5.7146 17.275 5.52268 16.1198 5.04288C15.8651 4.93585 15.5403 4.80298 15.3927 4.74024C14.9793 4.56677 14.9646 4.54463 14.732 3.60348C14.6804 3.38942 14.625 3.14952 14.6066 3.06832C14.5881 2.98712 14.5217 2.78044 14.4626 2.61066C14.2892 2.12717 14.0677 1.89835 13.7282 1.85406C13.5436 1.83191 12.9199 1.87989 12.691 1.93894C12.3072 2.03859 11.8569 2.10503 11.5395 2.10503L11.1852 2.10872L10.9121 1.85775C10.7608 1.72119 10.4175 1.40378 10.1444 1.15281C9.8713 0.898147 9.56866 0.654556 9.46162 0.599194C9.19958 0.466326 8.92646 0.466326 8.6718 0.602885ZM12.7538 6.81445C12.9199 6.90303 13.1302 7.1171 13.2225 7.29056C13.3 7.44188 13.3332 7.7962 13.2816 7.97705C13.2594 8.05824 13.1708 8.22433 13.0823 8.34612C12.9937 8.46792 11.9344 9.5567 10.7276 10.771C8.22152 13.2844 8.34701 13.1847 7.80447 13.1552C7.5498 13.1404 7.47599 13.122 7.32836 13.0297C7.14013 12.9116 6.59758 12.4097 5.68965 11.5165C4.9921 10.8263 4.88138 10.6529 4.90721 10.269C4.94781 9.5936 5.62322 9.11749 6.21743 9.34263C6.45733 9.43121 6.92237 9.80029 7.40955 10.2838C7.64576 10.52 7.78232 10.6159 7.87459 10.6159C7.92995 10.6159 8.09604 10.472 8.3913 10.1657C9.10362 9.4349 10.3696 8.16527 11.0487 7.50832C11.8237 6.7554 11.9271 6.69266 12.3589 6.71849C12.5102 6.72956 12.6578 6.76647 12.7538 6.81445Z"
                fill="url(#paint0_linear_4978_17135)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_4978_17135"
                  x1="7.3199"
                  y1="11.577"
                  x2="1.37157"
                  y2="11.6618"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#E2B156" />
                  <stop offset="1" stop-color="#FFAB0D" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="relative flex items-end overflow-hidden mb-3">
          {/* Combined Title and Tags Section */}
          {ads?.description.length > 30 ? (
            <div
              onClick={toggleExpand}
              className={`footer_title font-cnFont  transition-all ${
                isExpanded ? "max-h-full" : "line-clamp-2"
              } w-[80%] flex flex-wrap`}
            >
              <span className="mr-2">{ads?.description}</span>
            </div>
          ) : (
            <div
              className={`footer_title  font-cnFont  transition-all max-h-full w-[80%] flex flex-wrap`}
            >
              <span className="mr-2">{ads?.description}</span>
            </div>
          )}

          {/* More/Less Button Inline */}
          {ads?.description.length > 30 && (
            <button
              className="more_text font-cnFont inline ml-[-3px]"
              onClick={toggleExpand}
            >
              {isExpanded ? "收起" : "更多"}
            </button>
          )}
        </div>

        <>
          {ads?.profile_text && (
            <div className="spon px-3 py-2 mb-3 inline-block">
              {ads?.profile_text}
            </div>
          )}

          <a
            className={`ads-btn w-full flex items-center justify-center py-2`}
            target="_blank"
            href={ads?.jump_url}
          >
            <span>{ads?.btn_text}</span>
            <svg
              className="mt-3"
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 14 19"
              fill="none"
            >
              <g filter="url(#filter0_d_4978_17314)">
                <path
                  d="M5.18164 1.5L8.818 5.5L5.18164 9.5"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  shapeRendering="crispEdges"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_4978_17314"
                  x="0.431641"
                  y="0.75"
                  width="13.1367"
                  height="17.5"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity="0" result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset dy="4" />
                  <feGaussianBlur stdDeviation="2" />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                  />
                  <feBlend
                    mode="normal"
                    in2="BackgroundImageFix"
                    result="effect1_dropShadow_4978_17314"
                  />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_4978_17314"
                    result="shape"
                  />
                </filter>
              </defs>
            </svg>
          </a>
        </>
      </div>
    </div>
    // <div className="absolute bottom-[10px] z-[999999] p-3 w-full">
    //   <a
    // target="_blank"
    // href={ads?.jump_url}
    //     className="flex items-center p-4 gap-4  w-full ads-bg"
    //   >
    //     <img src={ads?.icon} alt="" width={60} height={60} />
    //     <div>
    //       <div className="flex items-center gap-2 mb-1">
    //         <h1 className="ads-title">{ads?.title}</h1>
    //         <div className="spon px-2 py-1">{ads?.profile_text}</div>
    //       </div>
    //       <p className="ads-p">{ads?.description}</p>
    //     </div>
    //   </a>
    // </div>
  );
};

export default Ads;
