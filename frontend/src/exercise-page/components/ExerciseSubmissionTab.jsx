import React, { useState } from "react";

export default function ExerciseSubmissionsTab({
  submissions,
  onDownload,
  onFinalToggle,
  sortBy,
  sortOrder,
  onSortClick,
  renderSortIcon,
  formatPersianDate,
  formatPersianTime,
  exerciseScore,
}) {
  const [selectedId, setSelectedId] = useState(null);

  const handleCheckboxChange = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  if (!submissions || submissions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        هنوز پاسخی ارسال نکرده‌اید.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-center border-collapse text-sm" dir="ltr">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2">فایل</th>
            <th className="px-4 py-2">نمره</th>
            <th className="px-4 py-2">نوع فایل</th>
            <th
              className="px-4 py-2 cursor-pointer select-none"
              onClick={() => onSortClick(1)}
            >
              <div className="flex items-center justify-center">
                تاریخ و ساعت ارسال
                {renderSortIcon()}
              </div>
            </th>
            <th className="px-4 py-2">ارسال نهایی</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr
              key={submission.id}
              className={`border-b border-gray-100 transition ${
                selectedId === submission.id ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
            >
              <td className="py-3 px-4">
                <button
                  className="text-big-stone-400 hover:text-big-stone-600 text-[1rem] cursor-pointer"
                  onClick={() =>
                    onDownload(
                      submission.id,
                      `submission_${submission.id}.${submission.fileType}`
                    )
                  }
                >
                  دانلود
                </button>
              </td>
              <td className="py-3 px-4">
                {submission.grade != null ? (
                  <span className="text-green-700 font-semibold">
                    {submission.grade}
                    {exerciseScore && ` از ${exerciseScore}`}
                  </span>
                ) : (
                  <span className="text-gray-400">ثبت نشده</span>
                )}
              </td>
              <td className="py-3 px-4 text-gray-700">
                {submission.fileType || "نامشخص"}
              </td>
              <td className="py-3 px-4" dir="rtl">
                {formatPersianDate(submission.submittedAt)} -{" "}
                {formatPersianTime(submission.submittedAt)}
              </td>
              <td className="py-3 px-4 flex justify-center items-center">
                <label className="inline-flex items-center cursor-pointer flex-row-reverse gap-1">
                  <input
                    type="checkbox"
                    className="form-checkbox h-5 w-5 text-blue-600 rounded"
                    checked={submission.isFinal}
                    onChange={(e) =>
                      onFinalToggle(submission.id, e.target.checked)
                    }
                    disabled={submission.grade != null}
                    aria-label="ارسال نهایی"
                  />
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
