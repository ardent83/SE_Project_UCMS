import React, { useEffect, useRef, useState } from "react";
import Alert from '../components/Alert';
import useClassForm from "./hooks/useClassForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input';
import Button from "../components/Button";
import { Add, Edit2 } from 'iconsax-react';
import TextArea from "../components/TextArea";
import ScheduleFormSection from './components/ScheduleFormSection'


export default function ClassForm({ formType = 'create', onSuccess = () => { }, onClose = () => { } }) {
    const {
        formik,
        apiError,
        isLoading,
        handleAddSchedule,
        handleRemoveSchedule,
    } = useClassForm({
        formType,
        onSuccess: (type) => {
            const successMessage = type === 'create' ? "!کلاس با موفقیت ایجاد شد" : "!تغییرات کلاس با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            onSuccess();
        }
    });

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const fileInputRef = useRef(null);

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

    if (isLoading) {
        return <div className="w-240 h-fit flex justify-center items-center p-6">Loading...</div>;
    }

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <form onSubmit={formik.handleSubmit} className="w-240 h-fit flex flex-col justify-start items-center p-6 gap-6">
            {showAlert && (
                <Alert message={alertMessage} type={apiError ? "error" : "success"} onClose={handleCloseAlert} />
            )}
            <div className="w-full flex justify-end items-center text-heading-h4 text-redp border-b border-b-neutralgray-3 py-4 gap-3 text-shadow-[0px_5.37px_5.37px_rgba(0_0_0_/_0.25)]">
                {formType === 'create' ?
                    (
                        <>
                            <span>
                                ایجاد کلاس جدید
                            </span>
                            <Add size={32} color="var(--color-redp)" />
                        </>
                    )
                    :
                    (
                        <>
                            <span>
                                ویرایش اطلاعات کلاس
                            </span>
                            <Edit2 variant={'Bold'} size={32} color="var(--color-redp)" />
                        </>
                    )
                }
            </div>
            <div className={"w-full flex flex-row-reverse flex-wrap justify-between items-center gap-6"} style={{ '--max-w-rmdp': "25rem" }}>
                <Input
                    className="!max-w-100"
                    type='text'
                    label={"نام کلاس"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('title')}
                    value={formik.values.title}
                />

                <div className="w-full max-w-100 flex justify-center items-end gap-2">
                    <div
                        className="flex w-10 h-10 justify-center items-center bg-[#495D72] rounded-2xl cursor-pointer"
                        onClick={handleIconClick}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="12" viewBox="0 0 20 12" fill="none">
                            <path d="M5.53109 11.3883C4.11181 11.3883 2.75066 10.8245 1.74708 9.82096C0.743494 8.81737 0.179688 7.45623 0.179688 6.03695C0.179688 4.61767 0.743494 3.25652 1.74708 2.25293C2.75066 1.24935 4.11181 0.685547 5.53109 0.685547H15.7474C16.7796 0.685547 17.7695 1.09559 18.4994 1.82547C19.2293 2.55534 19.6393 3.54527 19.6393 4.57747C19.6393 5.60968 19.2293 6.5996 18.4994 7.32948C17.7695 8.05936 16.7796 8.4694 15.7474 8.4694H7.47705C6.83192 8.4694 6.21322 8.21312 5.75705 7.75695C5.30087 7.30078 5.0446 6.68207 5.0446 6.03695C5.0446 5.39182 5.30087 4.77311 5.75705 4.31694C6.21322 3.86077 6.83192 3.60449 7.47705 3.60449H14.7744V5.06396H7.47705C7.219 5.06396 6.97152 5.16647 6.78905 5.34894C6.60658 5.53141 6.50407 5.7789 6.50407 6.03695C6.50407 6.295 6.60658 6.54248 6.78905 6.72495C6.97152 6.90742 7.219 7.00993 7.47705 7.00993H15.7474C16.0668 7.00993 16.3831 6.94701 16.6783 6.82477C16.9734 6.70253 17.2415 6.52335 17.4674 6.29748C17.6933 6.0716 17.8725 5.80345 17.9947 5.50833C18.1169 5.21321 18.1799 4.89691 18.1799 4.57747C18.1799 4.25804 18.1169 3.94173 17.9947 3.64661C17.8725 3.35149 17.6933 3.08334 17.4674 2.85747C17.2415 2.63159 16.9734 2.45242 16.6783 2.33018C16.3831 2.20794 16.0668 2.14502 15.7474 2.14502H5.53109C4.49888 2.14502 3.50896 2.55506 2.77908 3.28494C2.0492 4.01482 1.63916 5.00474 1.63916 6.03695C1.63916 7.06915 2.0492 8.05908 2.77908 8.78895C3.50896 9.51883 4.49888 9.92887 5.53109 9.92887H14.7744V11.3883H5.53109Z" fill="white" />
                        </svg>
                    </div>
                    <Input
                        ref={fileInputRef}
                        className="!max-w-88"
                        type="file"
                        label={"پس‌زمینه کلاس"}
                        dir='ltr'
                        accept="image/*"
                        form={formik}
                        field={formik.getFieldProps('profileImage')}
                        onChangeFile={(event) => {
                            formik.setFieldValue('profileImage', event.currentTarget.files[0]);
                        }}
                    />
                </div>


                {formType === 'create' &&
                    <>
                        <Input
                            className="!max-w-100"
                            type='password'
                            label={"رمز کلاس"}
                            dir='ltr'
                            form={formik}
                            field={formik.getFieldProps('password')}
                            value={formik.values.password}
                        />

                        <Input
                            className="!max-w-100"
                            type='password'
                            label={"تأیید رمز کلاس"}
                            dir='ltr'
                            form={formik}
                            field={formik.getFieldProps('confirmPassword')}
                            value={formik.values.confirmPassword}
                        />
                    </>
                }

                <TextArea
                    type='text'
                    className={"max-w-full"}
                    label={"توضیحات"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('description')}
                    value={formik.values.description}
                />

                <MyDatePicker
                    className="!max-w-100"
                    label={"تاریخ شروع"}
                    form={formik}
                    field={formik.getFieldProps('startDate')}
                    storageFormat="YYYY-MM-DD"
                    value={formik.values.startDate}
                />

                <MyDatePicker
                    className="!max-w-100"
                    label={"تاریخ پایان"}
                    form={formik}
                    field={formik.getFieldProps('endDate')}
                    storageFormat="YYYY-MM-DD"
                    value={formik.values.endDate}
                />

                <ScheduleFormSection
                    formik={formik}
                    handleAddSchedule={handleAddSchedule}
                    handleRemoveSchedule={handleRemoveSchedule}
                />

            </div>

            <div className="w-full flex justify-start items-center gap-4">
                <Button
                    buttonText={formType === 'create' ? "ایجاد کلاس" : "ذخیره تغییرات"}
                    type="submit"
                    leftIcon={false}
                    rightIcon={false}
                    className="w-fit"
                    disabled={formik.isSubmitting}
                />
                <Button
                    buttonText={"انصراف"}
                    type="button"
                    leftIcon={false}
                    rightIcon={false}
                    className="w-fit"
                    disabled={formik.isSubmitting}
                    onClick={onClose}
                />
            </div>
        </form>
    );
}
