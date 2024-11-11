import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as regularMoon } from "@fortawesome/free-regular-svg-icons";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faSearch as searchIcon } from "@fortawesome/free-solid-svg-icons";
import { Atom } from "react-loading-indicators";

const CountryApp = () => {
  const countries = [
    "Nigeria",
    "Canada",
    "Poland",
    "United States of America",
    "United Kingdom",
  ];
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState("");
  // const [isDropdownVisible, setDropdownVisible] = useState(false);

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
            return countryData[0]; // Assuming the first result is the relevant one
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
        // console.log(data);
      }
    };

    fetchCountryData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#fff] dark:bg-[#2b3743]">
        <Atom color="#3178cc" size="medium" text="" textColor="" />
      </div>
    );
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode); // Save the new preference in localStorage
  };

  return (
    <div className="w-full h-screen">
      <div className="flex justify-between px-4 py-6 shadow-md w-full dark:bg-[#2b3743]">
        <h3 className="dark:text-white">Where in the world?</h3>
        <div className="flex gap-3" onClick={toggleDarkMode}>
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

      <div className="bg-[#f5f5f5] w-full h-screen dark:bg-[#202d36] py-8 flex flex-col gap-12 px-8">
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
              className="bg-transparent border-none outline-none dark:text-white placeholder-[#dadada] dark:placeholder-[#e9f2fb]"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="bg-white dark:bg-[#2b3743] rounded-md w-[12rem] p-4 shadow-md">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-transparent border-none outline-none dark:text-white dark:bg-[#2b3743]"
            >
              <option value="">Filter by Region</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>
        </div>

        <div>
          {data.map((country, index) => (
            <div key={index}>
              <h3 className="dark:text-white">{country.name.common}</h3>
              <p className="dark:text-white">
                Population: {country.population}
              </p>
              <p className="dark:text-white">Region: {country.region}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CountryApp;
