import { useSelector } from "react-redux";
import RevealOnScroll from "../../components/RevealOnScroll/RevealOnScroll";

const timelineData = [
  {
    year: "1995 - 1999",
    title: "Giai đoạn hình thành",
  },
  {
    year: "1999 - 2016",
    title: "Giai đoạn xây dựng tên tuổi và hình ảnh",
  },
  {
    year: "2016 - 2019",
    title: "Khẳng định vị thế",
  },
  {
    year: "2019 - 2022",
    title: "Trụ vững trong đại dịch covid",
  },
  {
    year: "2022 - nay",
    title: "Phát triển theo định hướng mới",
  },
];

const services = [
  {
    id: "1",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_4.jpg",
    title: "Cung cấp dịch vụ lữ hành",
    content:
      "Bao gồm các tour trong nước, ngoài nước, hội họp, xúc tiến thương mại, hậu cần du lịch …",
  },
  {
    id: "2",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_5.jpg",
    title: "M.I.C.E",
    content:
      "Họp (Meeting) - Xúc tiến (Incentive) - Hội nghị (Conference) - Triển lãm (Exhibition).",
  },
  {
    id: "3",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_6.jpg",
    title: "Sự kiện",
    content:
      "Các sự kiện nội bộ hoặc có tính tương tác bên ngoài. Đặc biệt các sự kiện yêu cầu phải có giấy phép tổ chức.",
  },
  {
    id: "4",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_7.jpg",
    title: "Team building",
    content: "Các chương trình huấn luyện trong nhà và ngoài trời.",
  },
  {
    id: "5",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_8.jpg",
    title: "Vé máy bay và VISA",
    content:
      "Đại lý vé máy bay trong và ngoài nước. Làm thủ tục VISA các nước.",
  },
  {
    id: "6",
    image: "https://www.luavietours.com/assets/img/gioi-thieu/img_9.jpg",
    title: "Cho thuê xe",
    content:
      "Nhiều sự lựa chọn về các loại xe từ 4 chỗ - 45 chỗ chất lượng cao.",
  },
];

const About = () => {
  const loading = useSelector((state) => state.products.loading);

  return (
    <div className="px-5 md:px-20 my-20">
      {loading && <LoadingSpinner />}

      {/* ===== GIỚI THIỆU CHUNG + TIMELINE ===== */}
      <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-20">
        <div className="flex flex-col justify-between items-start w-full lg:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold text-[#013879] mb-10">
            Giới Thiệu Chung
          </h2>

          <h3 className="text-2xl md:text-3xl font-bold mb-6">
            Quá Trình Thành Lập
          </h3>
          <RevealOnScroll>
            <div className="space-y-3">
              {timelineData.map((data, i) => (
                <div key={i} className="flex items-start gap-4 relative">
                  {/* YEAR */}
                  <div className="w-28 text-right font-bold text-black shrink-0">
                    {data.year}
                  </div>

                  {/* TIMELINE */}
                  <div className="relative w-6 flex justify-center">
                    {/* LINE */}
                    <span className="absolute top-4 h-full border-l-[1.5px] border-dashed border-[#0394d9]"></span>

                    {/* DOT */}
                    <div className="relative z-10 flex items-center justify-center w-4 h-4 rounded-full border border-[#0394d9] bg-white">
                      <span className="w-2 h-2 rounded-full bg-[#0394d9]"></span>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="text-gray-900 leading-relaxed pt-1">
                    {data.title}
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>

        {/* HÌNH ẢNH */}
        <div className="w-full lg:w-1/2">
          <RevealOnScroll>
            <img
              src="https://www.luavietours.com/assets/img/gioi-thieu/img_1.jpg"
              className="w-full rounded-md"
            />
          </RevealOnScroll>
        </div>
      </div>

      {/* ===== SẢN PHẨM - DỊCH VỤ ===== */}
      <h3 className="text-2xl md:text-3xl font-bold mb-16">
        Sản Phẩm - Dịch Vụ
      </h3>
      <RevealOnScroll delay={100}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-20 mb-20">
          {services.map((item) => (
            <div key={item.id}>
              <div className="relative w-full max-w-[364px] mx-auto">
                <img src={item.image} className="w-full h-auto" />

                <div className="absolute p-4 bg-white top-[75%] w-[334px] left-1/2 -translate-x-1/2 shadow-lg">
                  <p className="text-xl font-bold text-[#013879] mb-2">
                    {item.title}
                  </p>
                  <p>{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </RevealOnScroll>

      {/* ===== CHỨNG NHẬN / THÀNH TÍCH ===== */}
      <RevealOnScroll delay={200}>
      <div className="bg-gray-100 px-6 md:px-10 py-10">
        <div className="flex items-start justify-start space-x-3 mb-6">
          <div className="bg-red-600 w-1 h-7"></div>
          <p className="text-lg md:text-xl font-bold">
            Top 10 Lữ hành nội địa hàng đầu TP.HCM - Top 05 Lữ hành quốc tế hàng
            đầu TP.HCM do sở Du lịch TP.HCM trao tặng
          </p>
        </div>

        <img
          src="https://www.luavietours.com/assets/img/gioi-thieu/img_14.png"
          alt=""
        />
      </div>
      </RevealOnScroll>
    </div>
  );
};

export default About;
