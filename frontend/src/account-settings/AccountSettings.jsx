import React, { useState, useEffect } from "react";

import ProfileImageUploader from './avatar/ProfileImageUploader'
import GeneralSettingsSection from "./general/GeneralSettingsSection";
import PrivateSettingsSection from "./private/PrivateSettingsSection";
import ChangePasswordSection from "./password/ChangePasswordSection";
import Alert from "../components/Alert";
import { fetchUserProfile, fetchInstructorSpecializedInfo, fetchStudentSpecializedInfo } from './utils/accountSettingsApi';

export default function AccountSettings() {
  const [editingSection, setEditingSection] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCombinedUserData = async () => {
      try {
        const generalData = await fetchUserProfile();

        const roleId = generalData.role?.id;
        let specializedData = {};

        if (roleId === 1) {
          const instructorData = await fetchInstructorSpecializedInfo();
            specializedData = {
              ...instructorData,
            };
        } else if (roleId === 2) {
          const studentData = await fetchStudentSpecializedInfo();
          specializedData = {
            ...studentData,
          }
        }
        const combinedUserData = {
          ...generalData,
          ...specializedData,
          gender: (generalData.gender === "Male" ? 0 : 1),
        };

        setUserData(combinedUserData);

      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError(err.message || 'خطا در بارگیری اطلاعات کاربر.');
        showGlobalAlert('error', 'خطا در بارگیری اطلاعات کاربر.');
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedUserData();
  }, []);


  const [globalAlert, setGlobalAlert] = useState(null);

  const showGlobalAlert = (type, message) => {
    setGlobalAlert({ type, message });
  };

  const handleCloseGlobalAlert = () => {
    setGlobalAlert(null);
  };

  const handleEditToggle = (section) => {
    if (editingSection && editingSection !== section) {
      showGlobalAlert('error', 'لطفاً تغییرات بخش فعلی را ذخیره یا لغو کنید.');
      return;
    }
    setEditingSection(editingSection === section ? null : section);
  };

  const handleSectionSaveSuccess = (section, updatedData = null) => {
    console.log(`Section ${section} saved successfully.`);
    if (updatedData) {
      setUserData(prevUserData => ({ ...prevUserData, ...updatedData }));
    }

    setEditingSection(null);
    showGlobalAlert('success', `بخش ${section} با موفقیت ذخیره شد.`);
  };

  const handleSectionCancel = (section) => {
    console.log(`Section ${section} cancelled.`);
    setEditingSection(null);
  };

  const handleImageUploadSuccess = (newImageUrl) => {
    setUserData(prevUserData => ({ ...prevUserData, profileImagePath: newImageUrl }));
    showGlobalAlert('success', 'تصویر پروفایل با موفقیت به‌روز شد.');
  };

  const handleImageUploadError = (errorMessage) => {
    showGlobalAlert('error', errorMessage);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || !userData) {
    return <div>Error loading user data: {error}</div>;
  }


  return (
    <div className="w-full max-w-270 p-6 ">
      <div className="w-full flex flex-col items-center" style={{ '--max-w-rmdp': "23rem" }}>
        <div className="w-full flex justify-end items-center gap-[2.69rem] px-10 pb-10 border-b border-[#CED8E5F8]">
          <div className="flex flex-col justify-center items-end">
            <span className="text-heading-h4 text-redp">{userData.firstName + " " + userData.lastName}</span>
            <span className="text-body-01 text-redp">
              {userData.role?.id === 2 ? "دانشجو" : "استاد"}
            </span>
            <span className="text-body-01 text-redp">
              {userData.university}
            </span>
          </div>
          <ProfileImageUploader
            initialImagePath={userData.profileImagePath}
            gender={userData.gender}
            onImageUploadSuccess={handleImageUploadSuccess}
            onImageUploadError={handleImageUploadError}
          />
        </div>

        <GeneralSettingsSection
          isEditing={editingSection === 'general'}
          onEditToggle={() => handleEditToggle('general')}
          onSave={(updatedValues) => handleSectionSaveSuccess('general', updatedValues)}
          onCancel={() => handleSectionCancel('general')}
          userData={userData}
        />

        <PrivateSettingsSection
          isEditing={editingSection === 'private'}
          onEditToggle={() => handleEditToggle('private')}
          onSave={(updatedValues) => handleSectionSaveSuccess('private', updatedValues)}
          onCancel={() => handleSectionCancel('private')}
          userData={userData}
        />

        <ChangePasswordSection
          isEditing={editingSection === 'password'}
          onEditToggle={() => handleEditToggle('password')}
          onSave={() => {
            showGlobalAlert('success', 'رمز عبور با موفقیت تغییر کرد.');
            setEditingSection(null);
          }}
          onCancel={() => handleSectionCancel('password')}
        />

        {globalAlert && (
          <Alert type={globalAlert.type} message={globalAlert.message} onClose={handleCloseGlobalAlert} />
        )}
      </div>
    </div>
  );
}
