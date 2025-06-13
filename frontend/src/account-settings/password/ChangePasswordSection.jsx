import React, { useState, useEffect } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Edit } from "iconsax-react";
import DropdownSection from "../components/DropdownSection";
import useChangePassword from "./hooks/useChangePassword";
import Alert from "../../components/Alert";


function ChangePasswordSection({
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
}) {
  const { formik, apiError } = useChangePassword({ onSave });
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    if (apiError) {
      setAlertMessage(apiError);
      setShowAlert(true);
    } else {
      setShowAlert(false);
      setAlertMessage('');
    }
  }, [apiError]);

  const handleCloseAlert = () => {
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
      if (apiError) {
        formik.setStatus({ apiError: null });
      }
    }, 0);
  };



  const handleCancelClick = () => {
    formik.resetForm();
    onCancel();
  };


  return (
    <DropdownSection
      title="تغییر رمز عبور"
      bgColor={"#C0C0C0"}
      isEditing={isEditing}
    >
      <form onSubmit={formik.handleSubmit} className="flex justify-center items-start py-4">
        <div className="w-full max-w-20 h-10 flex justify-center items-start">
          {!isEditing && (
            <Button
              leftIcon={false}
              rightIconComponent={<Edit />}
              size="forty"
              style="none"
              onClick={onEditToggle}
              disabled={isEditing}
              type="button"
            />
          )}
        </div>
        <div className="w-full flex flex-row flex-wrap justify-between max-[1192px]:justify-center items-end gap-y-4">
          <Input
            form={formik}
            field={formik.getFieldProps("newPassword")}
            type="password"
            dir="ltr"
            label="رمز عبور جدید"
            value={formik.values.newPassword}
            disabled={!isEditing}
          />

          <Input
            form={formik}
            field={formik.getFieldProps("oldPassword")}
            label="رمز عبور فعلی"
            type="password"
            dir="ltr"
            value={formik.values.oldPassword}
            disabled={!isEditing}
          />

          <Input
            form={formik}
            field={formik.getFieldProps("confirmNewPassword")}
            label="تکرار رمز جدید"
            type="password"
            dir="ltr"
            value={formik.values.confirmNewPassword}
            disabled={!isEditing}
          />

          {isEditing && (
            <div className="w-full flex justify-start items-center self-start gap-4">
              <Button
                buttonText="ثبت"
                leftIcon={false}
                rightIcon={false}
                size="forty"
                className={"!h-8"}
                type="submit"
              />
              <Button
                buttonText="انصراف"
                leftIcon={false}
                rightIcon={false}
                size="forty"
                className={"!h-8"}
                onClick={handleCancelClick}
                type="button"
              />
            </div>
          )}
        </div>
      </form>
      {showAlert && (
        <Alert type="error" message={alertMessage} onClose={handleCloseAlert} />
      )}
    </DropdownSection>
  );
}

export default ChangePasswordSection;
