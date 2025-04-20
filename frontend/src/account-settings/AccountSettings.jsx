import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { Edit, Camera } from "iconsax-react";
import MyDatePicker from "../components/DatePicker";
import TextArea from "../components/TextArea";
import useAccountSettings from "./hooks/useAccountSettings";
import Selector from "../components/Selector";
import DropdownSection from './components/DropdownSection'

export default function AccountSettings() {
  const [isEditingGeneral, setIsEditingGeneral] = useState(false);
  const [isEditingPrivate, setIsEditingPrivate] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);

  const [userData, setUserData] = useState({
    first_name: "مهسا",
    last_name: "محمدی",
    roleId: 2,
    university: "دانشگاه تهران",
    email: "mahsam@gmail.com",
    username: "mahsa_m",
    birthdate: "۱۳۸۰/۰۲/۰۲",
    gender: "1",
    address: "مهسا",
    bio: "مهسا",
    studentId: "۴۰۱۲۳۴۵۶۷۸",
    degree: "کارشناسی",
    entryYear: "۱۴۰۱",
    major: "برق",
    password: "",
  });

  const initialValues = {
    first_name: "مهسا",
    last_name: "محمدی",
    roleId: 2,
    university: "دانشگاه تهران",
    email: "mahsam@gmail.com",
    username: "mahsa_m",
    birthdate: "۱۳۸۰/۰۲/۰۲",
    gender: "1",
    address: "مهسا",
    bio: "مهسا",
    studentId: "۴۰۱۲۳۴۵۶۷۸",
    degree: "کارشناسی",
    entryYear: "۱۴۰۱",
    major: "برق",
    password: "",
  }

  const { formik, apiError } = useAccountSettings(initialValues);


  const handleEditToggle = (section) => {
    switch (section) {
      case 'general':
        setIsEditingGeneral(!isEditingGeneral);
        break;
      case 'private':
        setIsEditingPrivate(!isEditingPrivate);
        break;
      case 'password':
        setIsEditingPassword(!isEditingPassword);
        break;
      default:
        break;
    }
  };

  const handleSave = (section) => {
    // در اینجا باید اطلاعات ذخیره شود
    switch (section) {
      case 'general':
        setIsEditingGeneral(false);
        break;
      case 'private':
        setIsEditingPrivate(false);
        break;
      case 'password':
        setIsEditingPassword(false);
        break;
      default:
        break;
    }
  };

  const handleCancel = (section) => {
    switch (section) {
      case 'general':
        setIsEditingGeneral(false);
        break;
      case 'private':
        setIsEditingPrivate(false);
        break;
      case 'password':
        setIsEditingPassword(false);
        break;
      default:
        break;
    }
    // اطلاعات قبلی برگردد
  };
  const image = "https://awsimages.detik.net.id/community/media/visual/2023/09/29/gaya-jisoo-blackpink-jadi-bidadari-di-film-dr-cheon-and-lost-talisman-5.jpeg?w=650&q=90"

  return (
    <div className="w-full max-w-270 p-6 ">
      <div className="w-full flex flex-col items-center" style={{ '--max-w-rmdp': "23rem" }}>
        {/* top section */}
        <div className="w-full flex justify-end items-center gap-[2.69rem] px-10 pb-10 border-b border-[#CED8E5F8]">
          <div className="flex flex-col justify-center items-end">
            <span className="text-heading-h4 text-redp">{userData.first_name + " " + userData.last_name}</span>
            <span className="text-body-01 text-redp">
              {userData.roleId == 1 ? "دانشجو" : "استاد"}
            </span>
            <span className="text-body-01 text-redp">
              {userData.university}
            </span>
          </div>
          <div className="relative">
            <div
              className="profile-img w-50 h-50 rounded-full border-[12px] border-solid border-neutralgray-4"
              style={{ "--bg": `url(${image})` }}
            />
            <div className="absolute top-[10.37rem] right-32 bg-redp w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
              <Camera color="#ffffff" size={24} />
            </div>
          </div>
        </div>

        {/* genral info*/}
        <DropdownSection title="اطلاعات عمومی" isEditing={isEditingGeneral} bgColor={"#142840"} >
          <div className="flex justify-center items-start py-4">
            <div className="w-full max-w-20 h-10 flex justify-center items-start">
              {!isEditingGeneral && (
                <Button
                  leftIcon={false}
                  rightIconComponent={<Edit />}
                  size="forty"
                  style="none"
                  onClick={() => handleEditToggle('general')}
                  disabled={isEditingGeneral}
                />
              )}

            </div>
            <div className="w-full flex flex-row-reverse justify-between max-[1192px]:justify-center items-start flex-wrap gap-y-2">
              <Input
                form={formik}
                field={formik.getFieldProps("first_name")}
                label="نام"
                value={formik.values.first_name}
                disabled={!isEditingGeneral}
                onChange={formik.handleChange}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("last_name")}
                label="نام خانوادگی"
                value={formik.values.last_name}
                disabled={!isEditingGeneral}
                onChange={formik.handleChange}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("username")}
                label="نام کاربری"
                value={formik.values.username}
                dir={"ltr"}
                disabled={true}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("email")}
                label="ایمیل"
                value={formik.values.email}
                dir={"ltr"}
                disabled={true}
              />
              <MyDatePicker
                form={formik}
                field={formik.getFieldProps("birthdate")}
                label="تاریخ تولد"
                value={formik.values.birthdate}
                disabled={!isEditingGeneral}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("roleId")}
                label="نقش"
                value={userData.roleId == 1 ? "دانشجو" : "استاد"}
                disabled={true}
              />
              <Selector
                label="جنسیت"
                value={formik.values.gender}
                radios={[{ id: 1, name: "زن" }, { id: 2, name: "مرد" }]}
                onChange={(e) => formik.setFieldValue('gender', Number(e.target.value))}
                disabled={!isEditingGeneral}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("address")}
                label="آدرس"
                value={formik.values.address}
                disabled={!isEditingGeneral}
                className={"max-w-full"}
                onChange={formik.handleChange}
              />
              <TextArea
                form={formik}
                field={formik.getFieldProps("bio")}
                className={"max-w-full"}
                label="بیوگرافی"
                value={formik.values.bio}
                disabled={!isEditingGeneral}
                onChange={formik.handleChange}
              />
              {isEditingGeneral && (
                <div className="w-full flex justify-start items-center self-start gap-4">
                  <Button
                    buttonText="ثبت"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleSave('general')}
                  />
                  <Button
                    buttonText="انصراف"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleCancel('general')}
                  />
                </div>
              )}
            </div>
          </div>
        </DropdownSection>

        {/* اطلاعات خصوصی */}
        <DropdownSection title="اطلاعات خصوصی" bgColor={"#495D72"} isEditing={isEditingPrivate}>
          <div className="flex justify-center items-start py-4">
            <div className="w-full max-w-20 h-10 flex justify-center items-start">
              {!isEditingPrivate && (
                <Button
                  leftIcon={false}
                  rightIconComponent={<Edit />}
                  size="forty"
                  style="none"
                  onClick={() => handleEditToggle('private')}
                  disabled={isEditingPrivate}
                />
              )}

            </div>
            <div className="w-full flex flex-row-reverse flex-wrap-reverse justify-between items-start max-[1192px]:justify-center gap-y-2">
              {isEditingPrivate && (
                <div className="w-full flex justify-start items-center self-start gap-4">
                  <Button
                    buttonText="ثبت"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleSave('private')}
                  />
                  <Button
                    buttonText="انصراف"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleCancel('private')}
                  />
                </div>
              )}
              {userData.roleId == 1 ?
                <>
                  <Input
                    form={formik}
                    field={formik.getFieldProps("major")}
                    label="رشته تحصیلی"
                    value={formik.values.major}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("university")}
                    label="دانشگاه محل تحصیل"
                    value={formik.values.university}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("entryYear")}
                    label="سال ورود"
                    value={formik.values.entryYear}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("degree")}
                    label="مقطع"
                    value={formik.values.degree}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("studentId")}
                    label="شماره دانشجویی"
                    value={formik.values.studentId}
                    disabled={!isEditingPrivate}
                  />
                </>
                :
                <>
                  <Input
                    form={formik}
                    field={formik.getFieldProps("studentId")}
                    label="دانشکده"
                    value={formik.values.studentId}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("studentId")}
                    label="دانشگاه"
                    value={formik.values.studentId}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("studentId")}
                    label="کد پرسنلی"
                    value={formik.values.studentId}
                    disabled={!isEditingPrivate}
                  />
                  <Input
                    form={formik}
                    field={formik.getFieldProps("studentId")}
                    label="رتبه استاد"
                    value={formik.values.studentId}
                    disabled={!isEditingPrivate}
                  />
                </>
              }
            </div>
          </div>
        </DropdownSection>

        {/* تغییر رمز عبور */}
        <DropdownSection title="تغییر رمز عبور" bgColor={"#C0C0C0"} isEditing={isEditingPassword}>
          <div className="flex justify-center items-start py-4">
            <div className="w-full max-w-20 h-10 flex justify-center items-start">
              {!isEditingPassword && (
                <Button
                  leftIcon={false}
                  rightIconComponent={<Edit />}
                  size="forty"
                  style="none"
                  onClick={() => handleEditToggle('password')}
                  disabled={isEditingPassword}
                />
              )}

            </div>
            <div className="w-full flex flex-row-reverse flex-wrap-reverse justify-between max-[1192px]:justify-center items-start gap-y-2">
              {isEditingPassword && (
                <div className="w-full flex justify-start items-center self-start gap-4">
                  <Button
                    buttonText="ثبت"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleSave('password')}
                  />
                  <Button
                    buttonText="انصراف"
                    leftIcon={false}
                    rightIcon={false}
                    size="forty"
                    className={"!h-8"}
                    onClick={() => handleCancel('password')}
                  />
                </div>
              )}
              <Input
                form={formik}
                field={formik.getFieldProps("password")}
                label="رمز جدید"
                type="password"
                dir="ltr"
                value={formik.values.password}
                disabled={!isEditingPassword}
                onChange={formik.handleChange}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("password")}
                label="تکرار رمز جدید"
                type="password"
                dir="ltr"
                value={formik.values.password}
                disabled={!isEditingPassword}
                onChange={formik.handleChange}
              />
              <Input
                form={formik}
                field={formik.getFieldProps("password")}
                label="رمز عبور فعلی"
                type="password"
                dir="ltr"
                value={formik.values.password}
                disabled={!isEditingPassword}
                onChange={formik.handleChange}
              />
            </div>
          </div>
        </DropdownSection>
      </div>
    </div>
  );
}
