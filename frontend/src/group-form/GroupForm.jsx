import React, { useEffect, useState } from "react";
import Alert from '../components/Alert';
import useGroupForm from "./hooks/useGroupForm";
import Input from '../components/Input';
import Button from "../components/Button";
import { Add, DocumentDownload, Edit2 } from 'iconsax-react';
import FileUploadInput from "./components/FileUploadInput";
import GroupMemberFormSection from './components/GroupMemberFormSection';
import TabSwitcher from './components/TabSwitcher'
import { useParams } from "react-router-dom";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export default function GroupForm({ formType = 'create', onSuccess = () => { }, onClose = () => { } }) {
    const {
        formik,
        apiError,
        isLoading,
        mode,
        setMode,
        handleAddMember,
        handleRemoveMember,
    } = useGroupForm({
        formType,
        onSuccess: (type) => {
            const successMessage = type === 'create' ? "!گروه با موفقیت ایجاد شد" : "!تغییرات گروه با موفقیت ذخیره شد";
            setAlertMessage(successMessage);
            setShowAlert(true);
            onSuccess();
        }
    });

    const { projectId } = useParams();

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
        return <div className="w-240 h-fit flex justify-center items-center p-6">Loading...</div>;
    }

    return (
        <form onSubmit={formik.handleSubmit} className="max-w-240 h-fit flex flex-col justify-start items-center p-6 gap-6">
            {showAlert && (
                <Alert message={alertMessage} type={apiError ? "error" : "success"} onClose={handleCloseAlert} />
            )}
            <div className="w-full flex justify-end items-center text-heading-h4 text-redp border-b border-b-neutralgray-3 py-4 gap-3 text-shadow-[0px_5.37px_5.37px_rgba(0_0_0_/_0.25)]">
                {formType === 'create' ?
                    (
                        <>
                            <span>
                                ایجاد گروه جدید
                            </span>
                            <Add size={32} color="var(--color-redp)" />
                        </>
                    )
                    :
                    (
                        <>
                            <span>
                                ویرایش اطلاعات گروه
                            </span>
                            <Edit2 variant={'Bold'} size={32} color="var(--color-redp)" />
                        </>
                    )
                }
            </div>

            <div className="w-full flex flex-col items-end gap-4">
                {formType === 'create' &&
                    <TabSwitcher mode={mode} setMode={setMode} />
                }
                {(mode === 'bulk' && formType === 'create') && (
                    <div className="w-full flex flex-col items-end gap-4">
                        <div className="w-full flex items-center justify-between">
                            <a
                                className="text-body-04 text-neutralgray-9 flex items-center gap-2"
                                href={`${apiBaseUrl}/api/Teams/template/${projectId}`}
                                download
                            >
                                دانلود
                                <DocumentDownload
                                    className="cursor-pointer"
                                    size={32}
                                    color="var(--color-redp)"
                                    variant="Bulk"
                                />
                            </a>
                            <p className="text-body-04 text-neutralgray-7 text-right">
                                .لطفا فایل مربوطه را دانلود کرده، پس از تکمیل، فایل آن را بارگذاری کنید
                            </p>
                        </div>
                        <FileUploadInput
                            className="!max-w-100"
                            label={"فایل گروه"}
                            form={formik}
                            fieldName={'file'}
                            accept=".xlsx,.xls,.csv"
                        />
                    </div>
                )}

                {mode === 'individual' && (
                    <div className="w-full flex flex-row-reverse flex-wrap justify-between items-start gap-6">
                        <Input
                            className="!max-w-100"
                            type='text'
                            label={"نام گروه"}
                            dir='rtl'
                            form={formik}
                            field={formik.getFieldProps('name')}
                            value={formik.values.name}
                        />

                        <Input
                            className="!max-w-100"
                            type='text'
                            label={"شماره دانشجویی مدیر گروه"}
                            dir='ltr'
                            form={formik}
                            field={formik.getFieldProps('leaderStudentNumber')}
                            value={formik.values.leaderStudentNumber}
                        />

                        <GroupMemberFormSection
                            formik={formik}
                            handleAddMember={handleAddMember}
                            handleRemoveMember={handleRemoveMember}
                        />
                    </div>
                )}
            </div>


            <div className="w-full flex justify-start items-center gap-4 mt-6">
                <Button
                    buttonText={formType === 'create' ? "ایجاد گروه" : "ذخیره تغییرات"}
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
