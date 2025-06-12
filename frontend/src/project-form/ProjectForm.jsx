import React, { useEffect, useState, useRef } from "react";
import Alert from '../components/Alert';
import useProjectForm from "./hooks/useProjectForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input';
import Button from "../components/Button";
import TextArea from "../components/TextArea";
import Selector from "../components/Selector";
import FileUploadInput from "./components/FileUploadInput";
import { Add, Edit2 } from 'iconsax-react';

export default function ProjectForm({ formType = 'create', onSuccess = () => { }, onClose = () => { } }) {
    const {
        formik,
        apiError,
        isLoading,
    } = useProjectForm({
        formType,
        onSuccess: (type) => {
            const successMessage = type === 'create' ? "!پروژه با موفقیت ایجاد شد" : "!تغییرات پروژه با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            onSuccess();
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
                        <span>ایجاد پروژه جدید</span>
                        <Add size={32} color="var(--color-redp)" />
                    </>
                ) : (
                    <>
                        <span>ویرایش اطلاعات پروژه</span>
                        <Edit2 variant={'Bold'} size={32} color="var(--color-redp)" />
                    </>
                )}
            </div>

            <div className={"w-full flex flex-row-reverse flex-wrap justify-between items-start gap-6"} style={{ '--max-w-rmdp': "25rem" }}>
                <Input
                    className="!max-w-100"
                    type='text'
                    label={"عنوان پروژه"}
                    dir='rtl'
                    form={formik}
                    field={formik.getFieldProps('title')}
                    value={formik.values.title}
                />

                <div className="flex w-full !max-w-100 justify-end">
                    <Input
                        className="!max-w-35"
                        type='number'
                        label={"نمره کل"}
                        dir='ltr'
                        form={formik}
                        field={formik.getFieldProps('totalScore')}
                        value={formik.values.totalScore}
                    />
                </div>

                {formType === 'create' &&
                    <div className="flex w-full justify-end items-center">
                        <div className="flex w-full max-w-60 justify-end items-end gap-6">
                            <Input
                                className="!justify-end [&>div>input]:rounded-none [&>div]:max-w-15 [&>div>input]:border-2 [&>div>input]:h-8"
                                type='number'
                                label={""}
                                dir='ltr'
                                form={formik}
                                field={formik.getFieldProps('groupSize')}
                                value={formik.values.groupSize}
                                disabled={formik.values.projectType !== 1}
                            />
                            <Selector
                                label=""
                                value={formik.values.projectType}
                                radios={[{ id: 0, name: "فردی" }, { id: 1, name: "گروهی" }]}
                                onChange={(e) => formik.setFieldValue('projectType', Number(e.target.value))}
                                form={formik}
                                field={formik.getFieldProps('projectType')}
                            />
                            <div className="text-body-04 flex h-6 justify-center items-end text-nowrap text-neutralgray-8">نوع پروژه</div>
                        </div>
                    </div>
                }

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

                <FileUploadInput
                    className="!max-w-100"
                    label={"فایل پروژه"}
                    form={formik}
                    fieldName={'projectFile'}
                    accept="*"
                />
            </div>

            <div className="w-full flex justify-start items-center gap-4">
                <Button
                    buttonText={formType === 'create' ? "ایجاد پروژه" : "ذخیره تغییرات"}
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
