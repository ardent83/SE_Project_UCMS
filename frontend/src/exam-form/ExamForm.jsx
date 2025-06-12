import React, { useEffect, useState } from "react";
import Alert from '../components/Alert';
import useExamForm from "./hooks/useExamForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input';
import Button from "../components/Button";

export default function ExamForm({ formType = 'create', onSuccess = () => { }, onClose = () => { } }) {
    const {
        formik,
        apiError,
        isLoading,
    } = useExamForm({
        formType,
        onSuccess: (type) => {
            const successMessage = type === 'create' ? "!امتحان با موفقیت ایجاد شد" : "!تغییرات امتحان با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            setTimeout(onSuccess, 100);
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
        <form onSubmit={formik.handleSubmit} className="max-w-240 h-fit flex flex-col justify-start items-center p-6 gap-6">
            {showAlert && (
                <Alert message={alertMessage} type={apiError ? "error" : "success"} onClose={handleCloseAlert} />
            )}

            <div className="w-full flex justify-end items-center text-heading-h4 text-redp border-b border-b-neutralgray-3 py-4 gap-3 text-shadow-[0px_5.37px_5.37px_rgba(0_0_0_/_0.25)]">
                {formType === 'create' ? (
                    <>
                        <span>ایجاد امتحان جدید</span>
                    </>
                ) : (
                    <>
                        <span>ویرایش امتحان</span>
                    </>
                )}
            </div>

            <div className={"w-full flex flex-row-reverse flex-wrap justify-between items-start gap-6"} style={{ '--max-w-rmdp': "25rem" }}>
                <Input
                    className="!max-w-100"
                    type='text'
                    label={"عنوان امتحان"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('title')}
                    value={formik.values.title}
                />

                <Input
                    className="!max-w-100"
                    type='text'
                    label={"محل امتحان"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('examLocation')}
                    value={formik.values.examLocation}
                />

                <MyDatePicker
                    className="!max-w-100"
                    label={"تاریخ و زمان امتحان"}
                    form={formik}
                    field={formik.getFieldProps('date')}
                    value={formik.values.date}
                    showTime={true}
                />

                <Input
                    className="!max-w-100"
                    type='number'
                    label={"نمره امتحان"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('examScore')}
                    value={formik.values.examScore}
                />
            </div>

            <div className="w-full flex justify-start items-center gap-4">
                <Button
                    buttonText={formType === 'create' ? "ایجاد امتحان" : "ذخیره تغییرات"}
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
