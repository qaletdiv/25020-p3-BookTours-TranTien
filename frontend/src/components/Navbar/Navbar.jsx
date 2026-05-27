import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserCheck, faBars, faXmark, faUserShield } from "@fortawesome/free-solid-svg-icons";

const MenuLinks = [
  { id: 1, name: "Trang Chủ",  link: "/" },
  { id: 2, name: "Giới Thiệu", link: "/gioi-thieu" },
  { id: 3, name: "Tour Du Lịch", link: "/tour-du-lich" },
];

const Navbar = () => {
  const navigate    = useNavigate();
  const accessToken = useSelector((s) => s.auth.accessToken);
  const userStr     = useSelector((s) => s.auth.user);
  const user        = userStr ? JSON.parse(userStr) : null;
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <div className="w-full bg-white shadow-md sticky top-0 z-40">
      <div className="px-5 md:px-20 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="w-[140px] cursor-pointer" onClick={() => navigate("/")}>
          <img src="https://www.luavietours.com/assets/img/common/logo.jpg" alt="logo" className="w-full" />
        </div>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-6">
          {MenuLinks.map((menu) => (
            <Link key={menu.id} to={menu.link} className="text-base font-medium text-[#013879] hover:text-blue-600">
              {menu.name}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link to="/admin" className="text-base font-medium text-purple-700 hover:text-purple-900 flex items-center gap-1">
              <FontAwesomeIcon icon={faUserShield} className="text-sm" /> Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => navigate(accessToken ? "/info" : "/dang-nhap")}
            className="cursor-pointer"
            title={accessToken ? "Tài khoản của tôi" : "Đăng nhập"}
          >
            <FontAwesomeIcon
              icon={accessToken ? faUserCheck : faUser}
              className={`text-xl ${accessToken ? "text-green-600" : "text-[#013879]"}`}
            />
          </div>
          <button className="md:hidden text-2xl text-[#013879]" onClick={() => setOpenMenu(!openMenu)}>
            <FontAwesomeIcon icon={faBars} />
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${openMenu ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setOpenMenu(false)}
      />
      {openMenu && (
        <button onClick={() => setOpenMenu(false)} className="fixed top-4 left-4 z-50 w-10 h-10 text-white flex items-center justify-center shadow-lg">
          <FontAwesomeIcon icon={faXmark} className="text-xl" />
        </button>
      )}
      {/* Mobile menu */}
      <div className={`fixed top-0 right-0 h-full w-[75%] max-w-[320px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${openMenu ? "translate-x-0" : "translate-x-full"}`}>
        <div className="px-6 py-10 space-y-6">
          {MenuLinks.map((menu) => (
            <a key={menu.id} href={menu.link} onClick={() => setOpenMenu(false)} className="block text-base font-medium text-[#013879]">
              {menu.name}
            </a>
          ))}
          {user?.role === "admin" && (
            <a href="/admin" onClick={() => setOpenMenu(false)} className="block text-base font-medium text-purple-700">
              Admin Panel
            </a>
          )}
          <a href={accessToken ? "/info" : "/dang-nhap"} onClick={() => setOpenMenu(false)} className="block text-base font-medium text-[#013879]">
            {accessToken ? "Tài khoản" : "Đăng nhập"}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
