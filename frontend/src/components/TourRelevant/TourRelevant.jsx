import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTicket,
  faLocationDot,
  faJetFighter,
} from "@fortawesome/free-solid-svg-icons";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/Loading/Loading";

const TourRelevant = ({ title, data }) => {
  const loading = useSelector((state) => state.products.loading);

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };
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
    <div className="bg-gray-100 py-10 md:py-20">
      {loading && <LoadingSpinner />}
      <div className="mx-5 md:mx-20 bg-gray-100">
        <div className="flex items-center justify-center">
          <h2 className="mb-10 text-3xl font-bold text-[#013879]">{title}</h2>
        </div>
        <Carousel
          responsive={responsive}
          autoPlay={true} // bật auto chạy
          autoPlaySpeed={3000} // 3 giây 1 slide
          infinite={true} // lặp vô hạn
          arrows={false} // hiện mũi tên
          showDots={false} //hiện chấm dưới
        >
          <div className="grid grid-cols-1 grid-rows-1 md:grid-cols-4 justify-items-stretch items-start gap-x-4 gap-y-12">
            {data && data.length > 0
              ? data.map((tour) => (
                  <div
                    key={tour.id}
                    className="leading-6"
                    onClick={() => navigate(`/tours/${tour.slug}`)}
                  >
                    <div className="h-[219.23px] overflow-hidden">
                      <img
                        src={tour.thumbnail}
                        alt="hinh-tour "
                        className="w-full h-full object-cover object-center hover:scale-110 transition-transform duration-500 ease-in-out"
                      />
                    </div>
                    <p className="text-sm mt-2">Thời lượng: {tour.duration}</p>
                    <p className="text-lg font-semibold leading-5 my-2">
                      {tour.title}
                    </p>
                    <p className="text-sm">
                      <FontAwesomeIcon icon={faTicket} className="text-sm" /> Mã
                      tour: <span className="font-semibold">BUITRANTIEN</span>
                    </p>
                    <p className="text-sm">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        className="text-sm"
                      />{" "}
                      Nơi khởi hành:{" "}
                      <span className="font-semibold">{tour.location}</span>
                    </p>
                    <p className="text-sm">
                      <FontAwesomeIcon
                        icon={faJetFighter}
                        className="text-sm"
                      />{" "}
                      Hãng bay:{" "}
                      <span className="font-semibold">Vietjet Air</span>
                    </p>
                    <div className="text-sm select-none">
                      <div className="inline-block space-x-1">
                        <span>Ngày đi:</span>
                        {tour.variants?.map((variant) => (
                          <div
                            key={variant.id}
                            className="inline-flex items-center justify-center rounded-full bg-[#d4f1ff] px-2 m-1 font-medium"
                          >
                            <p>{formatDate(variant.start_date)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-red-500 text-xl font-semibold">
                      {parseFloat(
                        tour.variants?.[0]?.final_price ||
                          tour.variants?.[0]?.price ||
                          0,
                      ).toLocaleString("vi-VN")}
                      <span className="text-sm">VNĐ</span>
                    </p>
                  </div>
                ))
              : "Không Có Tour Nào Hiện Nay"}
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default TourRelevant;
