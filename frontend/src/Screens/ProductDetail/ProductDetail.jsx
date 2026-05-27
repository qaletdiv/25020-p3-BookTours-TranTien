import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTicket, faLocationDot, faJetFighter } from "@fortawesome/free-solid-svg-icons";
import { fetchProductSlug, fetchRelatedProducts } from "../../redux/slices/productSlice";
import { getImageUrl } from "../../utils/imageUrl";
import LoadingSpinner from "../../components/Loading/Loading";
import TourRelevant from "../../components/TourRelevant/TourRelevant";
import { addCart } from "../../redux/slices/cartSlice";
import RevealOnScroll from "../../components/RevealOnScroll/RevealOnScroll";

const ProductDetail = () => {
  const navigate       = useNavigate();
  const dispatch       = useDispatch();
  const { slug }       = useParams();
  const loading        = useSelector((s) => s.products.loading);
  const product        = useSelector((s) => s.products.currentProduct);
  const relatedProduct = useSelector((s) => s.products.relatedProducts);
  const accessToken    = useSelector((s) => s.auth.accessToken);
  const userStr        = useSelector((s) => s.auth.user);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isOpen, setIsOpen]       = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const normalized = slug.toLowerCase();
    setSelectedVariant(null);
    dispatch(fetchProductSlug(normalized));
    dispatch(fetchRelatedProducts(normalized));
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.variants?.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }).replace("/", "-");

  const images = product?.images?.length > 0
    ? product.images.map((img) => getImageUrl(img.image_url))
    : product?.thumbnail
      ? [getImageUrl(product.thumbnail)]
      : [];

  const handleOrder = () => {
    if (!accessToken) {
      alert("Vui lòng đăng nhập để đặt tour");
      navigate("/dang-nhap");
      return;
    }
    if (!selectedVariant) {
      alert("Vui lòng chọn ngày khởi hành");
      return;
    }

    const user = userStr ? JSON.parse(userStr) : {};
    dispatch(addCart({
      productId:     product.id,
      productName:   product.title,
      price:         selectedVariant.final_price || selectedVariant.price,
      variantId:     selectedVariant.id,
      departureDate: selectedVariant.start_date,
      returnDate:    selectedVariant.end_date,
      userName:  user.username || "",
      userEmail: user.email    || "",
      userPhone: user.phone    || "",
    }));
    navigate("/booking");
  };

  return (
    <div>
      {loading && <LoadingSpinner />}

      {!loading && product && (
        <div className="mx-5 md:mx-20 my-10 font-bai-jamjuree">
          <p className="text-sm">
            <FontAwesomeIcon icon={faTicket} className="text-sm" /> Mã tour:{" "}
            <span className="font-semibold">LUAVIET</span>
          </p>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="space-y-4">
              <p className="text-3xl font-semibold leading-tight my-6">{product.title}</p>
              <p className="hidden md:block md:text-sm mt-2">Thời lượng: {product.duration} ngày</p>
              <div className="hidden md:flex md:items-center space-x-8">
                <p className="text-sm">
                  <FontAwesomeIcon icon={faJetFighter} className="text-sm" /> Hãng bay:{" "}
                  <span className="font-semibold">Vietjet Air</span>
                </p>
                <p className="text-sm">
                  <FontAwesomeIcon icon={faLocationDot} className="text-sm" /> Nơi khởi hành:{" "}
                  <span className="font-semibold">{product.location}</span>
                </p>
                <div className="text-sm select-none">
                  <span className={!selectedVariant && product.variants?.length > 0 ? "text-red-500 font-medium" : ""}>
                    Ngày đi:{" "}
                    {!selectedVariant && product.variants?.length > 0 && (
                      <span className="text-red-400 text-xs font-normal">(Vui lòng chọn)</span>
                    )}
                  </span>
                  {product.variants?.map((variant) => (
                    <div
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`inline-flex items-center justify-center rounded-full px-2 m-1 font-medium cursor-pointer transition-colors ${
                        selectedVariant?.id === variant.id
                          ? "bg-[#013879] text-white"
                          : "bg-[#d4f1ff] hover:bg-[#EBF4F8]"
                      }`}
                    >
                      {formatDate(variant.start_date)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-red-500 text-2xl font-semibold mt-4 md:mt-0">
              {selectedVariant
                ? parseFloat(selectedVariant.final_price || selectedVariant.price).toLocaleString("vi-VN")
                : "Liên hệ"}
              <span className="text-sm"> VNĐ</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleOrder}
              disabled={!selectedVariant && product.variants?.length > 0}
              className={`transition-colors duration-300 text-white px-10 md:px-20 py-3 md:py-4 font-medium text-base md:text-lg
                ${!selectedVariant && product.variants?.length > 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-[#ed1b35] hover:bg-[#0394d9] cursor-pointer"
                }`}
            >
              Đặt Tour
            </button>
            {!selectedVariant && product.variants?.length > 0 && (
              <p className="text-red-500 text-sm mt-2">← Vui lòng chọn ngày khởi hành để tiếp tục</p>
            )}
          </div>

          {/* Image Gallery */}
          <div className="mt-10 md:mt-16">
            <h3 className="text-xl md:text-2xl font-semibold mb-6">Hình Ảnh Tour</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96 md:h-[500px]">
              <div
                className="md:col-span-2 rounded-lg overflow-hidden cursor-pointer group relative"
                onClick={() => { setCurrentIndex(0); setIsOpen(true); }}
              >
                <img src={images[0]} alt="Main tour" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {images.slice(1, 5).map((img, i) => (
                  <div
                    key={i + 1}
                    className="rounded-lg overflow-hidden cursor-pointer group relative"
                    onClick={() => { setCurrentIndex(i + 1); setIsOpen(true); }}
                  >
                    <img src={img} alt={`Tour ${i + 2}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="mt-10">
              <h3 className="text-xl font-semibold mb-4 text-[#013879]">Mô Tả Tour</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">{product.description}</p>
            </div>
          )}

          {/* Image Modal */}
          {isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={() => setIsOpen(false)}>
              <button className="absolute top-5 right-5 text-white text-4xl hover:text-gray-300" onClick={() => setIsOpen(false)}>✕</button>
              <button
                className="absolute left-5 text-white text-5xl hover:text-gray-300"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex - 1 + images.length) % images.length); }}
              >‹</button>
              <img src={images[currentIndex]} className="w-[90%] h-[90%] max-w-4xl max-h-[600px] object-contain" alt="" />
              <button
                className="absolute right-5 text-white text-5xl hover:text-gray-300"
                onClick={(e) => { e.stopPropagation(); setCurrentIndex((currentIndex + 1) % images.length); }}
              >›</button>
            </div>
          )}
        </div>
      )}

      {!loading && relatedProduct?.length > 0 && (
        <RevealOnScroll>
          <TourRelevant title="Tour liên quan" data={relatedProduct} />
        </RevealOnScroll>
      )}
    </div>
  );
};

export default ProductDetail;
