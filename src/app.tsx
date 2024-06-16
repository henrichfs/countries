import { useEffect, useState, ChangeEvent } from "react";
import {
  ChevronFirst,
  ChevronLeft,
  ChevronRight,
  ChevronLast,
  Search,
  Moon,
  Sun,
} from "lucide-react";
import { api } from "./data/api";

interface CountriesProps {
  name: {
    common: string;
    official: string;
  };
  flags: {
    png: string;
  };
  continents: string;
  capital: string;
  population: number;
}

export function App() {
  const [search, setsearch] = useState("");
  const [countries, setCountries] = useState<CountriesProps[]>([]);
  const [page, setPage] = useState(1);
  const [continent, setContinent] = useState("All");
  const [darkMode, setDarkMode] = useState(false);

  function toggleTheme() {
    document.body.classList.toggle("dark");
    setDarkMode(!darkMode);
  }

  async function loadCountries() {
    const response = await api.get("/all");
    setCountries(response.data);
  }

  useEffect(() => {
    loadCountries();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setsearch(event.target.value);
  };

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setContinent(event.target.value);
  };

  const filteredCountries = countries.filter(
    (country) =>
      (continent === "All" || country.continents[0] === continent) &&
      country.name.common.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCountries.length / 15);

  function goToFirstPage() {
    setPage(1);
  }

  function goToLastPage() {
    setPage(totalPages);
  }

  function goToPreviousPage() {
    setPage(page - 1);
  }

  function goToNextPage() {
    setPage(page + 1);
  }

  return (
    <div className="bg-black">
      <button
        onClick={toggleTheme}
        className="bg-slate-50 size-14 fixed bottom-5 right-5 flex justify-center items-center rounded-full border border-black dark:text-black"
      >
        {darkMode ? <Moon className="size-10" /> : <Sun className="size-10" />}
      </button>

      <div className="h-20 bg-slate-50 dark:bg-slate-600 flex justify-between items-center px-5 text-2xl border border-black">
        <div>Countries</div>
        <select
          className="outline-none bg-slate-50 border-2 border-black rounded dark:text-black"
          value={continent}
          onChange={handleSelectChange}
        >
          <option value="All">All</option>
          <option value="Africa">Africa</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="North America">North America</option>
          <option value="Oceania">Oceania</option>
          <option value="South America">South America</option>
        </select>
      </div>

      <div className="h-16 w-full bg-slate-50 dark:bg-slate-600 flex border border-black">
        <div className="flex justify-center w-full items-center dark:text-black">
          <div className="rounded-s bg-slate-50 h-10 flex items-center justify-center w-10 border-2 border-black">
            <Search className="size-8" />
          </div>
          <input
            className="outline-none px-5 h-10 bg-slate-50 border-y-2 border-r-2 border-black rounded-r"
            type="text"
            placeholder="Search Country"
            value={search}
            onChange={handleInputChange}
          />
        </div>
      </div>

      <div className="flex flex-wrap bg-black">
        {filteredCountries.slice((page - 1) * 15, page * 15).map((country) => (
          <div
            key={country.name.common}
            className="2xl:w-1/5 xl:w-1/4 md:w-1/3 sm:w-1/2 w-screen bg-slate-50 dark:bg-slate-600 border border-black"
          >
            <div className="p-5">
              <img
                className="border-2 border-black h-60 w-full"
                src={country.flags.png}
                alt=""
              />
              <div>
                <h1 className="text-center mt-3 text-2xl">
                  {country.name.common}
                </h1>
                <h2 className="text-center text-xl">{country.name.official}</h2>
              </div>

              <div className="mt-5 text-lg flex flex-col gap-3">
                <p>
                  <span className="font-semibold">Continent:</span>{" "}
                  {country.continents}
                </p>
                <p>
                  <span className="font-semibold">Capital:</span>{" "}
                  {country.capital}
                </p>
                <p>
                  <span className="font-semibold">Population:</span>{" "}
                  {country.population}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-20 bg-slate-50 dark:bg-slate-600 border border-black text-xl">
        <div className="flex justify-center items-center h-full">
          <button onClick={goToFirstPage} disabled={page === 1}>
            <ChevronFirst className="size-8" />
          </button>
          <button onClick={goToPreviousPage} disabled={page === 1}>
            <ChevronLeft className="size-8" />
          </button>
          <button onClick={goToNextPage} disabled={page === totalPages}>
            <ChevronRight className="size-8" />
          </button>
          <button onClick={goToLastPage} disabled={page === totalPages}>
            <ChevronLast className="size-8" />
          </button>
        </div>
      </div>
    </div>
  );
}
