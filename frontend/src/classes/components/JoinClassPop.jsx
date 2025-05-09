import * as Yup from "yup";
import { Formik, Form } from "formik";
import Input from "../../components/Input.jsx";

const validationSchema = Yup.object({
  classCode: Yup.string()
    .required("کد کلاس الزامی است")
    .matches(/^[A-Za-z0-9]{6}$/, "کد کلاس باید ۶ کاراکتر باشد"),
  classPassword: Yup.string()
    .required("رمز ورود الزامی است")
    .min(6, "حداقل ۶ کاراکتر باشد"),
});

function JoinClass({ onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div
        className="bg-[var(--white)] w-[400px] p-6 rounded-2xl shadow-lg relative"
        style={{ animation: "var(--animate-fadeIn)" }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-[var(--color-neutralgray-3)] w-6 h-6 rounded-full flex items-center justify-center"
          aria-label="بستن فرم"
        >
          <span className="text-[var(--color-big-stone-900)] text-lg font-bold mt-1">
            ×
          </span>
        </button>

        <h2
          className="text-center mb-2 text-[var(--color-big-stone-900)]"
          style={{
            fontSize: "var(--text-heading-h4)",
            fontWeight: "var(--text-heading-h4--font-weight)",
            lineHeight: "var(--text-heading-h4--line-height)",
          }}
        >
          ورود به کلاس جدید
        </h2>
        <div className="w-72 h-0.5 bg-[var(--color-neutralgray-3)] mx-auto mb-2 rounded"></div>
        <p
          className="text-center text-[var(--label)] mb-1"
          style={{
            fontSize: "var(--text-body-04)",
            fontWeight: "var(--text-body-04--font-weight)",
            lineHeight: "var(--text-body-04--line-height)",
          }}
        >
          . اطلاعات زیر را جهت ورود به کلاس وارد کنید
        </p>

        <Formik
          initialValues={{ classCode: "", classPassword: "" }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        >
          {({ values, setFieldValue, handleBlur, touched, errors }) => (
            <Form className="space-y-1">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Input
                    label="رمز ورود به کلاس"
                    text="Example1234"
                    value={values.classPassword}
                    handleValueChange={(e, val) =>
                      setFieldValue("classPassword", val)
                    }
                    field={{
                      name: "classPassword",
                      value: values.classPassword,
                      onChange: (e) =>
                        setFieldValue("classPassword", e.target.value),
                      onBlur: handleBlur,
                    }}
                    form={{ touched, errors }}
                    className={`rounded-lg p--1 w-full placeholder-[var(--label)] text-left transition-all duration-200 focus:ring-2 focus:ring-[var(--lightBulue)] focus:border-[var(--lightBulue)] ${
                      touched.classPassword && errors.classPassword
                        ? "border-[var(--error)]"
                        : "border-[var(--color-big-stone-200)]"
                    }`}
                    labelClassName="text-[var(--color-big-stone-900)] text-[var(--text-body-04)] mb-1 block"
                    errorClassName="text-[var(--error)] text-[var(--text-caption-02)] mt-1 text-right"
                    type="text"
                    dir="ltr"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    label="کد کلاس"
                    text="123456"
                    value={values.classCode}
                    handleValueChange={(e, val) =>
                      setFieldValue("classCode", val)
                    }
                    field={{
                      name: "classCode",
                      value: values.classCode,
                      onChange: (e) =>
                        setFieldValue("classCode", e.target.value),
                      onBlur: handleBlur,
                    }}
                    form={{ touched, errors }}
                    className={`rounded-lg p--1 w-full placeholder-[var(--label)] text-left transition-all duration-200 focus:ring-2 focus:ring-[var(--lightBulue)] focus:border-[var(--lightBulue)] ${
                      touched.classCode && errors.classCode
                        ? "border-[var(--error)]"
                        : "border-[var(--color-big-stone-200)]"
                    }`}
                    labelClassName="text-[var(--color-big-stone-900)] text-[var(--text-body-04)] mb-1 block"
                    errorClassName="text-[var(--error)] text-[var(--text-caption-02)] mt-1 text-right"
                    type="text"
                    dir="ltr"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 mt-1 bg-[var(--color-big-stone-950)] text-[var(--white)] rounded-lg hover:bg-[var(--color-big-stone-800)] transition-all duration-200"
                style={{
                  fontSize: "var(--text-button-01)",
                  fontWeight: "var(--text-button-01--font-weight)",
                  lineHeight: "var(--text-button-01--line-height)",
                }}
              >
                ورود
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default JoinClass;
