import React, { useEffect, useState } from "react";
import Alert from '../components/Alert';
import useExerciseForm from "./hooks/useExerciseForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input';
import Button from "../components/Button";
import TextArea from "../components/TextArea";
import FileUploadInput from "./components/FileUploadInput";
import CheckboxGroup from "../components/CheckboxGroup";
import { Add, Edit2 } from 'iconsax-react';
import { useNavigate, useParams } from "react-router-dom";

import { allowedFormats } from "./validation/exerciseFormValidationSchema";

const fileFormats = allowedFormats.map(format => ({
    id: format,
    name: format,
}));

export default function ExerciseForm({ formType = 'create' }) {
    const navigate = useNavigate();
    const { classId, exerciseId } = useParams();
    const onClose = () =>  classId ? navigate(`/class/${classId}`) : navigate(`/exercise/${exerciseId}`);

    const {
        formik,
        apiError,
        isLoading,
    } = useExerciseForm({
        formType,
        onSuccess: (type, exerciseId) => {
            const successMessage = type === 'create' ? "!تکلیف با موفقیت ایجاد شد" : "!تغییرات تکلیف با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            setTimeout(() => navigate(`/exercise/${exerciseId}`), 1000);
        }
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

    if (isLoading) {
        return <div className="w-full h-fit flex justify-center items-center p-6">Loading...</div>;
    }

    return (
        <form onSubmit={formik.handleSubmit} className="w-full max-w-240 h-fit flex flex-col justify-start items-center p-6 gap-6">
            {showAlert && (
                <Alert message={alertMessage} type={apiError ? "error" : "success"} onClose={handleCloseAlert} />
            )}

            <div className="w-full flex justify-end items-center text-heading-h4 text-redp border-b border-b-neutralgray-3 py-4 gap-3 text-shadow-[0px_5.37px_5.37px_rgba(0_0_0_/_0.25)]">
                {formType === 'create' ? (
                    <>
                        <span>ایجاد تکلیف جدید</span>
                        <Add size={32} color="var(--color-redp)" />
                    </>
                ) : (
                    <>
                        <span>ویرایش تکلیف</span>
                        <Edit2 variant={'Bold'} size={32} color="var(--color-redp)" />
                    </>
                )}
            </div>

            <div className={"w-full flex flex-row-reverse flex-wrap justify-between items-start gap-6"} style={{ '--max-w-rmdp': "25rem" }}>
                <Input
                    className="!max-w-100"
                    type='text'
                    label={"عنوان تکلیف"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('title')}
                    value={formik.values.title}
                />

                <Input
                    className="!max-w-100"
                    type='number'
                    label={"نمره تکلیف"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('exerciseScore')}
                    value={formik.values.exerciseScore}
                />

                <MyDatePicker
                    className="!max-w-100"
                    label={"تاریخ و زمان شروع"}
                    form={formik}
                    field={formik.getFieldProps('startDate')}
                    value={formik.values.startDate}
                    showTime={true}
                />

                <MyDatePicker
                    className="!max-w-100"
                    label={"تاریخ و زمان پایان"}
                    form={formik}
                    field={formik.getFieldProps('endDate')}
                    value={formik.values.endDate}
                    showTime={true}
                />

                <TextArea
                    type='text'
                    className={"max-w-full"}
                    label={"توضیحات"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('description')}
                    value={formik.values.description}
                />

                <div className="flex !max-w-100 justify-between items-start">
                    <CheckboxGroup
                        className="!max-w-full"
                        label="فرمت‌های فایل نهایی"
                        options={fileFormats}
                        form={formik}
                        fieldName="fileFormats"
                    />
                </div>

                <FileUploadInput
                    className="!max-w-100"
                    label={"فایل تکلیف"}
                    form={formik}
                    fieldName={'exerciseFile'}
                    accept="*"
                />
            </div>

            <div className="w-full flex justify-start items-center gap-4">
                <Button
                    buttonText={formType === 'create' ? "ایجاد تکلیف" : "ذخیره تغییرات"}
                    type="submit"
                    leftIcon={false}
                    rightIcon={false}
                    className="w-fit"
                    disabled={formik.isSubmitting || isLoading}
                />
                <Button
                    buttonText={"انصراف"}
                    type="button"
                    leftIcon={false}
                    rightIcon={false}
                    className="w-fit"
                    disabled={formik.isSubmitting || isLoading}
                    onClick={onClose}
                />
            </div>
        </form>
    );
}
