import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const Banner = () => {
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

  const ImageLinks = [
    {
      id: "1",
      linkImg:
        "https://www.luavietours.com/wp/wp-content/uploads/2025/08/BANNER-WEBSITE-MY.png",
    },
    {
      id: "2",
      linkImg:
        "https://www.luavietours.com/wp/wp-content/uploads/2025/08/BANNER-WEBSITE-DONG-AU-THU-202.png",
    },
    {
      id: "3",
      linkImg:
        "https://www.luavietours.com/wp/wp-content/uploads/2025/08/BANNER-NHAT-BAN-WEB.png",
    },
    {
      id: "4",
      linkImg:
        "https://www.luavietours.com/wp/wp-content/uploads/2025/08/BANNER-WEBSITE-HAN-QUOC-pc-2048x545.png",
    },
  ];
  return (
    <Carousel
      responsive={responsive}
      autoPlay={true} // bật auto chạy
      autoPlaySpeed={3000} // 3 giây 1 slide
      infinite={true} // lặp vô hạn
      arrows={false} // hiện mũi tên
      showDots={false} //hiện chấm dưới
    >
      {ImageLinks.length > 0
        ? ImageLinks.map((image) => (
            <div key={image.id} className="w-full h-full">
              <img src={image.linkImg} alt="link-hinh-anh-banner" />
            </div>
          ))
        : "Thiếu Banner"}
    </Carousel>
  );
};

export default Banner;
