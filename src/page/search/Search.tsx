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

interface SearchProps {}

const Search: React.FC<SearchProps> = ({}) => {
  const [query, setQuery] = useState("");
  // const [suggestions, setSuggestions] = useState<any[]>([]); // Store autocomplete suggestions
  // const [isFocused, setIsFocused] = useState(false); // Manage input focus
  // const [triggerAutocomplete, { data: autocompleteData }] =
  //   useLazyGetAutocompleteQuery(); // Lazy query for autocomplete
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (query.trim()) {
      // setSuggestions([]); // Clear suggestions after search
      dispatch(setHistoryData({ data: query.trim() }));
      navigate(`/search?query=${encodeURIComponent(query.trim())}`);
    }
  };

  // // Fetch autocomplete suggestions when the query changes
  // useEffect(() => {
  //   if (query.trim()) {
  //     const timer = setTimeout(() => {
  //       triggerAutocomplete({ keyword: query });
  //     }, 300); // Debounce to avoid too many API calls
  //     return () => clearTimeout(timer);
  //   } else {
  //     setSuggestions([]); // Clear suggestions if query is empty
  //   }
  // }, [query, triggerAutocomplete]);

  // // Update suggestions when autocomplete data arrives
  // useEffect(() => {
  //   if (autocompleteData) {
  //     setSuggestions(autocompleteData.data);
  //   }
  // }, [autocompleteData]);

  // // Handle form submit (trigger search)
  // const onSearch = (suggestion: any) => {
  //   if (suggestion.trim()) {
  //     dispatch(setHistoryData({ data: suggestion.trim() }));
  //     navigate(`/search?query=${encodeURIComponent(suggestion.trim())}`);
  //   }
  // };

  // // Handle suggestion click (trigger search with selected suggestion)
  // const handleSuggestionClick = (suggestion: string) => {
  //   setQuery(suggestion); // Set the clicked suggestion as the query
  //   setSuggestions([]); // Clear suggestions after click
  //   onSearch(suggestion);
  // };

  return (
    <div className=" px-[16px] bg-[#16131C] h-full min-h-screen">
      {/* header */}
      <form
        onSubmit={handleSubmit}
        className=" pb-[32px] pt-[20px] flex justify-between items-center gap-[10px]"
      >
        <img
          onClick={() => navigate("/")}
          className=" pt-[6px]"
          src={back}
          alt=""
        />
        <div
          //   onSubmit={handleSubmit}
          className=" w-full px-[10px] py-[8px] search_input flex gap-[12px]"
        >
          <img src={sc} alt="" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)} // Update the query state on input change
            placeholder="Search Videos"
            className=" bg-transparent focus:outline-none text-[16px] font-[400] text-white w-full"
            type="text"
          />
        </div>
        <button type="submit" className="search_btn">
          Search
        </button>
      </form>
      {/* {isFocused && suggestions.length > 0 && (
        <ul className="fixed top-[60px] left-0 pt-[20px] pb-[80px] h-screen w-full bg-[#161616] text-white z-50 overflow-y-auto">
          {suggestions.map((suggestion: any, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.name)}
              className="cursor-pointer ml-[20px] p-2 active:text-[#f54100]"
              dangerouslySetInnerHTML={{
                __html: suggestion?.highlight.replace(
                  /<em>(.*?)<\/em>/g,
                  '<span style="color: #F54100;">$1</span>'
                ),
              }} // Render highlighted text
            />
          ))}
        </ul>
      )} */}
      {/* initial */}
      <History />
      <Hot />
      <May />
    </div>
  );
};

export default Search;
