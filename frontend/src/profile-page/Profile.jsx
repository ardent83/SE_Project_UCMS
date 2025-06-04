import React, { useEffect, useState } from 'react';
import { handleViewProfileForInstructor, handleViewProfileForStudent } from './utils/ProfileApi.js';
import { useAuth } from "../auth/context/AuthContext.jsx";

function ProfilePage() {
    const { user } = useAuth();
    const userRole = user?.data?.role?.name || "guest";
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = userRole === "Student"
                    ? await handleViewProfileForStudent()
                    : await handleViewProfileForInstructor();
                setProfile(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchProfile();
    }, []);

    if (error) return <p className="text-black-500 text-center mt-10">{error}</p>;
    if (!profile) return <p className="text-center mt-10 text-gray-600">در حال بارگذاری...</p>;

    const fullName = `${profile.firstName?.trim() || ''} ${profile.lastName?.trim() || ''}`;
    const username = profile.username || '-';
    const bio = profile.bio || 'بیوگرافی ثبت نشده است';
    const role = profile.role?.name || '-';
    const profileImage = profile.profileImagePath;

    return (
        <div className="w-full max-w-[1000px] max-h-[700px] px-6 py-10 flex flex-col gap-6 text-right mx-auto">
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200">
                <div
                    className="relative h-40 bg-cover bg-center rounded-t-2xl"
                    style={{ backgroundImage: "url('/profile-background.png')" }}
                >
                    <div className="absolute -bottom-25 right-30">
                        <img
                            src={profileImage}
                            alt="avatar"
                            className="w-45 h-45 rounded-full border-5 border-white shadow-md object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-22 right-80 space-y-2 text-center">
                        <h2 className="text-blue-950 text-2xl font-bold">{fullName}</h2>
                        <p className="text-blue-950 font-medium text-m">{username}</p>
                    </div>
                </div>

                <div className="pt-30 pb-20 px-6 md:px-16 grid grid-cols-1 md:grid-cols-[1fr_1px_300px] gap-6 rtl text-right">
                    <div className="text-sm text-gray-700 leading-6 pt-10">
                        <h3 className="text-blue-950 text-xl font-medium mb-6">درباره من</h3>
                        <p>{bio}</p>
                    </div>

                    <div className="bg-gray-300 w-[1px] mx-auto hidden md:block ml-5 mt-10" />

                    <div className="space-y-2 text-center">
                        <ul className="text-m leading-7 mt-10 ml-6 space-y-5 text-gray-700">
                            <li>{role}</li>

                            {userRole === "Student" && (
                                <>
                                    <li>{profile.educationLevel || "-"}</li>
                                    <li>{profile.enrollmentYear || "-"}</li>
                                    <li>{profile.major || "-"}</li>
                                    <li>{profile.university || "-"}</li>
                                </>
                            )}

                            {userRole === "Instructor" && (
                                <>
                                    <li>{profile.rank || "-"}</li>
                                    <li>{profile.department || "-"}</li>
                                    <li>{profile.university || "-"}</li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;
