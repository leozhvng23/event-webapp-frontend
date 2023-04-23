import React, { useState, useEffect } from "react";
import { Geo } from "aws-amplify";

export default function LocationSearchBar({
  location,
  setLocation,
  searchText,
  setSearchText,
  handleInputChange,
  editMode = false,
}) {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState(!editMode);

  useEffect(() => {
    if (searchText === "" || !search) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await Geo.searchByText(searchText);
        setResults(res);
      } catch (error) {
        console.error(error);
      }
    };

    fetchResults();
  }, [searchText, search]);

  const handleSelectResult = (result) => {
    setSearchText(result.label);
    setLocation(result);
    setSearch(false);
    if (handleInputChange) {
      handleInputChange();
    }
    console.log("selected location:", result);
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
        Location
      </label>
      <input
        type="text"
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          setSearch(true);
        }}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Search location"
      />
      {results.length > 0 && (
        <div className="max-w-[355px] max-h-32 mt-2 overflow-y-auto bg-white border border-gray-300 rounded shadow result-dropdown">
          {results.map((result, index) => (
            <div
              key={index}
              className="p-2 hover:bg-gray-200 cursor-pointer w-full"
              onClick={() => handleSelectResult(result)}
            >
              {result.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
