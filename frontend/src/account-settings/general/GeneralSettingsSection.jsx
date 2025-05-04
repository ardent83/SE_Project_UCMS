import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { Edit } from "iconsax-react";
import MyDatePicker from "../../components/DatePicker";
import TextArea from "../../components/TextArea";
import Selector from "../../components/Selector";
import DropdownSection from '../components/DropdownSection';
import useGeneralSettings from './hooks/useGeneralSettings';
import Alert from "../../components/Alert";

function GeneralSettingsSection({
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  userData
}) {
  const { formik, apiError } = useGeneralSettings({
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
    setShowAlert(false);
    setAlertMessage('');
  };

  const handleCancelClick = () => {
    formik.resetForm({ values: formik.initialValues });
    onCancel();
  };

  return (
    <DropdownSection title="اطلاعات عمومی" isEditing={isEditing} bgColor={"#142840"}>
      <form onSubmit={formik.handleSubmit} className="flex justify-center items-start py-4">
        <div className="w-full max-w-20 h-10 flex justify-center items-start">
          {!isEditing && (
            <Button
              leftIcon={false}
              rightIconComponent={<Edit />}
              size="forty"
              style="none"
              onClick={onEditToggle}
              disabled={isEditing || formik.isSubmitting}
            />
          )}
        </div>
        <div className="w-full flex flex-row-reverse justify-between max-[1192px]:justify-center items-start flex-wrap gap-y-4">
          <Input
            form={formik}
            field={formik.getFieldProps("firstName")}
            label="نام"
            value={formik.values.firstName}
            disabled={!isEditing || formik.isSubmitting}
          />
          <Input
            form={formik}
            field={formik.getFieldProps("lastName")}
            label="نام خانوادگی"
            value={formik.values.lastName}
            disabled={!isEditing || formik.isSubmitting}
          />
          <Input
            field={{ name: "usernameDisplay" }}
            label="نام کاربری"
            value={userData.username}
            dir={"ltr"}
            disabled={true}
          />
          <Input
            field={{ name: "emailDisplay" }}
            label="ایمیل"
            value={userData.email}
            dir={"ltr"}
            disabled={true}
          />
          <MyDatePicker
            form={formik}
            field={formik.getFieldProps("dateOfBirth")}
            label="تاریخ تولد"
            value={formik.values.dateOfBirth}
            disabled={!isEditing || formik.isSubmitting}
          />
          <Input
            field={{ name: "roleDisplay" }}
            label="نقش"
            value={userData.roleId == 1 ? "دانشجو" : "استاد"}
            disabled={true}
          />
          <Selector
            label="جنسیت"
            value={formik.values.gender}
            radios={[{ id: 0, name: "مرد" }, { id: 1, name: "زن" }]}
            onChange={(e) => formik.setFieldValue('gender', Number(e.target.value))}
            disabled={!isEditing || formik.isSubmitting}
          />
          <Input
            form={formik}
            field={formik.getFieldProps("address")}
            label="آدرس"
            value={formik.values.address}
            disabled={!isEditing || formik.isSubmitting}
            className={"max-w-full"}
          />
          <TextArea
            form={formik}
            field={formik.getFieldProps("bio")}
            className={"max-w-full"}
            label="بیوگرافی"
            value={formik.values.bio}
            disabled={!isEditing || formik.isSubmitting}
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

export default GeneralSettingsSection;
