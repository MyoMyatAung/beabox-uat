import React, { useEffect, useState } from "react";
import sc from "../../assets/explore/sc.svg";
import back from "../../assets/explore/back.svg";
import "./search.css";
import History from "./comp/History";
import Hot from "./comp/Hot";
import May from "./comp/May";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setHistoryData } from "./slice/HistorySlice";
import { useLazyGetSuggestionsQuery } from "@/store/api/search/searchApi";
import he from "he";
// import { FaAngleLeft } from "react-icons/fa";
import backButton from "../../assets/backButton.svg";

interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions
  const [isFocused, setIsFocused] = useState(false); // Manage input focus
  const [triggerAutocomplete, { data: autocompleteData }] =
    useLazyGetSuggestionsQuery(); // Lazy query for autocomplete
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (query.trim()) {
      setSuggestions([]); // Clear suggestions after search
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch autocomplete suggestions when the query changes
  useEffect(() => {
    if (query.trim()) {
      const timer = setTimeout(() => {
        triggerAutocomplete(query);
      }, 300); // Debounce to avoid too many API calls
      return () => clearTimeout(timer);
    } else {
      setSuggestions([]); // Clear suggestions if query is empty
    }
  }, [query, triggerAutocomplete]);

  // Update suggestions when autocomplete data arrives
  useEffect(() => {
    if (autocompleteData) {
      setSuggestions(autocompleteData.data);
    }
  }, [autocompleteData]);

  // Handle form submit (trigger search)
  const onSearch = (suggestion: any) => {
    if (suggestion.trim()) {
      dispatch(setHistoryData({ data: suggestion.trim() }));
      navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
    }
  };

  // Handle suggestion click (trigger search with selected suggestion)
  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion); // Set the clicked suggestion as the query
    setSuggestions([]); // Clear suggestions after click
    onSearch(suggestion);
  };

  const highlightKeywords = (text: string, keyword: string) => {
    if (!keyword.trim()) return he.decode(text);
    const parts = he.decode(text).split(new RegExp(`(${keyword})`, "gi"));
    return parts.map((part: any, index: any) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={index} className="search_btn">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className=" px-[16px] bg-[#16131C] h-full min-h-screen">
      {/* header */}
      <form
        onSubmit={handleSubmit}
        className=" pb-[20px] pt-[20px] flex justify-between items-center gap-[10px]"
      >
        {/* <img
          onClick={() => navigate("/")}
          className=" pt-[6px]"
          src={back}
          alt=""
        /> */}
        {/* <FaAngleLeft size={22} onClick={() => navigate("/")}/> */}
        <img src={backButton} alt="" onClick={() => navigate("/")} />
        <div
          //   onSubmit={handleSubmit}
          className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]"
        >
          <img src={sc} alt="" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
            placeholder="搜索影片"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)} // Delay to allow clicks on suggestions
            className=" bg-transparent focus:outline-none text-[16px] font-[400] text-white w-full"
            type="text"
          />
        </div>
        <button type="submit" className="search_btn  w-[45px]">
          搜索
        </button>
      </form>
      {isFocused && suggestions.length > 0 && (
        <ul className="fixed top-[60px] px-[16px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-[#16131C] text-white z-[99999] overflow-y-auto">
          {suggestions.map((suggestion: any, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.title)}
              className="cursor-pointer gap-5 mb-4 flex items-center justify-between"
            >
              <div className="flex truncate gap-5 items-center">
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.9521 9.53764C14.1523 8.90982 14.2603 8.24084 14.2603 7.54667C14.2603 3.93104 11.3293 1 7.71367 1C4.09804 1 1.16699 3.93104 1.16699 7.54667C1.16699 11.1623 4.09804 14.0934 7.71367 14.0934C9.43465 14.0934 11.0006 13.4293 12.1691 12.3433M12.267 12.44L14.8336 15"
                      stroke="#AAAAAA"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
                <span className="truncate">
                  {highlightKeywords(suggestion?.title, query)}
                </span>
              </div>

              <span className="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                >
                  <path
                    d="M11 17V11M11 11H17M11 11L20.5 21"
                    stroke="white"
                    stroke-opacity="0.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </span>
            </li>
          ))}
        </ul>
      )}
      {/* initial */}
      <History />
      <Hot />
      <May />
    </div>
  );
};

export default Search;
