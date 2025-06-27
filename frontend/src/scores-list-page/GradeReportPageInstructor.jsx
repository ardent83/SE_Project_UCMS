import React from "react";
import { DirectboxNotif } from "iconsax-react";
import SearchBox from "./components/SearchBox.jsx";
import Button from "../components/Button.jsx";
import Alert from "../components/Alert.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { useInstructorGradesData } from "./hooks/useInstructorGradesData";
import { formatToPersianNumber } from "./utils/formatters";
import { useParams } from "react-router-dom";

export default function GradeReportPageInstructor() {
  const { classId } = useParams();
  const { user } = useAuth();
  const userRole = user?.role?.name || "guest";

  const {
    studentsGradesData,
    classEntries,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    handleSaveEntries,
    editedEntries,
    isSavingEntries,
    entrySaveError,
    setEditedEntries,
    totalScore,
    saveSuccess,
    downloadScoresExport,
  } = useInstructorGradesData(classId);

  const [alertMessage, setAlertMessage] = React.useState("");
  const [alertType, setAlertType] = React.useState("info");

  const handleEntryChange = React.useCallback(
    (entryType, entryId, field, value) => {
      const key = `${entryType}-${entryId}`;
      setEditedEntries((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          entryType,
          entryId,
          [field]: value === "" ? "" : Number(value),
        },
      }));
    },
    [setEditedEntries]
  );

  React.useEffect(() => {
    if (entrySaveError) {
      setAlertMessage(entrySaveError);
      setAlertType("error");
    }
  }, [entrySaveError]);

  React.useEffect(() => {
    if (saveSuccess) {
      setAlertMessage("ذخیره با موفقیت انجام شد.");
      setAlertType("success");
    }
  }, [saveSuccess]);

  return (
    <>
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          duration={4000}
          onClose={() => setAlertMessage("")}
        />
      )}

      {loading ? (
        <div className="text-center py-6 text-gray-400">در حال بارگذاری...</div>
      ) : error ? (
        <div className="text-center py-6 text-red-500">{error}</div>
      ) : (
        <>
          {classEntries.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center">
              <img
                src="/Animation - 1750148058142.gif"
                alt="No results"
                className="w-80 h-80 mb-6"
              />
              <p className="text-gray-600 mb-4 font-bold text-lg">
                هنوز ریز نمراتی برای این درس تعیین نشده است.
              </p>
            </div>
          ) : (
            <>
              <div className="bg-white p-7 rounded-xl shadow-xl mb-12 overflow-x-auto border border-gray-100">
                <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                  جزئیات ریز نمرات
                </h3>

                <table
                  className="min-w-full border-collapse text-center"
                  dir="rtl"
                >
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b border-gray-300 text-gray-700 text-sm font-semibold bg-gray-50">
                      <th className="py-3 px-4 border-l border-gray-200"></th>
                      {classEntries.map((entry) => (
                        <th
                          key={`${entry.entryType}-${entry.entryId}`}
                          className="py-3 px-4 border-l border-gray-200"
                        >
                          {entry.entryName}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    <tr className="font-semibold text-gray-800">
                      <td className="py-3 px-4 whitespace-nowrap border-l border-gray-100">
                        نمره تعیین شده
                      </td>
                      {classEntries.map((entry) => {
                        const key = `${entry.entryType}-${entry.entryId}`;
                        const currentValue =
                          editedEntries[key]?.partialScore ??
                          entry.partialScore ??
                          "";
                        return (
                          <td
                            key={key}
                            className="py-3 px-4 text-gray-700 border-l border-gray-100"
                          >
                            {formatToPersianNumber(currentValue)}
                          </td>
                        );
                      })}
                    </tr>

                    <tr className="bg-gray-50 font-semibold text-gray-800">
                      <td className="py-3 px-4 whitespace-nowrap border-l border-gray-100">
                        سهم در نمره نهایی
                      </td>
                      {classEntries.map((entry) => {
                        const key = `${entry.entryType}-${entry.entryId}`;
                        const currentValue =
                          editedEntries[key]?.portionInTotalScore ??
                          entry.portionInTotalScore ??
                          "";
                        return (
                          <td
                            key={key}
                            className="py-3 px-4 text-gray-700 border-l border-gray-100"
                          >
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={formatToPersianNumber(currentValue)}
                              onChange={(e) =>
                                handleEntryChange(
                                  entry.entryType,
                                  entry.entryId,
                                  "portionInTotalScore",
                                  e.target.value
                                )
                              }
                              className="w-17 px-2 py-1 text-center text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-blue-50 focus:bg-white"
                              placeholder="سهم"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>

                <div className="flex justify-end mt-6 items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="totalScoreInput"
                      className="text-sm text-gray-700"
                    >
                      نمره نهایی کل:
                    </label>
                    <input
                      id="totalScoreInput"
                      type="number"
                      min="0"
                      max="1000"
                      value={
                        editedEntries.totalScore !== undefined
                          ? formatToPersianNumber(editedEntries.totalScore)
                          : formatToPersianNumber(totalScore)
                      }
                      onChange={(e) =>
                        setEditedEntries((prev) => ({
                          ...prev,
                          totalScore: Number(e.target.value),
                        }))
                      }
                      className="w-24 px-2 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <Button
                      leftIcon={false}
                      rightIcon={false}
                      buttonText={
                        isSavingEntries
                          ? "در حال ذخیره..."
                          : "ذخیره جزئیات نمره‌دهی"
                      }
                      onClick={handleSaveEntries}
                      disabled={isSavingEntries}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Students Grades Table */}
              <div
                className="bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100 mt-12"
                dir="ltr"
              >
                <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                  گزارش نمرات دانشجویان
                </h3>

                <div
                  className="flex flex-wrap justify-between items-center mb-12 gap-6 relative z-20 px-5"
                  dir="rtl"
                >
                  <SearchBox
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جست‌وجو نام دانشجو، نام خانوادگی و شماره دانشجویی"
                  />
                  <div className="flex gap-4 relative z-20">
                    <Button
                      leftIcon={false}
                      buttonText={"دریافت گزارش"}
                      onClick={downloadScoresExport}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-auto border border-gray-300 shadow-sm"
                      rightIconComponent={
                        <DirectboxNotif
                          size="30"
                          variant="Bold"
                          color="#ffffff"
                        />
                      }
                    />
                  </div>
                </div>

                <div className="overflow-y-auto max-h-[380px] relative z-10">
                  <table
                    className="w-full border-collapse text-center"
                    dir="rtl"
                  >
                    <thead className="sticky top-0 bg-white z-10">
                      <tr className="border-b border-gray-300 text-gray-400 text-sm">
                        <th className="py-3 px-4">نام خانوادگی و نام</th>
                        <th className="py-3 px-4">شماره دانشجویی</th>
                        {classEntries.map((entry) => (
                          <th
                            key={`${entry.entryType}-${entry.entryId}`}
                            className="py-3 px-4"
                          >
                            {entry.entryName}
                          </th>
                        ))}
                        <th className="py-3 px-4">نهایی</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsGradesData.length > 0 ? (
                        studentsGradesData.map((student) => (
                          <tr
                            key={student.studentId}
                            className="border-b border-gray-100 hover:bg-gray-100 transition"
                          >
                            <td className="py-3 px-4 text-gray-700">
                              {student.fullName}
                            </td>
                            <td className="py-3 px-4 font-medium text-gray-900">
                              {formatToPersianNumber(student.studentNumber)}
                            </td>
                            {classEntries.map((entry) => {
                              const key = `${entry.entryType}-${entry.entryId}`;
                              const score = student.scoresByEntry?.[key];
                              return (
                                <td key={key} className="py-3 px-4">
                                  {formatToPersianNumber(
                                    score !== undefined && score !== null
                                      ? score
                                      : ""
                                  )}
                                </td>
                              );
                            })}
                            <td className="py-3 px-4 font-bold text-blue-700">
                              {formatToPersianNumber(student.total)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={classEntries.length + 3}
                            className="text-center py-8 text-gray-500 text-lg"
                          >
                            <p className="text-gray-600 mb-4 font-bold text-lg">
                              نتیجه‌ای یافت نشد!
                            </p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}
