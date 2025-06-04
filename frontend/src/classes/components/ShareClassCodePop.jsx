import { Copy } from "iconsax-react";
import { useState } from "react";

function ShareClassCode({
  classCode = "ABC123",
  classPassword = "pass4567",
  onClose,
}) {
  const [isCopying, setIsCopying] = useState(false);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("کپی موفقیت‌آمیز:", text);
    } catch (err) {
      console.error("خطا در کپی:", err);
    }
  };

  const handleCopyAll = () => {
    handleCopy(`کد: ${classCode}, رمز: ${classPassword}`);
  };

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
          کد ورود به کلاس
        </h2>

        <div className="w-72 h-0.5 bg-[var(--color-neutralgray-3)] mx-auto mb-3 rounded"></div>

        <p
          className="text-center text-[var(--label)] mb-4"
          style={{
            fontSize: "var(--text-body-04)",
            fontWeight: "var(--text-body-04--font-weight)",
            lineHeight: "var(--text-body-04--line-height)",
          }}
        >
          .
          اطلاعات زیر را با دانشجویان به اشتراک بگذارید
        </p>

        <div className="space-y-4 text-right">
          {/* کد کلاس */}
          <div className="flex flex-row-reverse items-center justify-between gap-2">
            <label className="text-[var(--label)] text-sm min-w-fit">
              :کد کلاس
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-big-stone-900)] font-semibold text-base">
                {classCode}
              </span>
              <Copy
                size={20}
                className={`cursor-pointer ${isCopying ? "animate-pulse" : ""}`}
                style={{ fill: "#495d72" }}
                variant="Bulk"
                aria-label="کپی کد کلاس"
                onClick={() => {
                  setIsCopying(true);
                  handleCopy(classCode);
                  setTimeout(() => setIsCopying(false), 500);
                }}
              />
            </div>
          </div>

          {/* رمز ورود به کلاس */}
          <div className="flex flex-row-reverse items-center justify-between gap-2">
            <label className="text-[var(--label)] text-sm min-w-fit">
              :رمز ورود به کلاس
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[var(--color-big-stone-900)] font-semibold text-base">
                {classPassword}
              </span>
              <Copy
                size={20}
                className={`cursor-pointer ${isCopying ? "animate-pulse" : ""}`}
                style={{ fill: "#495d72" }}
                variant="Bulk"
                aria-label="کپی رمز ورود"
                onClick={() => {
                  setIsCopying(true);
                  handleCopy(classPassword);
                  setTimeout(() => setIsCopying(false), 500);
                }}
              />
            </div>
          </div>
        </div>

        {/* دکمه کپی همه */}
        <button
          onClick={handleCopyAll}
          className="w-full py-2 mt-4 bg-[var(--color-big-stone-950)] text-[var(--white)] rounded-lg hover:bg-[var(--color-big-stone-900)] transition-all duration-200"
        >
          کپی همه
        </button>
      </div>
    </div>
  );
}

export default ShareClassCode;