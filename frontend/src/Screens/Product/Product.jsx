import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import TourCategory from "../../components/TourCategory/TourCategory";
import Filter from "../../components/Filter/Filter";
import LoadingSpinner from "../../components/Loading/Loading";
import RevealOnScroll from "../../components/RevealOnScroll/RevealOnScroll";
import {
  fetchPagedTours,
  fetchFilterProducts,
} from "../../redux/slices/productSlice";
import { tourOptions } from "../../data/options";

const PAGE_SIZE = 6;

const Product = () => {
  const [categoryTitle, setCategoryTitle] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [departureList, setDepartureList] = useState([]);
  const [destinationList, setDestinationList] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("");

  const dispatch = useDispatch();
  const pagedProducts = useSelector((state) => state.products.pagedProducts);
  const pagedTotal    = useSelector((state) => state.products.pagedTotal);
  const loading       = useSelector((state) => state.products.loading);
  const filterProducts = useSelector((state) => state.products.filterProducts);

  useEffect(() => {
    dispatch(fetchPagedTours({ page: 1 }));
  }, [dispatch]);

  const handleDeparture = (value) => {
    const result = pagedProducts.filter((p) => p.location === value);
    setDepartureList(result);
    setActiveFilter("departure");
  };

  const handleDestination = (value) => {
    const result = pagedProducts.filter((p) =>
      p.destination?.toLowerCase().includes(value.toLowerCase()),
    );
    setDestinationList(result);
    setActiveFilter("destination");
  };

  const handleFilterRadio = (id) => {
    const category = tourOptions.find((option) => option.id === id);
    setCategoryTitle(category?.name || "");
    const newCategoryId = id === 3 ? null : id;
    setCategoryId(newCategoryId);
    setCurrentPage(1);
    setSortedProducts([]);
    setDepartureList([]);
    setDestinationList([]);
    dispatch(fetchFilterProducts(id === 3 ? {} : { id }));
    setActiveFilter("filter");
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
    setSortedProducts([]);
    dispatch(fetchPagedTours({ page: newPage, categoryId }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let finalData = [];
  let finalTitle = "";

  if (activeFilter === "filter") {
    finalData = filterProducts;
    finalTitle = filterProducts.length > 0 ? categoryTitle : "Không có tour nào";
  } else if (activeFilter === "departure") {
    finalData = departureList;
    finalTitle = departureList.length > 0 ? "Tour theo điểm khởi hành" : "Không có tour nào";
  } else if (activeFilter === "destination") {
    finalData = destinationList;
    finalTitle = destinationList.length > 0 ? "Tour theo điểm đến" : "Không có tour nào";
  } else {
    finalData = pagedProducts;
    finalTitle = "Tour Du Lịch";
  }

  const getMinPrice = (tour) => {
    if (!tour.variants?.length) return 0;
    return Math.min(...tour.variants.map((v) => parseFloat(v.final_price || v.price || 0)));
  };

  const sortByPrice = (data, order) =>
    [...data].sort((a, b) => {
      if (order === "asc") return getMinPrice(a) - getMinPrice(b);
      if (order === "desc") return getMinPrice(b) - getMinPrice(a);
      return 0;
    });

  const handleSort = (order) => {
    setSortedProducts(sortByPrice(finalData, order));
  };

  const displayData = sortedProducts.length > 0 ? sortedProducts : finalData;

  // Server-side total pages (only for main/category listing)
  const isServerPaged = activeFilter === "" || (activeFilter === "filter" && false);
  const totalPages = activeFilter === ""
    ? Math.ceil(pagedTotal / PAGE_SIZE)
    : Math.ceil(finalData.length / PAGE_SIZE);

  return (
    <div className="mx-4 my-6 md:mx-20 md:my-10">
      {loading && <LoadingSpinner />}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <RevealOnScroll>
            <Filter
              handleFilterRadio={handleFilterRadio}
              departure={handleDeparture}
              destination={handleDestination}
            />
          </RevealOnScroll>
        </div>
        <div className="w-full md:w-2/3">
          <RevealOnScroll>
            <div className="mb-6">
              <img
                src="https://www.luavietours.com/wp/wp-content/uploads/2025/05/uu-dai-pc.jpg"
                alt="Ưu đãi tour du lịch"
                className="w-full object-cover"
              />
            </div>
          </RevealOnScroll>
          <div>
            <RevealOnScroll delay={100}>
              {displayData.length > 0 ? (
                <TourCategory
                  title={finalTitle || "Tour Du Lịch"}
                  data={displayData}
                  handleSort={handleSort}
                />
              ) : (
                <p className="text-center text-gray-500 py-10 text-lg">
                  Không có tour nào phù hợp
                </p>
              )}
            </RevealOnScroll>
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-10 flex-wrap">
              <button
                disabled={currentPage === 1}
                onClick={() => changePage(currentPage - 1)}
                className="px-3 py-1 border disabled:opacity-40"
              >
                Trước
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => changePage(p)}
                  className={`px-3 py-1 border ${currentPage === p ? "bg-[#013879] text-white" : ""}`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => changePage(currentPage + 1)}
                className="px-3 py-1 border disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Product;
