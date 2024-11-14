import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as regularMoon } from "@fortawesome/free-regular-svg-icons";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faSearch as searchIcon } from "@fortawesome/free-solid-svg-icons";
import { faArrowDown as arrowIcon } from "@fortawesome/free-solid-svg-icons";
import { Atom } from "react-loading-indicators";

const CountryApp = () => {
  const countries = [
    "Nigeria",
    "Canada",
    "Poland",
    "United States of America",
    "United Kingdom",
    "Germany",
    "Iceland",
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("Filter by Region");
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const regions = ["Africa", "America", "Asia", "Europe", "Oceania"];

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff] dark:bg-[#2b3743]">
        <Atom color="#3178cc" size="medium" text="" textColor="" />
      </div>
    );
  }

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectRegion = (region, index) => {
    setSelectedRegion(region);
    setIsOpen(false);
    setHighlightedIndex(index); // Reset highlight to the selected item
  };

  const handleKeyDown = (e) => {
    if (isOpen) {
      if (e.key === "ArrowDown") {
        setHighlightedIndex((prevIndex) => (prevIndex + 1) % regions.length);
      } else if (e.key === "ArrowUp") {
        setHighlightedIndex(
          (prevIndex) => (prevIndex - 1 + regions.length) % regions.length
        );
      } else if (e.key === "Enter") {
        selectRegion(regions[highlightedIndex], highlightedIndex);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    } else if (e.key === "Enter") {
      setIsOpen(true);
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between px-4 py-6 shadow-md w-full dark:bg-[#2b3743] items-center">
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

      <div className="bg-[#f5f5f5] w-full h-full dark:bg-[#202d36] py-8 flex flex-col gap-12 px-8">
        <div className="w-full">
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
            />
          </div>
        </div>

        <div className="w-full">
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
                onClick={toggleDropdown}
              />
            </button>
            {isOpen && (
              <ul
                className="dark:bg-[#2b3743] p-3 rounded-md shadow-md absolute top-full w-full mt-1 flex flex-col gap-3 bg-white"
                tabIndex="0"
              >
                {regions.map((region, index) => (
                  <li
                    key={region}
                    className="hover:opacity-90 cursor-pointer"
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

        <div className="flex flex-col gap-8 mx-auto max-w-[600px]">
          {data.map((country, index) => (
            <div key={index} className="shadow-md rounded-md mx-auto">
              <div>
                <img
                  src={country.flags.svg}
                  alt="Flag"
                  className="w-full rounded-t-md"
                />
              </div>
              <div className="px-6 py-10 dark:bg-[#2b3743] flex flex-col gap-3">
                <h3 className="dark:text-white text-2xl font-bold">
                  {country.name.common}
                </h3>
                <p className="dark:text-white text-[1.2rem]">
                  <span className="font-medium">Population: </span>{" "}
                  <span>{country.population}</span>
                </p>
                <p className="dark:text-white text-[1.2rem]">
                  <span className="font-medium">Region: </span>
                  <span>{country.region}</span>
                </p>
                <p className="dark:text-white text-[1.2rem]">
                  <span className="font-medium">Capital: </span>{" "}
                  <span>{country.capital}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryApp;
