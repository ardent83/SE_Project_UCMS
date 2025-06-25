import React from "react";
import { ArrowSwapVertical } from "iconsax-react";
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
    const userRole = user?.data?.role?.name || "guest";

    const {
        studentsGradesData: sortedAndFilteredGrades,
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

    const handlePrintClick = () => {
        console.log("Printing grade report...");
    };

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

            <div className="flex flex-wrap justify-between items-center mb-12 gap-6 relative z-20">
                <SearchBox
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="جست‌وجو نام دانشجو، نام خانوادگی"
                />
                <div className="flex gap-4 relative z-20">
                    <Button
                        leftIcon={false}
                        buttonText={"دریافت گزارش"}
                        onClick={handlePrintClick}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-auto border border-gray-300 shadow-sm"
                        rightIconComponent={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                            >
                                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z" />
                            </svg>
                        }
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-6 text-gray-400">در حال بارگذاری...</div>
            ) : error ? (
                <div className="text-center py-6 text-red-500">{error}</div>
            ) : (
                <>
                    <div className="bg-white p-7 rounded-xl shadow-xl mb-12 overflow-x-auto border border-gray-100">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                            جزئیات ریز نمرات
                        </h3>

                        <table className="min-w-full border-collapse text-center" dir="rtl">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-gray-300 text-gray-400 text-sm">
                                    <th className="py-3 px-4"></th>
                                    {classEntries.map((entry) => (
                                        <th
                                            key={`${entry.entryType}-${entry.entryId}`}
                                            className="py-3 px-4"
                                        >
                                            {entry.entryName}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3 px-4 font-bold text-gray-900">
                                        نمره از {formatToPersianNumber(totalScore)}
                                    </td>
                                    {classEntries.map((entry) => {
                                        const key = `${entry.entryType}-${entry.entryId}`;
                                        const currentValue =
                                            editedEntries[key]?.partialScore ??
                                            entry.partialScore ??
                                            "";
                                        return (
                                            <td key={key} className="py-3 px-4 text-gray-700">
                                                {formatToPersianNumber(currentValue)}
                                            </td>
                                        );
                                    })}
                                </tr>

                                <tr>
                                    <td className="py-3 px-4 font-bold text-gray-900">
                                        سهم در نمره نهایی از ۱۰۰
                                    </td>
                                    {classEntries.map((entry) => {
                                        const key = `${entry.entryType}-${entry.entryId}`;
                                        const currentValue =
                                            editedEntries[key]?.portionInTotalScore ??
                                            entry.portionInTotalScore ??
                                            "";
                                        return (
                                            <td key={key} className="py-3 px-4 text-gray-700">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={currentValue}
                                                    onChange={(e) =>
                                                        handleEntryChange(
                                                            entry.entryType,
                                                            entry.entryId,
                                                            "portionInTotalScore",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20 px-1 py-1 text-center text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                                            ? editedEntries.totalScore
                                            : ""
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
                                        isSavingEntries ? "در حال ذخیره..." : "ذخیره جزئیات نمره‌دهی"
                                    }
                                    onClick={handleSaveEntries}
                                    disabled={isSavingEntries}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors shadow-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Students Grades Table */}
                    <div className="bg-white p-7 rounded-xl shadow-xl overflow-x-auto border border-gray-100 mt-12">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 text-right">
                            گزارش نمرات دانشجویان
                        </h3>
                        <div className="overflow-y-auto max-h-[380px] relative z-10" dir="ltr">
                            <table className="w-full border-collapse text-center">
                                <thead className="sticky top-0 bg-white z-10">
                                    <tr className="border-b border-gray-300 text-gray-400 text-sm">
                                        <th className="py-3 px-4">نهایی</th>
                                        <th className="py-3 px-4">پایان ترم</th>
                                        <th className="py-3 px-4">میان ترم</th>
                                        <th className="py-3 px-4">فاز دوم</th>
                                        <th className="py-3 px-4">فاز اول</th>
                                        <th className="py-3 px-4">کوییز ۳</th>
                                        <th className="py-3 px-4">نام خانوادگی</th>
                                        <th className="py-3 px-4">نام</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedAndFilteredGrades.length > 0 ? (
                                        sortedAndFilteredGrades.map((student) => (
                                            <tr
                                                key={student.id}
                                                className="border-b border-gray-100 hover:bg-gray-100 transition"
                                            >
                                                <td className="py-3 px-4 font-bold text-blue-700">
                                                    {formatToPersianNumber(student.overall)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatToPersianNumber(student.finalTerm)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatToPersianNumber(student.midterm)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatToPersianNumber(student.phase2)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatToPersianNumber(student.phase1)}
                                                </td>
                                                <td className="py-3 px-4">
                                                    {formatToPersianNumber(student.quiz3)}
                                                </td>
                                                <td className="py-3 px-4 text-gray-700">
                                                    {student.lastName}
                                                </td>
                                                <td className="py-3 px-4 font-medium text-gray-900">
                                                    {student.firstName}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan={8}
                                                className="text-center py-8 text-gray-500 text-lg"
                                            >
                                                نتیجه‌ای یافت نشد
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
    );
}
