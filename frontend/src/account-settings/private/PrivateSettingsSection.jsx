import React, { useEffect, useState } from "react";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Dropdown from "../../components/Dropdown";
import { Edit } from "iconsax-react";
import DropdownSection from '../components/DropdownSection';
import usePrivateSettings from './hooks/usePrivateSettings';
import Alert from "../../components/Alert";
import axios from 'axios';


const API_BASE_URL = 'https://localhost:7269/api/enums';

function PrivateSettingsSection({
  isEditing,
  onEditToggle,
  onSave,
  onCancel,
  userData
}) {
  const { formik, apiError } = usePrivateSettings({
    initialUserData: userData,
    onSaveSuccess: onSave
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoadingEnums, setIsLoadingEnums] = useState(true);

  const [universities, setUniversities] = useState([]);
  const [educationLevels, setEducationLevels] = useState([]);
  const [instructorRanks, setInstructorRanks] = useState([]);


  useEffect(() => {
    const fetchEnums = async () => {
      setIsLoadingEnums(true);
      try {
        const [
          universityRes,
          educationLevelRes,
          instructorRankRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/university`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/educationLevel`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/instructorRank`, { withCredentials: true }),
        ]);

        setUniversities(universityRes.data);
        setEducationLevels(educationLevelRes.data);
        setInstructorRanks(instructorRankRes.data);
      } catch (error) {
        setAlertMessage("!خطا در بارگیری گزینه‌ها");
        setShowAlert(true);
      } finally {
        setIsLoadingEnums(false);
      }
    };

    fetchEnums();
  }, []);

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
    formik.handleReset();
    onCancel();
  };

  const userRole = userData?.role?.id;
  const isFormDisabled = !isEditing || formik.isSubmitting || isLoadingEnums;

  return (
    <DropdownSection title="اطلاعات خصوصی" bgColor={"#495D72"} isEditing={isEditing}>
      {isLoadingEnums ? (
          <div className="w-full text-center py-4">در حال بارگیری گزینه‌ها</div>
      ) : (
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
                  disabled={formik.isSubmitting || isLoadingEnums}
                />
                <Button
                  buttonText="انصراف"
                  leftIcon={false}
                  rightIcon={false}
                  size="forty"
                  className={"!h-8"}
                  onClick={handleCancelClick}
                  type="button"
                  disabled={formik.isSubmitting || isLoadingEnums}
                />
              </div>
            )}
          </div>
        </form>
        )}

        {showAlert && (
          <Alert type="error" message={alertMessage} onClose={handleCloseAlert} />
        )}
      </DropdownSection>
    );
}

export default PrivateSettingsSection;
