import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faLocationDot, faJetFighter } from "@fortawesome/free-solid-svg-icons";
import Sortof from "../Sortof/Sortof";
import { getImageUrl } from "../../utils/imageUrl";

const TourCategory = ({ title, data, handleSort }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }).replace("/", "-");

  const getMinPrice = (variants) => {
    if (!variants || variants.length === 0) return null;
    return Math.min(...variants.map((v) => parseFloat(v.final_price || v.price || 0)));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 md:gap-0">
        <h2 className="my-6 md:my-10 text-2xl md:text-4xl font-bold text-[#013879] text-left md:text-center">
          {title}
        </h2>
        <Sortof handleSort={handleSort} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-stretch items-start gap-x-4 gap-y-12">
        {data && data.length > 0
          ? data.map((tour) => (
              <div
                key={tour.id}
                className="leading-6 cursor-pointer overflow-hidden"
                onClick={() => navigate(`/tours/${tour.slug}`)}
              >
                <div className="h-[220px] overflow-hidden">
                  <img
                    src={getImageUrl(tour.thumbnail)}
                    alt={tour.title}
                    className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500 ease-in-out"
                  />
                </div>

                <div className="p-2">
                  <p className="text-sm mt-2">Thời lượng: {tour.duration} ngày</p>
                  <p className="text-lg font-semibold leading-5 my-2">{tour.title}</p>
                  <p className="text-sm">
                    <FontAwesomeIcon icon={faTicket} className="text-sm" /> Mã tour:{" "}
                    <span className="font-semibold">LUAVIET</span>
                  </p>
                  <p className="text-sm">
                    <FontAwesomeIcon icon={faLocationDot} className="text-sm" /> Nơi khởi hành:{" "}
                    <span className="font-semibold">{tour.location}</span>
                  </p>
                  <p className="text-sm">
                    <FontAwesomeIcon icon={faJetFighter} className="text-sm" /> Hãng bay:{" "}
                    <span className="font-semibold">Vietjet Air</span>
                  </p>
                  {tour.variants && tour.variants.length > 0 && (
                    <div className="text-sm select-none mt-2">
                      <span>Ngày đi: </span>
                      {tour.variants.slice(0, 3).map((v) => (
                        <span
                          key={v.id}
                          className="inline-flex items-center justify-center rounded-full bg-[#d4f1ff] px-2 m-1 font-medium"
                        >
                          {formatDate(v.start_date)}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-red-500 text-xl font-semibold mt-1">
                    {getMinPrice(tour.variants)?.toLocaleString("vi-VN") || "Liên hệ"}
                    <span className="text-sm"> VNĐ</span>
                  </p>
                </div>
              </div>
            ))
          : <p className="col-span-3 text-center text-gray-400 py-10">Không có tour nào</p>}
      </div>
    </div>
  );
};

export default TourCategory;
