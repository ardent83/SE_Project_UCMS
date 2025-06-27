import React, { useEffect, useState } from "react";
import Alert from '../components/Alert';
import usePhaseForm from "./hooks/usePhaseForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input';
import Button from "../components/Button";
import TextArea from "../components/TextArea";
import FileUploadInput from "./components/FileUploadInput";
import CheckboxGroup from "../components/CheckboxGroup";
import { Add, Edit2 } from 'iconsax-react';
import { useNavigate, useParams } from "react-router-dom";

import { allowedFormats } from "./validation/phaseFormValidationSchema";

const fileFormats = allowedFormats.map(format => ({
    id: format,
    name: format,
}));

export default function PhaseForm({ formType = 'create' }) {
    const navigate = useNavigate();
    const { projectId, phaseId } = useParams();
    const onClose = () => projectId ? navigate(`/project/${projectId}`) : navigate(`/phase/${phaseId}`);

    const {
        formik,
        apiError,
        isLoading,
    } = usePhaseForm({
        formType,
        onSuccess: (type, phaseId) => {
            const successMessage = type === 'create' ? "!فاز با موفقیت ایجاد شد" : "!تغییرات فاز با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            setTimeout(() => navigate(`/phase/${phaseId}`), 1000);
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
        <form onSubmit={formik.handleSubmit} className="w-full my-10 px-10 text-bg-blue h-fit flex flex-col justify-start items-center gap-6">
            {showAlert && (
                <Alert message={alertMessage} type={apiError ? "error" : "success"} onClose={handleCloseAlert} />
            )}

            <div className="w-full text-3xl font-bold mt-6 mb-10 flex items-center border-b border-gray-300 pb-8 gap-2 justify-end">
                {formType === 'create' ? (
                    <>
                        <span data-testid="create-phase-form-title">ایجاد فاز جدید</span>
                        <Add size={32} color="var(--color-redp)" />
                    </>
                ) : (
                    <>
                        <span>ویرایش فاز</span>
                        <Edit2 variant={'Bold'} size={32} color="var(--color-redp)" />
                    </>
                )}
            </div>

            <div className={"w-full max-w-240 flex flex-row-reverse flex-wrap justify-between items-start gap-6"} style={{ '--max-w-rmdp': "25rem" }}>
                <Input
                    className="!max-w-100"
                    type='text'
                    label={"عنوان فاز"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('title')}
                    value={formik.values.title}
                />

                <Input
                    className="!max-w-100"
                    type='number'
                    label={"نمره فاز"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('phaseScore')}
                    value={formik.values.phaseScore}
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
                    label={"فایل فاز"}
                    form={formik}
                    fieldName={'phaseFile'}
                    accept="*"
                />
            </div>

            <div className="w-full max-w-240 flex justify-start items-center gap-4">
                <Button
                    buttonText={formType === 'create' ? "ایجاد فاز" : "ذخیره تغییرات"}
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
                    data-testid="create-phase-cancel-button"
                />
            </div>
        </form>
    );
}
