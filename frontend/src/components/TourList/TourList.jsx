import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faLocationDot,
  faJetFighter,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { getImageUrl } from "../../utils/imageUrl";

const TourList = ({ title, data }) => {
  const navigate = useNavigate();

  //Hàm chuyển ngày, tháng, năm chỉ còn ngày với tháng
  const formatDate = (dateStr) =>
    new Date(dateStr)
      .toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      })
      .replace("/", "-");

  return (
    <div className="px-5 md:px-20">
      <h2 className="my-10 md:my-20 text-2xl md:text-4xl font-bold text-[#013879] text-center">
        {title}
      </h2>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
        gap-x-6 gap-y-12"
      >
        {data && data.length > 0
          ? data.map((tour) => (
              <div
                key={tour.id}
                onClick={() => navigate(`/tours/${tour.slug}`)}
                className="cursor-pointer leading-6
                  overflow-hidden"
              >
                <div className="h-[220px] md:h-[300px] overflow-hidden">
                  <img
                    src={getImageUrl(tour.thumbnail)}
                    alt={tour.title}
                    className="w-full h-full object-cover
                      hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-3">
                  <p className="text-sm">Thời lượng: {tour.duration} ngày</p>
                  <p className="text-lg font-semibold my-2">{tour.title}</p>

                  <p className="text-sm">
                    <FontAwesomeIcon icon={faTicket} /> Mã tour:
                    <span className="font-semibold"> BUITRANTIEN</span>
                  </p>

                  <p className="text-sm">
                    <FontAwesomeIcon icon={faLocationDot} /> Nơi khởi hành:
                    <span className="font-semibold"> {tour.location}</span>
                  </p>

                  <p className="text-sm">
                    <FontAwesomeIcon icon={faJetFighter} /> Hãng bay:
                    <span className="font-semibold"> Vietjet Air</span>
                  </p>

                  <div className="text-sm mt-2">
                    <span>Ngày đi:</span>
                    {tour.variants.map((variant) => (
                      <span
                        key={variant.id}
                        className="inline-flex items-center justify-center
                        rounded-full bg-[#d4f1ff]
                        px-2 py-0.5 m-1 font-medium"
                      >
                        {formatDate(variant.start_date)}
                      </span>
                    ))}
                  </div>

                  <p className="text-red-500 text-xl font-semibold mt-2">
                    {Math.min(
                      ...tour.variants.map((v) => parseFloat(v.final_price)),
                    ).toLocaleString("vi-VN")}
                    <span className="text-sm"> VNĐ</span>
                  </p>
                </div>
              </div>
            ))
          : "Không Có Tour Nào Hiện Nay"}
      </div>

      <div className="text-center my-10 md:my-20">
        <button
          onClick={() => navigate("/tours")}
          className="bg-[#ed1b35] hover:bg-[#0394d9]
          transition-colors duration-300
          text-white px-10 md:px-20 py-3 md:py-4
          font-medium text-base md:text-lg"
        >
          Xem Thêm
        </button>
      </div>
    </div>
  );
};

export default TourList;
