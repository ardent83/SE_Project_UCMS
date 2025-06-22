import React, { useState, useRef, useEffect } from "react";
import { Camera, GalleryTick, CloseCircle, Trash } from "iconsax-react";
import Alert from "../../components/Alert";
import { uploadProfileImage, deleteProfileImage } from "./utils/profileApi";

const MAX_FILE_SIZE_MB = 2;

const PROFILE_IMAGE_SIZE = 200;
const PROFILE_IMAGE_BORDER = 12;
const ICON_SIZE = 40;
const ICON_RADIUS = ICON_SIZE / 2;

const CENTER_X = ((PROFILE_IMAGE_SIZE + PROFILE_IMAGE_BORDER) / 2);
const CENTER_Y = ((PROFILE_IMAGE_SIZE + PROFILE_IMAGE_BORDER) / 2);

const PLACEMENT_RADIUS = 100;

const ANGLES = {
  camera: 130,
  cancel: 130,
  confirm: 105,
  loading: 130,
  trash_hover: 105,
  trash_default: 130
};

const getIconPositionStyle = (angleDegrees) => {
  const angleRadians = angleDegrees * Math.PI / 180;
  const iconCenterX = CENTER_X + PLACEMENT_RADIUS * Math.cos(angleRadians);
  const iconCenterY = CENTER_Y + PLACEMENT_RADIUS * Math.sin(angleRadians);
  const cssLeft = iconCenterX - ICON_RADIUS;
  const cssTop = iconCenterY - ICON_RADIUS;
  return {
    top: `${cssTop}px`,
    left: `${cssLeft}px`,
  };
};

export default function ProfileImageUploader({ initialImagePath, gender, onImageUploadSuccess, onImageUploadError }) {
  const defaultImageUrl = gender === 0 ? '/man.jpg' : '/woman.png';
  const [currentImageUrl, setCurrentImageUrl] = useState(initialImagePath || defaultImageUrl);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPendingConfirmation, setIsPendingConfirmation] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!initialImagePath) {
      setCurrentImageUrl(gender === 0 ? '/man.jpg' : '/woman.png');
    } else {
      setCurrentImageUrl(initialImagePath);
    }
  }, [gender, initialImagePath]);

  const handleIconClick = () => {
    if (isPendingConfirmation || isUploading || isDeleting) return;
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    setError(null);
    const file = event.target.files[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setError(`!حجم فایل بیشتر از ${MAX_FILE_SIZE_MB} مگابایت است`);
        setSelectedFile(null);
        event.target.value = null;
        return;
      }

      setSelectedFile(file);
      setIsPendingConfirmation(true);
      setIsConfirmingDelete(false);
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentImageUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setCurrentImageUrl(initialImagePath || defaultImageUrl);
      setIsPendingConfirmation(false);
      setIsConfirmingDelete(false);
    }
    event.target.value = null;
  };

  const handleCancel = () => {
    setError(null);
    setIsPendingConfirmation(false);
    setIsConfirmingDelete(false);
    if (selectedFile) {
      setSelectedFile(null);
      setCurrentImageUrl(initialImagePath || (gender === 0 ? '/man.jpg' : '/woman.png'));
    }
  };

  const handleConfirm = async () => {
    if (isConfirmingDelete) {
      await handleConfirmDelete();
    } else if (selectedFile) {
      await handleConfirmUpload();
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile || isUploading) return;

    setError(null);
    setIsUploading(true);
    setIsPendingConfirmation(false);

    try {
      await uploadProfileImage(selectedFile);
      setSelectedFile(null);
      setIsUploading(false);
      onImageUploadSuccess?.(currentImageUrl);
    } catch (err) {
      setError(err.message || "!خطایی در آپلود تصویر رخ داد");
      setIsUploading(false);
      setCurrentImageUrl(initialImagePath || defaultImageUrl);
      setSelectedFile(null);
      onImageUploadError?.(err.message || "!خطایی رخ داد");
    }
  };

  const initiateDelete = () => {
    if (isUploading || isDeleting || selectedFile || isPendingConfirmation) return;
    setError(null);
    setIsPendingConfirmation(true);
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = async () => {
    if (isDeleting) return;

    setError(null);
    setIsDeleting(true);
    setIsPendingConfirmation(false);
    setIsConfirmingDelete(false);

    try {
      await deleteProfileImage();
      setIsDeleting(false);
      setCurrentImageUrl(defaultImageUrl);
      setSelectedFile(null);
      onImageUploadSuccess?.(null);
    } catch (err) {
      setError(err.message || "!خطایی در حذف تصویر رخ داد");
      setIsDeleting(false);
      onImageUploadError?.(err.message || "!خطایی رخ داد");
    }
  };

  const renderIcons = () => {
    if (isUploading) {
      return (
        <div
          className="absolute bg-blue-500 w-10 h-10 z-10 rounded-full flex justify-center items-center animate-spin"
          title="در حال آپلود..."
          style={getIconPositionStyle(ANGLES.loading)}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (isDeleting) {
      return (
        <div
          className="absolute bg-blue-500 w-10 h-10 z-10 rounded-full flex justify-center items-center animate-spin"
          title="در حال حذف..."
          style={getIconPositionStyle(ANGLES.loading)}
        >
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
        </div>
      );
    }

    if (isPendingConfirmation) {
      return (
        <>
          <div
            className="absolute bg-stateerror-light w-10 h-10 z-10 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out"
            onClick={handleCancel}
            title={isConfirmingDelete ? "انصراف از حذف" : "لغو تغییرات"}
            style={getIconPositionStyle(ANGLES.cancel)}
            data-testid="cancel-image-profile"
          >
            <CloseCircle color="#ffffff" size={24} />
          </div>
          <div
            className={
              `absolute w-10 h-10 z-10 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out ` +
              (isConfirmingDelete ? 'bg-stateerror' : 'bg-statesuccess')
            }
            onClick={handleConfirm}
            title={isConfirmingDelete ? "تایید حذف تصویر" : "تایید تغییرات"}
            style={getIconPositionStyle(ANGLES.confirm)}
            data-testid="confirm-image-profile"
          >
            {isConfirmingDelete ? <Trash color="#ffffff" size={24} /> : <GalleryTick color="#ffffff" size={24} />}
          </div>
        </>
      );
    }

    return (
      <>
        <div
          className="absolute bg-redp w-10 h-10 z-10 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out"
          onClick={handleIconClick}
          title="تغییر تصویر پروفایل"
          style={getIconPositionStyle(ANGLES.camera)}
          data-testid="change-profile-image"
        >
          <Camera color="#ffffff" size={24} />
        </div>
        {currentImageUrl !== defaultImageUrl && (
          <div
            className={`absolute bg-stateerror w-10 h-10 z-9 rounded-full flex justify-center items-center cursor-pointer transition-all duration-300 ease-in-out`}
            style={getIconPositionStyle(isHovered ? ANGLES.trash_hover : ANGLES.trash_default)}
            onClick={initiateDelete}
            title="حذف تصویر پروفایل"
            data-testid="delete-profile-image"
          >
            <Trash color="#ffffff" size={24} />
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="relative w-50 h-50"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="profile-img w-full h-full rounded-full border-[12px] border-solid border-neutralgray-4"
        style={{ "--bg": `url(${currentImageUrl})` }}
      />

      {renderIcons()}

      <input
        type="file"
        className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer z-5 rounded-full"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        disabled={isUploading || isDeleting || isPendingConfirmation}
        data-testid="profile-input-file"
      />

      {error && (
        <div className="absolute top-[13.5rem] right-0 left-0 text-center w-full">
          <Alert type="error" message={error} onClose={() => setTimeout(() => { setError(null) }, 0)} />
        </div>
      )}
    </div>
  );
}
