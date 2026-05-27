import React, { useState, useRef, useEffect, useMemo } from "react";
import { DayOptions } from "../../data/options";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsFilter } from "../../redux/slices/productSlice";

const selectTour = [
  { id: 1, text: "Tour Trong Nước" },
  { id: 2, text: "Tour Ngoài Nước" },
];

function LocationIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <path
        d="M12 22s7-7.2 7-12a7 7 0 1 0-14 0c0 4.8 7 12 7 12Z"
        stroke="#0A3F7E"
        strokeWidth="2"
      />
      <circle cx="12" cy="10" r="3" stroke="#0A3F7E" strokeWidth="2" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="2"
        stroke="#0A3F7E"
        strokeWidth="2"
      />
      <path d="M3 9h18" stroke="#0A3F7E" strokeWidth="2" />
      <path d="M8 3v4M16 3v4" stroke="#0A3F7E" strokeWidth="2" />
    </svg>
  );
}

function SwapIcon() {
  return (
    <svg width="26" height="26" fill="none" viewBox="0 0 24 24">
      <path
        d="M7 7h11l-3-3M17 17H6l3 3"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
      <path
        d="M20 20l-3.5-3.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FilterHome = ({ setHasFiltered }) => {
  const dispatch = useDispatch();
  const allTours = useSelector((s) => s.products.products);

  // filterHome.departure  → backend "departure" param  → WHERE location = ?    (nơi khởi hành)
  // filterHome.destination → backend "destination" param → WHERE destination LIKE ? (điểm đến)
  const [filterHome, setFilterHome] = useState({
    idTour: selectTour[0].id,
    departure: "",   // "Điểm đi" = nơi khởi hành (cột location)
    destination: "", // "Điểm đến" (cột destination)
    date: null,
    duration: "",
  });

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const [isOpenThird, setIsOpenThird] = useState(false);
  const [isOpenFourth, setIsOpenFourth] = useState(false);

  const departureRef = useRef(null);
  const destinationRef = useRef(null);
  const dateRef = useRef(null);
  const durationRef = useRef(null);

  // Điểm đi: từ cột location (nơi khởi hành), lọc theo category
  const departureOptions = useMemo(() => {
    const filtered = allTours.filter((t) => t.category_id === filterHome.idTour);
    return [...new Set(filtered.map((t) => t.location).filter(Boolean))].sort();
  }, [allTours, filterHome.idTour]);

  // Điểm đến: từ cột destination, lọc theo category
  const destinationOptions = useMemo(() => {
    const filtered = allTours.filter((t) => t.category_id === filterHome.idTour);
    return [...new Set(filtered.map((t) => t.destination).filter(Boolean))].sort();
  }, [allTours, filterHome.idTour]);

  // Ngày có tour: lấy tất cả start_date từ variants của tours đang lọc
  const availableDates = useMemo(() => {
    const filtered = allTours.filter((t) => t.category_id === filterHome.idTour);
    const dates = new Set();
    filtered.forEach((t) => {
      (t.variants || []).forEach((v) => {
        if (v.start_date) dates.add(new Date(v.start_date).toDateString());
      });
    });
    return dates;
  }, [allTours, filterHome.idTour]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        departureRef.current &&
        !departureRef.current.contains(event.target) &&
        destinationRef.current &&
        !destinationRef.current.contains(event.target) &&
        dateRef.current &&
        !dateRef.current.contains(event.target) &&
        durationRef.current &&
        !durationRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setIsOpenSecond(false);
        setIsOpenThird(false);
        setIsOpenFourth(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabChange = (id) => {
    setFilterHome({ idTour: id, departure: "", destination: "", date: null, duration: "" });
  };

  const handleFilter = () => {
    setHasFiltered(true);
    dispatch(fetchProductsFilter(filterHome));
  };

  return (
    <div className="mx-4 mt-[40px] md:mx-10 lg:mx-20 md:-mt-[40px] bg-[#0A3F7E] py-6 select-none relative z-60">
      <div className="px-4 md:px-8">
        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8 text-white mb-5">
          {selectTour.map((item) => (
            <label
              key={item.id}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => handleTabChange(item.id)}
            >
              <span className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <span
                  className={
                    filterHome.idTour === item.id
                      ? "w-2 h-2 bg-white rounded-full"
                      : ""
                  }
                />
              </span>
              <span className="text-base font-medium">{item.text}</span>
            </label>
          ))}
        </div>

        {/* Search Box */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Điểm đi = nơi khởi hành (cột location) */}
          <div
            ref={departureRef}
            className="relative flex items-center gap-3 bg-white px-4 py-3 w-full md:w-[350px]"
            onClick={() => setIsOpen(!isOpen)}
          >
            <LocationIcon />
            <div>
              <p className="text-xs text-[#0A3F7E] font-semibold">Điểm đi</p>
              <p className="text-sm text-gray-400">
                {filterHome.departure || "Chọn điểm đi"}
              </p>
            </div>

            <div
              className={`absolute top-14 left-0 w-full bg-white border shadow-lg z-10 ${
                isOpen ? "block" : "hidden"
              }`}
            >
              <div
                className="p-3 cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterHome({ ...filterHome, departure: "" });
                  setIsOpen(false);
                }}
              >
                Chọn điểm đi
              </div>

              {departureOptions.map((option) => (
                <div
                  key={option}
                  className={`p-3 cursor-pointer ${
                    filterHome.departure === option
                      ? "bg-[#013879] text-white"
                      : "text-[#013879] hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterHome({ ...filterHome, departure: option });
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* Swap */}
          <div className="hidden lg:flex items-center justify-center text-white">
            <SwapIcon />
          </div>

          {/* Điểm đến (cột destination) */}
          <div
            ref={destinationRef}
            className="relative flex items-center gap-3 bg-white px-4 py-3 w-full md:w-[350px]"
            onClick={() => setIsOpenSecond(!isOpenSecond)}
          >
            <LocationIcon />
            <div>
              <p className="text-xs text-[#0A3F7E] font-semibold">Điểm đến</p>
              <p className="text-sm text-gray-400">
                {filterHome.destination || "Chọn điểm đến"}
              </p>
            </div>

            <div
              className={`absolute top-14 left-0 w-full bg-white border shadow-lg z-10 max-h-[300px] overflow-y-auto ${
                isOpenSecond ? "block" : "hidden"
              }`}
            >
              <div
                className="p-3 cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterHome({ ...filterHome, destination: "" });
                  setIsOpenSecond(false);
                }}
              >
                Chọn điểm đến
              </div>

              {destinationOptions.length === 0 ? (
                <div className="p-3 text-gray-400 text-sm">Chưa có dữ liệu</div>
              ) : (
                destinationOptions.map((option) => (
                  <div
                    key={option}
                    className={`p-3 cursor-pointer ${
                      filterHome.destination === option
                        ? "bg-[#013879] text-white"
                        : "text-[#013879] hover:bg-gray-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilterHome({ ...filterHome, destination: option });
                      setIsOpenSecond(false);
                    }}
                  >
                    {option}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Ngày đi */}
          <div
            ref={dateRef}
            className="relative bg-white px-4 py-3 w-full md:w-[280px]"
          >
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => setIsOpenThird(true)}
            >
              <CalendarIcon />
              <div>
                <p className="text-xs text-[#0A3F7E] font-semibold">Ngày đi</p>
                <p
                  className="text-sm text-gray-400 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterHome({ ...filterHome, date: null });
                    setIsOpenThird(false);
                  }}
                >
                  {filterHome.date
                    ? filterHome.date.toLocaleDateString("vi-VN")
                    : "Chọn ngày đi"}
                </p>
              </div>
            </div>

            {isOpenThird && (
              <div className="absolute top-14 left-0 bg-white border shadow-lg z-10 h-[315px]">
                <DatePicker
                  selected={filterHome.date}
                  onChange={(date) => {
                    setFilterHome({ ...filterHome, date });
                    setIsOpenThird(false);
                  }}
                  inline
                  minDate={new Date()}
                  highlightDates={[...availableDates].map((d) => new Date(d))}
                />
              </div>
            )}
          </div>

          {/* Số ngày */}
          <div
            ref={durationRef}
            className="relative flex items-center gap-3 bg-white px-4 py-3 w-full md:w-[220px]"
            onClick={() => setIsOpenFourth(!isOpenFourth)}
          >
            <CalendarIcon />
            <div>
              <p className="text-xs text-[#0A3F7E] font-semibold">Số ngày</p>
              <p className="text-sm text-gray-400">
                {filterHome.duration || "Tất cả"}
              </p>
            </div>

            <div
              className={`absolute top-14 left-0 w-full bg-white border shadow-lg z-10 ${
                isOpenFourth ? "block" : "hidden"
              }`}
            >
              <div
                className="p-3 cursor-pointer hover:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  setFilterHome({ ...filterHome, duration: "" });
                  setIsOpenFourth(false);
                }}
              >
                Tất cả
              </div>

              {DayOptions.map((option) => (
                <div
                  key={option.id}
                  className={`p-3 cursor-pointer ${
                    filterHome.duration === option.text
                      ? "bg-[#013879] text-white"
                      : "text-[#013879] hover:bg-gray-100"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilterHome({ ...filterHome, duration: option.text });
                    setIsOpenFourth(false);
                  }}
                >
                  {option.text}
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <button
            className="bg-[#E11D2E] w-full lg:w-14 h-14 flex items-center justify-center hover:brightness-110 transition"
            onClick={handleFilter}
          >
            <SearchIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterHome;
