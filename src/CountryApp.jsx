import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as regularMoon } from "@fortawesome/free-regular-svg-icons";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faSearch as searchIcon } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown as arrowIcon } from "@fortawesome/free-solid-svg-icons";
import "./index.css";
import { Link } from "react-router-dom";
import SkeletonLoader from "./SkeletonLoader";
import _ from "lodash";

const CountryApp = () => {
  const countries = [
    "Nigeria",
    "Canada",
    "Poland",
    "United States of America",
    "United Kingdom",
    "Germany",
    "Iceland",
    "Belgium",
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Filter by Region");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const searchInputRef = useRef(null);

  const getUniqueRegions = () => {
    const allRegions = data.map((country) => country.region);
    return ["All", ...new Set(allRegions)];
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const allCountriesData = await Promise.all(
          countries.map(async (country) => {
            const response = await fetch(
              `https://restcountries.com/v3.1/name/${country}`
            );
            if (!response.ok) {
              throw new Error(`Failed to fetch data for ${country}`);
            }
            const countryData = await response.json();
            return countryData[0];
          })
        );
        setData(allCountriesData);

        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const toggleDropdown = (e) => {
    e.preventDefault(); // Prevent scrolling behavior
    setIsOpen(!isOpen);
  };

  const selectRegion = (region, index) => {
    setSelectedRegion(region);
    setIsOpen(false);
    setHighlightedIndex(index);
  };

  const handleKeyDown = (e) => {
    if (isOpen) {
      if (e.key === "ArrowDown") {
        e.preventDefault(); // Prevent default scrolling behavior
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % regions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault(); // Prevent default scrolling behavior
        setHighlightedIndex(
          (prevIndex) => (prevIndex - 1 + regions.length) % regions.length
        );
      } else if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior (e.g., form submission)
        selectRegion(regions[highlightedIndex], highlightedIndex);
      } else if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleSearch = async (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term === "") {
      setLoading(false); // Reset to show the original data
      return;
    }

    // Trigger search only if the search term is sufficiently long (e.g., 3 characters or more)
    if (term.length < 3) {
      return; // You can adjust the length as per your requirement
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${term}`
      );
      if (!response.ok) {
        throw new Error("Country not found");
      }
      const countryData = await response.json();
      setData(countryData);
    } catch (error) {
      console.error("Error fetching data for searched country:", error);
      setData([]); // Clear data to show no results
    } finally {
      setLoading(false);
    }
  };

  // Using lodash debounce
  const debouncedSearch = useRef(_.debounce(handleSearch, 500)).current;

  // Attach debouncedSearch to the input onChange event
  const handleSearchDebounced = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(e);
  };

  const filteredData = data.filter((country) => {
    const matchesSearchTerm = country.name.common
      .toLowerCase()
      .includes(searchTerm);
    const matchesRegion =
      selectedRegion === "All" ||
      selectedRegion === "Filter by Region" ||
      country.region === selectedRegion;
    return matchesSearchTerm && matchesRegion;
  });

  if (loading) {
    return (
      <div className="w-full h-full min-h-screen dark:bg-[#202d36] bg-[#f5f5f5]">
        {/* Navigation Bar */}
        <div className="shadow-md w-full dark:bg-[#2b3743] bg-white">
          <div className="w-full max-w-[1440px] mx-auto flex justify-between px-4 py-6 items-center sm:px-4">
            <h3 className="dark:text-white font-bold">Where in the world?</h3>
            <div className="flex gap-3 items-center" onClick={toggleDarkMode}>
              <FontAwesomeIcon
                icon={darkMode ? solidMoon : regularMoon}
                size="lg"
                style={{ color: darkMode ? "white" : "black" }}
                className="cursor-pointer hover:opacity-90"
              />
              <span className="hover:opacity-90 cursor-pointer dark:text-white">
                Dark Mode
              </span>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-[#f5f5f5] w-full h-full dark:bg-[#202d36]">
          <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 p-8 sm:px-4">
            <div className="flex flex-col gap-10 sm:flex-row sm:justify-between w-full">
              <div>
                <div className="bg-white dark:bg-[#2b3743] px-6 py-4 rounded-sm flex gap-4 items-center shadow-md">
                  <FontAwesomeIcon
                    icon={searchIcon}
                    size="lg"
                    style={{ color: darkMode ? "white" : "#f0f0f0" }}
                  />
                  <input
                    type="text"
                    placeholder="Search for a country..."
                    className="bg-transparent border-none outline-none dark:text-white placeholder-[#dadada] dark:placeholder-[#e9f2fb] w-full"
                    value={searchTerm}
                    onChange={handleSearchDebounced}
                    disabled
                  />
                </div>
              </div>

              <div>
                <div className="w-[12rem] dark:text-white flex flex-col gap-2 relative">
                  <button
                    className="w-full dark:bg-[#2b3743] p-4 rounded-md shadow-md flex justify-between items-center cursor-not-allowed bg-white"
                    disabled
                  >
                    {selectedRegion}
                    <FontAwesomeIcon
                      icon={arrowIcon}
                      size="lg"
                      style={{ color: darkMode ? "white" : "black" }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Content */}
            <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:items-center sm:auto-cols-fr w-full h-full">
              {[...Array(8)].map((_, index) => (
                <SkeletonLoader key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen dark:bg-[#202d36] bg-[#f5f5f5]">
      {/* Navigation Bar */}
      <div className="shadow-md w-full dark:bg-[#2b3743] bg-white">
        <div className="w-full max-w-[1440px] mx-auto flex justify-between px-4 py-6 items-center sm:px-4">
          <h3 className="dark:text-white font-bold">Where in the world?</h3>
          <div className="flex gap-3 items-center" onClick={toggleDarkMode}>
            <FontAwesomeIcon
              icon={darkMode ? solidMoon : regularMoon}
              size="lg"
              style={{ color: darkMode ? "white" : "black" }}
              className="cursor-pointer hover:opacity-90"
            />
            <span className="hover:opacity-90 cursor-pointer dark:text-white">
              Dark Mode
            </span>
          </div>
        </div>
      </div>

      {/* Search Bar and Dropdown */}
      <div className="bg-[#f5f5f5] w-full h-full dark:bg-[#202d36] ">
        <div className="w-full max-w-[1440px] mx-auto flex flex-col gap-12 p-8 sm:px-4">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between w-full">
            <div>
              <div className="bg-white dark:bg-[#2b3743] px-6 py-4 rounded-sm flex gap-4 items-center shadow-md">
                <FontAwesomeIcon
                  icon={searchIcon}
                  size="lg"
                  style={{ color: darkMode ? "white" : "#f0f0f0" }}
                />
                <input
                  type="text"
                  placeholder="Search for a country..."
                  className="bg-transparent border-none outline-none dark:text-white placeholder-[#dadada] dark:placeholder-[#e9f2fb] w-full"
                  value={searchTerm}
                  onChange={handleSearchDebounced}
                />
              </div>
            </div>

            <div>
              <div className="w-[12rem] dark:text-white flex flex-col gap-2 relative">
                <button
                  onClick={toggleDropdown}
                  onKeyDown={handleKeyDown}
                  className="w-full dark:bg-[#2b3743] p-4 rounded-md shadow-md flex justify-between items-center cursor-pointer hover:opacity-90 bg-white"
                >
                  {selectedRegion}
                  <FontAwesomeIcon
                    icon={arrowIcon}
                    size="lg"
                    style={{ color: darkMode ? "white" : "black" }}
                  />
                </button>
                {isOpen && (
                  <ul
                    className="dark:bg-[#2b3743] p-3 rounded-md shadow-md absolute top-full w-full mt-1 flex flex-col gap-3 bg-white max-h-60 overflow-y-auto"
                    tabIndex="0"
                  >
                    {getUniqueRegions().map((region, index) => (
                      <li
                        key={region}
                        className={`hover:opacity-90 cursor-pointer ${
                          index === highlightedIndex
                            ? "bg-gray-200 dark:bg-gray-700"
                            : ""
                        }`}
                        onClick={() => selectRegion(region, index)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                      >
                        {region}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:items-center sm:auto-cols-fr w-full h-full">
            {/* Show skeleton loader if loading, else show the country data */}
            {loading
              ? [...Array(8)].map((_, index) => <SkeletonLoader key={index} />)
              : filteredData.map((country, index) => (
                  <Link
                    key={index}
                    to={`/country/${country.name.common}`}
                    className="shadow-md rounded-md h-full dark:bg-[#2b3743]
                  cursor-pointer hover:opacity-85"
                  >
                    <div className="h-40 w-full overflow-hidden">
                      <img
                        src={country.flags.svg}
                        alt="Flag"
                        className="w-full h-full object-cover rounded-t-md"
                      />
                    </div>
                    <div className="px-6 py-8 flex flex-col gap-3">
                      <h3 className="dark:text-white text-2xl font-bold">
                        {country.name.common}
                      </h3>
                      <p className="dark:text-white text-[1.2rem]">
                        <span className="font-medium">Population: </span>{" "}
                        <span>{country.population.toLocaleString()}</span>
                      </p>
                      <p className="dark:text-white text-[1.2rem]">
                        <span className="font-medium">Region: </span>
                        <span>{country.region}</span>
                      </p>
                      <p className="dark:text-white text-[1.2rem]">
                        <span className="font-medium">Capital: </span>
                        <span>{country.capital}</span>
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryApp;
