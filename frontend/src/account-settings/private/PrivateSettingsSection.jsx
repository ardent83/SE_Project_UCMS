import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import { Edit } from "iconsax-react";
import DropdownSection from '../components/DropdownSection';
import usePrivateSettings from './hooks/usePrivateSettings';
import Alert from "../../components/Alert";


function PrivateSettingsSection({
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  userData,
  universities,
  educationLevels,
  instructorRanks
}) {
  const { formik, apiError } = usePrivateSettings({
    initialUserData: userData,
    onSaveSuccess: onSave
  });

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
    formik.resetForm({ values: formik.initialValues });
    formik.handleReset();
    onCancel();
  };

  const userRole = userData?.role?.id;
  const isFormDisabled = !isEditing || formik.isSubmitting;

  return (
    <DropdownSection title="اطلاعات خصوصی" bgColor={"#495D72"} isEditing={isEditing}>
      <form onSubmit={formik.handleSubmit} className="flex justify-center items-start py-4">
        <div className="w-full max-w-20 h-10 flex justify-center items-start">
          {!isEditing && !formik.isSubmitting && (
            <Button
              leftIcon={false}
              rightIconComponent={<Edit />}
              size="forty"
              style="none"
              onClick={onEditToggle}
              disabled={isEditing || formik.isSubmitting}
              type="button"
            />
          )}
        </div>
        <div className="w-full flex flex-row-reverse flex-wrap justify-between items-start max-[1192px]:justify-center gap-y-4">
          {userRole === 2 ? (
            <>
              <Input
                form={formik}
                field={formik.getFieldProps("studentNumber")}
                label="شماره دانشجویی"
                value={formik.values.studentNumber}
                disabled={isFormDisabled}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("major")}
                label="رشته تحصیلی"
                value={formik.values.major}
                disabled={isFormDisabled}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("enrollmentYear")}
                label="سال ورود"
                value={formik.values.enrollmentYear}
                disabled={isFormDisabled}
                type="number"
              />
              <Dropdown
                form={formik}
                field={formik.getFieldProps("university")}
                label="دانشگاه محل تحصیل"
                options={universities}
                disabled={isFormDisabled}
              />
              <Dropdown
                form={formik}
                field={formik.getFieldProps("educationLevel")}
                label="مقطع تحصیلی"
                options={educationLevels}
                disabled={isFormDisabled}
              />
            </>
          ) : userRole === 1 ? (
            <>
              <Input
                form={formik}
                field={formik.getFieldProps("employeeCode")}
                label="کد پرسنلی"
                value={formik.values.employeeCode}
                disabled={isFormDisabled}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("department")}
                label="دانشکده"
                value={formik.values.department}
                disabled={isFormDisabled}
              />
              <Dropdown
                form={formik}
                field={formik.getFieldProps("university")}
                label="دانشگاه"
                options={universities}
                disabled={isFormDisabled}
              />
              <Dropdown
                form={formik}
                field={formik.getFieldProps("rank")}
                label="رتبه استاد"
                options={instructorRanks}
                disabled={isFormDisabled}
              />
            </>
          ) : (
            <div className="w-full text-center text-red-500">نقش کاربری نامشخص است.</div>
          )}

          {isEditing && (
            <div className="w-full flex justify-start items-center self-start gap-4">
              <Button
                buttonText="ثبت"
                leftIcon={false}
                rightIcon={false}
                size="forty"
                className={"!h-8"}
                type="submit"
                disabled={formik.isSubmitting}
              />
              <Button
                buttonText="انصراف"
                leftIcon={false}
                rightIcon={false}
                size="forty"
                className={"!h-8"}
                onClick={handleCancelClick}
                type="button"
                disabled={formik.isSubmitting}
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

export default PrivateSettingsSection;
