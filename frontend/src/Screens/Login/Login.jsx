import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../redux/slices/authSlice";

const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Vui lòng nhập email"),
  password: Yup.string()
    .required("Vui lòng nhập mật khẩu"),
});

const Login = () => {
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await dispatch(
        login({
          email: values.email,
          password: values.password,
        })
      ).unwrap();

      navigate("/");
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[600px] bg-white my-10">

        {/* Logo */}
        <div className="w-[180px] h-auto mx-auto my-6">
          <img
            src="https://www.luavietours.com/assets/img/common/logo.jpg"
            alt="logo"
            className="w-full h-full object-contain"
          />
        </div>

        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form
              className="
                w-full
                px-6 sm:px-10
                py-8
                shadow-[0_4px_15px_rgba(0,0,0,0.1),_0_2px_5px_rgba(0,0,0,0.08)]
                mx-auto
              "
            >
              <h2 className="mb-6 text-3xl font-bold text-[#013879] text-center">
                Đăng Nhập
              </h2>

              {/* Email */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">
                  Email <span className="text-red-500">*</span>
                </label>
                <Field
                  name="email"
                  type="email"
                  disabled={loading}
                  placeholder="Email"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.75px] bg-black"></div>
                <ErrorMessage
                  name="email"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col mb-4">
                <label className="font-bold">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <Field
                  name="password"
                  type="password"
                  disabled={loading}
                  placeholder="Mật khẩu"
                  className="py-3 focus:outline-none"
                />
                <div className="w-full h-[1.75px] bg-black"></div>
                <ErrorMessage
                  name="password"
                  component="p"
                  className="mt-1 text-xs text-red-500"
                />
              </div>

              <div className="text-center mt-6">
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <button
                  type="submit"
                  disabled={loading || isSubmitting}
                  className="button w-full sm:w-auto px-10"
                >
                  {loading ? "Đang check..." : "Đăng Nhập"}
                </button>
              </div>

              <p className="text-xs text-center mt-4">
                Chưa có tài khoản?{" "}
                <Link to="/dang-ky">
                  <span className="italic text-[#013879]">Đăng Ký</span>
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
