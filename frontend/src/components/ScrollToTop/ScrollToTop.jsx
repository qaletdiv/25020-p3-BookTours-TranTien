import { useEffect } from "react";
import { useLocation } from "react-router-dom";
//useLocation sẽ lấy tất cả thông tin URL hiện tại

const ScrollToTop = () => {
  const { pathname } = useLocation();
  //Chỉ lấy pathname vì chỉ quan tâm đổi trang (Vd: pathname: "/tour-du-lich/ha-long")

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // hoặc "smooth" | Giải thích: instant": nhảy lên ngay lập tức, "smooth": cuộn mượt
    });
  }, [pathname]);
  //Đổi route = đổi pathname = scroll lên đầu

  return null;
};

export default ScrollToTop;