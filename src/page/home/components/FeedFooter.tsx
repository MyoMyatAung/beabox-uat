import { useState } from "react";

function FeedFooter({
  title,
  tags,
  city,
  username,
}: {
  title: any;
  tags: any;
  city: any;
  username: any;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="videoFooter1">
      <div className="">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span className="footer_head_text font-cnFont">{username}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <circle
                cx="9"
                cy="9.5"
                r="9"
                fill="url(#paint0_linear_3792_3390)"
              />
              <path
                d="M13.2002 6.3999L7.7002 11.8999L5.2002 9.3999"
                stroke="white"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_3792_3390"
                  x1="8.59091"
                  y1="11.75"
                  x2="0.390618"
                  y2="0.222136"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#CD3EFF" />
                  <stop offset="1" stop-color="#FFB2E0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        <div className="relative flex items-end overflow-hidden">
          {/* Combined Title and Tags Section */}
          {title.length > 30 || tags.length > 3 ? (
            <div
              onClick={toggleExpand}
              className={`footer_title  transition-all ${
                isExpanded ? "max-h-full" : "line-clamp-2"
              } w-[80%] flex flex-wrap`}
            >
              <span className="mr-2">{title}</span>
              {tags?.map((tag: any, index: number) => (
                <span key={index} className="footer_tag mr-2">
                  #{tag}
                </span>
              ))}
            </div>
          ) : (
            <div
              className={`footer_title  transition-all max-h-full w-[80%] flex flex-wrap`}
            >
              <span className="mr-2">{title}</span>
              {tags?.map((tag: any, index: number) => (
                <span key={index} className="footer_tag mr-2">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* More/Less Button Inline */}
          {(title.length > 30 || tags.length > 3) && (
            <button className="more_text inline ml-2" onClick={toggleExpand}>
              {isExpanded ? "less" : "more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedFooter;
