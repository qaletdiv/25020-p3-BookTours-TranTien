import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import SelectRadio from "../SelectRadio/SelectRadio";
import SelectBox from "../SelectBox/SelectBox";
import { tourOptions } from "../../data/options";

const Filter = ({ handleFilterRadio, departure, destination }) => {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const allTours = useSelector((s) => s.products.products);

  // Lọc tours theo category; id=3 (Nổi Bật) → lấy tất cả
  const toursInCategory = useMemo(() => {
    if (selectedCategory === 3) return allTours;
    return allTours.filter((t) => t.category_id === selectedCategory);
  }, [allTours, selectedCategory]);

  // Điểm đi: từ cột location (nơi khởi hành)
  const departureOptions = useMemo(() => {
    return [...new Set(toursInCategory.map((t) => t.location).filter(Boolean))].sort();
  }, [toursInCategory]);

  // Điểm đến: từ cột destination
  const destinationOptions = useMemo(() => {
    return [...new Set(toursInCategory.map((t) => t.destination).filter(Boolean))].sort();
  }, [toursInCategory]);

  const handleRadio = (id) => {
    setSelectedCategory(id);
    handleFilterRadio(id);
  };

  return (
    <div className="bg-gray-100 w-full md:w-[90%] h-auto px-4 md:px-6 py-6 md:py-8 flex flex-col space-y-4">
      <SelectRadio tourOptions={tourOptions} handleFilterRadio={handleRadio} />
      <SelectBox
        title="Điểm đi"
        title2="Chọn điểm đi"
        options={departureOptions}
        departure={departure}
      />
      <SelectBox
        title="Điểm đến"
        title2="Chọn điểm đến"
        options={destinationOptions}
        destination={destination}
      />
    </div>
  );
};

export default Filter;
