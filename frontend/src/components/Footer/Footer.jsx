import React from "react";

const Footer = () => {
  return (
    <>
      <div
        className="flex flex-col md:flex-row
        items-start gap-y-10 md:gap-x-10
        px-5 md:px-20 py-10
        bg-[#013879] text-white leading-8"
      >
        <div className="w-full md:basis-1/3">
          <p className="font-semibold text-xl mb-4">
            CÔNG TY CP ĐT TM DV DU LỊCH LỬA VIỆT TOUR
          </p>
          <p>198 Phan Văn Trị, Phường Gò Vấp, TP. HCM</p>
          <p>Tổng đài: (028) 73 081 888</p>
          <p>Email: sales@luaviettour.com.vn</p>
          <p>Facebook: www.facebook.com/luaviettour</p>
          <p>Giấy phép đăng kí kinh doanh (Mã số thuế): 0309139335.</p>
          <p>Giấy phép Lữ hành quốc tế: GP79- 402/2014/TCDL-GPLHQT.</p>
        </div>

        <div className="w-full md:basis-1/3">
          <p className="font-semibold text-xl mb-4">CÁC CHI NHÁNH VĂN PHÒNG</p>
          <p className="font-medium">Chi nhánh TP.HCM</p>
          <p>401 Đại lộ Bình Dương, Phường Thủ Dầu Một</p>
          <p>ĐT: (0274) 73 01 888</p>

          <p className="font-medium mt-3">Chi nhánh Hà Nội</p>
          <p>Tầng 4, Tòa Gems Office, 74 Khúc Thừa Dụ</p>
          <p>ĐT: (024) 73 081 888</p>

          <p className="font-medium mt-3">Chi nhánh Đồng Nai</p>
          <p>1153 Phạm Văn Thuận, Phường Trấn Biên</p>
          <p>ĐT: (0251) 73 01 888</p>
        </div>

        <div className="w-full md:basis-1/3">
          <p className="font-semibold text-xl mb-4">Chứng Nhận</p>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-[150px]">
              <img
                src="https://inkdtex.com/Image/Picture/New/logo-dang-ky-bo-cong-thuong.png"
                alt="bo-cong-thuong"
              />
              <img
                src="https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1397184588/d3b3c688f03dddbd1d0296db1f0199db.png"
                alt="dmca"
              />
            </div>

            <div className="text-sm">
              <p>
                Giấy chứng nhận đăng ký kinh doanh số 0301659981 do Sở KH&ĐT
                TPHCM cấp.
              </p>
              <p>Thay đổi lần thứ 15 - 07/06/2022</p>
              <p>Giấy phép lữ hành quốc tế: 79-228/2016</p>
              <p>Số D-U-N-S: 555256961</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-black text-white text-xs text-center px-5 py-3">
        Copyright © 1999-2023 Công ty TNHH Du Lịch Lửa Việt
      </div>
    </>
  );
};

export default Footer;
