const FilterType = ({
  selectedType,
  setSelectedType,
  selectedRange,
  setSelectedRange,
  configData,
}: any) => {
  const tags = configData?.data?.creator_center_ranking_filter;
  return (
    <div>
      <div className="flex items-center gap-4 px-2">
        {tags?.map((tag: any) => (
          <div
            className="flex flex-col justify-center items-center gap-3"
            key={tag?.title}
          >
            <div className="w-[58px] h-[3px] rounded-[1px] bg-transparent"></div>
            <button
              onClick={() => setSelectedType(tag)}
              className={`text-[14px] ${
                selectedType?.keyword == tag?.keyword
                  ? "text-white"
                  : "text-[#999]"
              }`}
            >
              {tag?.title}
            </button>
            <div
              className={`w-[58px] h-[3px] rounded-[1px] ${
                selectedType?.keyword == tag?.keyword
                  ? "bg-[#CD3EFF]"
                  : "bg-transparent"
              } `}
            ></div>
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-[#FFFFFF05]"></div>
      <div className="flex my-3 px-2 items-center gap-2">
        {selectedType?.range?.map((range: any) => (
          <button
            onClick={() => setSelectedRange(range)}
            className={`text-[12px] ${
              selectedRange == range
                ? "text-white bg-[#FFFFFF1F]"
                : "text-[#999] bg-[#FFFFFF05]"
            } px-5 py-1 text-center rounded-full`}
          >
            {range?.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterType;
