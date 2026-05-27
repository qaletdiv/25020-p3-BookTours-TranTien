import { Formik } from "formik";
import * as Yup from "yup";

const RegisterSchema = Yup.object().shape({
  fullname: Yup.string()
    .required("Vui lòng nhập họ tên")
    .min(3, "Họ tên quá ngắn"),

  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),

  password: Yup.string()
    .required("Vui lòng nhập mật khẩu")
    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),

  confirmPassword: Yup.string()
    .required("Vui lòng nhập lại mật khẩu")
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp"),
});

export default function TestYub() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Formik
        initialValues={{
          fullname: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={RegisterSchema}
        validateOnChange
        validateOnBlur
        onSubmit={(values, { setSubmitting }) => {
          console.log("Submitted:", values);

          setTimeout(() => {
            setSubmitting(false);
            alert("Đăng ký thành công!");
          }, 800);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleSubmit,
          isSubmitting,
        }) => (
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md bg-white p-6 rounded-xl shadow-md space-y-4"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Đăng ký tài khoản
            </h2>

            {/* Họ tên */}
            <div>
              <input
                type="text"
                name="fullname"
                placeholder="Họ và tên"
                value={values.fullname}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${
                    errors.fullname && touched.fullname
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
              />
              {errors.fullname && touched.fullname && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.fullname}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${
                    errors.email && touched.email
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
              />
              {errors.email && touched.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Mật khẩu */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mật khẩu"
                value={values.password}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${
                    errors.password && touched.password
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
              />
              {errors.password && touched.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Nhập lại mật khẩu"
                value={values.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2
                  ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-400 focus:ring-red-200"
                      : "border-gray-300 focus:ring-blue-200"
                  }`}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-lg text-white font-medium transition
                ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}