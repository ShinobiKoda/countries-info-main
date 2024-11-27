import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon as regularMoon } from "@fortawesome/free-regular-svg-icons";
import { faMoon as solidMoon } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft as leftArrow } from "@fortawesome/free-solid-svg-icons";
import { Atom } from "react-loading-indicators";

const CountryDetail = () => {
  const { name } = useParams(); // Get the country name from the URL
  const [countryData, setCountryData] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]); // State for border country names
  const [darkMode, setDarkMode] = useState(() => {
    // Check the saved dark mode preference from localStorage
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const fetchCountryData = async () => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch data for ${name}`);
        }
        const data = await response.json();
        setCountryData(data[0]);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCountryData();
  }, [name]);

  useEffect(() => {
    const fetchBorderCountryNames = async (borderCodes) => {
      try {
        const response = await fetch(
          `https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(",")}`
        );
        const borderCountries = await response.json();

        // Map the border countries to their common names
        const borderCountryNames = borderCountries.map(
          (country) => country.name.common
        );

        setBorderCountries(borderCountryNames); // Store the names in state
      } catch (error) {
        console.error("Error fetching border country data:", error);
      }
    };

    if (countryData?.borders) {
      fetchBorderCountryNames(countryData.borders);
    }
  }, [countryData]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  if (!countryData) {
    return <div>Loading...</div>;
  }

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  return (
    <div className="w-full h-full min-h-screen dark:bg-[#202d36] bg-[#f5f5f5] flex flex-col gap-12">
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

      <div className="w-full px-4 cursor-pointer hover:opacity-90">
        <Link
          to={"/"}
          className="shadow-md rounded-sm bg-white dark:bg-[#2b3743] py-2 px-6 flex gap-4 w-[7rem] items-center"
        >
          <FontAwesomeIcon
            icon={leftArrow}
            size="lg"
            style={{ color: darkMode ? "white" : "black" }}
            className="cursor-pointer hover:opacity-90"
          />
          <span className="text-black dark:text-white">Back</span>
        </Link>
      </div>

      <div className="flex flex-col px-4 gap-4">
        <div className="h-[13rem] overflow-hidden mx-auto">
          <img
            src={countryData.flags.svg}
            alt="Flag"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="dark:text-white text-2xl font-bold">
            {countryData.name.common}
          </h3>

          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Native Name: </span>
                <span>
                  {countryData.name.nativeName
                    ? Object.values(countryData.name.nativeName)[0].common
                    : "N/A"}
                </span>
              </p>

              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Population: </span>{" "}
                <span>{countryData.population.toLocaleString()}</span>
              </p>

              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Region: </span>
                <span>{countryData.region}</span>
              </p>

              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Subregion: </span>
                <span>{countryData.subregion}</span>
              </p>

              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Capital: </span>
                <span>{countryData.capital}</span>
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="text-black dark:text-white text-[1.2rem]">
                <span>Currencies: </span>
                {Object.values(countryData.currencies)[0].name} (
                {Object.values(countryData.currencies)[0].symbol})
              </p>
              <p className="dark:text-white text-[1.2rem]">
                <span className="font-medium">Languages: </span>
                <span>{Object.values(countryData.languages).join(", ")}</span>
              </p>
            </div>
          </div>

          <div className="dark:text-white text-[1.2rem] flex flex-col gap-3">
            <p className="font-medium">Border Countries: </p>
            {borderCountries.length > 0 ? (
              <div className="flex gap-3">
                {borderCountries.map((name, index) => (
                  <p key={index} className="inline-block">
                    <span className="dark:text-white">{name}</span>
                  </p>
                ))}
              </div>
            ) : (
              <span>None</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
