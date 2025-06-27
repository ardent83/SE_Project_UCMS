import React, { useCallback, useEffect, useState } from "react";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {
    Calendar,
    Edit2,
    Trash,
    Information,
    PresentionChart,
    DirectboxNotif,
} from "iconsax-react";

import PhaseSubmitTab from "./components/Tabs/PhaseSubmitTab.jsx";
import PhaseSubmissionsTab from "./components/Tabs/PhaseSubmissionTab.jsx";
import DropdownSection from "./components/DropdownSection.jsx";
import GradeSection from "./components/UploadGradeDropdown.jsx";
import GradeForm from "./components/GradeFormPop.jsx";
import Modal from "../components/Modal.jsx";
import DeleteConfirmModalContent from "../components/DeleteConfirmPopover.jsx";
import { useAuth } from "../auth/context/AuthContext.jsx";
import { getStudentsOfTeam,setScoreForEachStudent } from "./utils/PhaseSubmissionForInstructorApi.js";
import {
    getPhaseInformationForInstructor,
    getPhaseInformationForStudent,
    downloadPhaseFileApi,
    deletePhaseApi
} from "./utils/PhasePageApi.js";
import {
    fetchPhaseSubmissionsApi,
} from "./utils/PhaseSubmissionForStudentApi.js";
import SubmissionTable from "./components/SubmissionTableDropdown.jsx";
import {downloadAllSubmissionFilesApi} from "./utils/PhaseSubmissionForInstructorApi.js";

const PhasePage = () => {
    const { user } = useAuth();
    const userRole = user?.role?.name || "guest";
    const { phaseId } = useParams();
    const numericPhaseId = parseInt(phaseId, 10);
    const projectId = sessionStorage.getItem("projectId");
    const [phaseInfo, setPhaseInfo] = useState(null);
    const [activeTab, setActiveTab] = useState("ارسال پاسخ");
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [grades, setGrades] = useState({});
    const [submittedGroups, setSubmittedGroups] = useState({});
    const [phaseSubmissions, setPhaseSubmissions] = useState([]);
    const [readOnly, setReadOnly] = useState(false);
    const [error, setError] = useState("");
    const [submissionsError, setSubmissionsError] = useState(null);
    const [loadingSubmissions, setLoadingSubmissions] = useState(false);
    const [showDeletePhaseModal, setShowDeletePhaseModal] = useState(false);
    const [groupMembers, setGroupMembers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPhase = async () => {
            try {
                const data =
                    userRole === "Student"
                        ? await getPhaseInformationForStudent(numericPhaseId)
                        : await getPhaseInformationForInstructor(numericPhaseId);
                setPhaseInfo(data);
            } catch (err) {
                setError(err.message);
            }
        };

        if (!isNaN(numericPhaseId)) {
            fetchPhase();
        }
    }, [numericPhaseId, userRole]);

    useEffect(() => {
        const fetchSubmissions = async () => {
            if (!numericPhaseId) return;

            setLoadingSubmissions(true);
            setSubmissionsError(null);

            try {
                const result = await fetchPhaseSubmissionsApi(numericPhaseId, userRole);
                setPhaseSubmissions(result.items);
                const submittedGroupsData = {};
                result.items.forEach((item) => {
                    submittedGroupsData[item.id] = {
                        submitted: item.score !== null,
                        grades: {},
                        score: item.score,
                    };
                });
                setSubmittedGroups(submittedGroupsData);
            } catch (err) {
                setSubmissionsError(err.message);
            } finally {
                setLoadingSubmissions(false);
            }
        };

        fetchSubmissions();
    }, [numericPhaseId, userRole]);

    const handleOpenGradeForm = async (groupId) => {
        setSelectedGroup(groupId);
        setReadOnly(false);
        setError("");

        try {
            if (!groupMembers[groupId]) {
                const result = await getStudentsOfTeam(phaseId, groupId);

                const fetchedMembers = result.data.map((student) => ({
                    id: student.id,
                    studentNumber: student.studentNumber,
                    firstName: student.studentName.split(" ")[1] || "",
                    lastName: student.studentName.split(" ")[0] || "",
                    score: student.score,
                }));

                setGroupMembers((prev) => ({ ...prev, [groupId]: fetchedMembers }));

                const initialGrades = {};
                fetchedMembers.forEach((member) => {
                    initialGrades[member.id] = grades[member.id] !== undefined ? grades[member.id] : member.score;
                });
                setGrades(initialGrades);
            } else {
                const existingMembers = groupMembers[groupId];
                const existingGrades = {};
                existingMembers.forEach((member) => {
                    existingGrades[member.id] = grades[member.id] !== undefined ? grades[member.id] : member.score;
                });
                setGrades(existingGrades);
            }

            const existing = submittedGroups[groupId];
            setReadOnly(!!existing?.submitted);
        } catch (err) {
            setError("خطا در دریافت اعضای گروه");
        }
    };

    const handleGradeChange = (memberId, value) => {
        setGrades((prev) => ({ ...prev, [memberId]: value }));
    };

    const handleSubmitGrades = async () => {
        const members = groupMembers[selectedGroup] || [];
        const allGraded = members.every(
            (member) => grades[member.id] !== undefined && grades[member.id] !== ""
        );

        if (!allGraded) {
            setError("لطفاً برای همه اعضا نمره وارد کنید.");
            return;
        }

        setError("");

        try {
            for (const member of members) {
                const score = Number(grades[member.id]);
                if (isNaN(score)) {
                    throw new Error(`نمره ${member.id} معتبر نیست.`);
                }
                const response = await setScoreForEachStudent(member.id, score);
                if (!response.success) {
                    throw new Error(response.message || "خطا در ثبت نمره.");
                }
            }
            setGroupMembers((prev) => {
                const updatedMembers = prev[selectedGroup].map((member) => ({
                    ...member,
                    score: grades[member.id] !== undefined ? Number(grades[member.id]) : member.score,
                }));
                return {
                    ...prev,
                    [selectedGroup]: updatedMembers,
                };
            });

            setGrades((prevGrades) => {
                const updatedGrades = { ...prevGrades };
                members.forEach((member) => {
                    updatedGrades[member.id] = Number(grades[member.id]);
                });
                return updatedGrades;
            });

            setSubmittedGroups((prev) => ({
                ...prev,
                [selectedGroup]: { grades, submitted: true },
            }));

            setSelectedGroup(null);
            setReadOnly(false);
            setError("");
        } catch (err) {
            setError(err.message || "خطایی در ثبت نمرات رخ داد.");
        }
    };


    const handleCancel = () => {
        setSelectedGroup(null);
        setReadOnly(false);
        setError("");
    };

    const handleDownloadFile = useCallback(async () => {
        let filePath = phaseInfo?.phaseFilePath || "";
        const lastDotIndex = filePath.lastIndexOf(".");
        const extension =
            lastDotIndex !== -1 ? filePath.substring(lastDotIndex + 1) : "";
        try {
            await downloadPhaseFileApi(phaseId, userRole, filePath, phaseInfo?.title);
        } catch (err) {
            console.error("Error downloading file:", err);
            setError("خطایی در دانلود فایل رخ داد!");
        }
    }, [phaseId, userRole, phaseInfo]);

    const handleDownloadAllSubmissionFiles = useCallback(async (phaseId) => {
        try {
            await downloadAllSubmissionFilesApi(phaseId);
        } catch (err) {
            console.error("Error downloading all submission files:", err);
            setError("خطایی در دانلود همه فایل‌های ارسالی رخ داد!");
        }
    }, []);

    const handleDeletePhase = useCallback(async () => {
        try {
            await deletePhaseApi(phaseId);
            console.log(`Phase ${phaseId} deleted successfully.`);
            navigate(`/project/${projectId}`, { state: { message: "پروژه با موفقیت حذف شد." } });
        } catch (err) {
            console.error("Error deleting project:", err);
            setError("خطایی در حذف پروژه رخ داد!");
        } finally {
        }
    }, [phaseId,projectId, navigate]);

    return (
        <div className="w-full max-w-270 p-6" dir="rtl">
            <div className="w-full flex flex-col items-center">
                <div
                    className="w-full flex justify-between items-center px-10 pb-10"
                    dir="rtl"
                >
                    <h2 className="text-3xl text-heading-h4 text-redp font-bold mt-15">
                        {phaseInfo?.title || "در حال بارگذاری..."}
                    </h2>

                    {userRole === "Instructor" && (
                        <div className="flex gap-4 text-gray-600 mt-5">
                            <div
                                title="دانلود فایل"
                                className="cursor-pointer"
                                onClick={handleDownloadFile}
                                data-testid="download-phase-icon"
                            >
                                <DirectboxNotif size="30" variant="Bulk" color="#08146f" />
                            </div>
                            <div title="حذف پروژه" className="cursor-pointer">
                                <Trash
                                    size="30"
                                    variant="Bulk"
                                    color="#08146f"
                                    onClick={() => setShowDeletePhaseModal(true)}
                                    style={{ cursor: "pointer" }}
                                    data-testid="delete-project-icon" // Added data-testid
                                />
                            </div>
                            <div
                                title="ویرایش"
                                className="cursor-pointer"
                                onClick={() => navigate(`/phase/edit/${phaseId}`)}
                                data-testid="edit-phase-icon"
                            >
                                <Edit2 size="30" variant="Bulk" color="#08146f" />
                            </div>
                        </div>
                    )}

                    {userRole === "Student" && (
                        <div className="flex gap-4 text-gray-600 mt-5">
                            <div
                                title="دانلود فایل"
                                className="cursor-pointer"
                                onClick={handleDownloadFile}
                                data-testid="download-phase-icon"
                            >
                                <DirectboxNotif size="30" variant="Bulk" color="#08146f" />
                            </div>
                        </div>
                    )}
                </div>

                {phaseInfo && (
                    <div
                        className={`w-full px-5 pt-4 space-y-4 text-body-01 text-gray-700 mb-5 ${
                            userRole === "Instructor" ? "border-b border-[#CED8E5F8]" : ""
                        }`}
                        dir="rtl"
                    >
                        <div className="text-xl flex items-center gap-2">
                            <Calendar size="25" variant="Linear" color="#495D72" />
                            <span>
                {new Date(phaseInfo.startDate).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}{" "}
                                -{" "}
                                {new Date(phaseInfo.startDate).toLocaleDateString("fa-IR")}
              </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <PresentionChart size="25" variant="Linear" color="#495D72" />
                            <span>
                {new Date(phaseInfo.endDate).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                })}{" "}
                                - {new Date(phaseInfo.endDate).toLocaleDateString("fa-IR")}
              </span>
                        </div>
                        <div className="flex items-start gap-2 mb-6">
                            <Information size="25" variant="Linear" color="#495D72" />
                            <p className="leading-relaxed">
                                {phaseInfo.description
                                    ? phaseInfo.description
                                    : "توضیحی ثبت نشده است."}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {userRole === "Student" && (
                <>
                    <div className="flex gap-1 mb-6 border-b border-gray-200">
                        {["ارسال پاسخ", "ارسال‌ها"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`relative px-5 py-2 rounded-t-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                                    activeTab === tab
                                        ? "bg-big-stone-900 border-x border-t border-gray-200 -mb-px text-white shadow-sm"
                                        : "bg-gray-300 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === "ارسال پاسخ" && <PhaseSubmitTab phaseFormats={phaseInfo?.fileFormats} />}
                    {activeTab === "ارسال‌ها" && (
                        <PhaseSubmissionsTab phaseTitle={phaseInfo?.title} />
                    )}
                </>
            )}

            {userRole === "Instructor" && (
                <div className="w-full mt-8">
                    <DropdownSection title="ارسال‌ها" bgColor="#1E2B4F">
                        {loadingSubmissions ? (
                            <p className="text-white">در حال بارگذاری ارسال‌ها...</p>
                        ) : submissionsError ? (
                            <p className="text-red-500">{submissionsError}</p>
                        ) : (
                            <SubmissionTable
                                submissions={phaseSubmissions}
                                handleOpenGradeForm={handleOpenGradeForm}
                                phaseId={phaseId}
                                handleDownloadAllSubmissionFiles={handleDownloadAllSubmissionFiles}
                            />
                        )}
                    </DropdownSection>

                    <DropdownSection title="ثبت نمره" bgColor="#5C6BC0">
                        <GradeSection phaseId={phaseId} />
                    </DropdownSection>

                    {selectedGroup !== null && (
                        <GradeForm
                            groupId={Number(selectedGroup)}
                            members={groupMembers[Number(selectedGroup)] || []}
                            grades={grades}
                            onChange={handleGradeChange}
                            onSubmit={handleSubmitGrades}
                            onCancel={handleCancel}
                            readOnly={readOnly}
                            error={error}
                        />

                    )}
                </div>
            )}
            <Modal
                show={showDeletePhaseModal}
                onClose={() => setShowDeletePhaseModal(false)}
                data-testid="delete-phase-modal"
            >
                {" "}
                {/* Added data-testid */}
                <DeleteConfirmModalContent
                    onConfirm={() => {
                        handleDeletePhase();
                        setShowDeletePhaseModal(false);
                    }}
                    onCancel={() => setShowDeletePhaseModal(false)}
                    message="آیا از حذف این فاز مطمئن هستید؟"
                    data-testid="delete-phase-confirm-content" // Added data-testid
                />
            </Modal>
        </div>
    );
};

export default PhasePage;
