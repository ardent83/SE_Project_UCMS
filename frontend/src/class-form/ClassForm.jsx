import React, { useEffect, useRef, useState } from "react";
import Alert from '../components/Alert'
import useClassForm from "./hooks/useClassForm";
import MyDatePicker from "../components/DatePicker";
import Input from '../components/Input'
import Button from "../components/Button";
import { Add } from 'iconsax-react'
import TextArea from "../components/TextArea";

export default function ClassForm({ formType }) {
    const { formik, apiError } = useClassForm();

    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('مسیح موسوی');


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

    return (
        <div className="w-240 h-fit flex flex-col justify-start items-center p-6 gap-10 border border-solid border-neutralgray-3">
            {showAlert && (
                <Alert message={alertMessage} type="error" onClose={handleCloseAlert} />
            )}

            
            <div className={"w-full flex flex-row-reverse flex-wrap justify-between items-center gap-6"} style={{'--max-w-rmdp': "25rem"}}>
                <Input className="!max-w-100" type='text'  label={"اسم کلاس"} dir='rtl' form={formik} field={formik.getFieldProps('')} />
                <Input className="!max-w-100" type='file' text={"بکش بیاد"} label={"پروفایل کلاس"} dir='ltr' form={formik} field={formik.getFieldProps('')} />
                <TextArea type='text' className={"max-w-full"} label={"توضیحات"} dir='rtl' form={formik} field={formik.getFieldProps('')} />
                <MyDatePicker className="!max-w-100" label={"تاریخ شروع"} form={formik} field={formik.getFieldProps('date')}/>
                <MyDatePicker className="!max-w-100"  label={"تاریخ پایان"} form={formik} field={formik.getFieldProps('date')}/>
                <div className="flex flex-row-reverse justify-center items-end gap-2">
                    <MyDatePicker label={"زمان و ساعت کلاس"} form={formik} field={formik.getFieldProps('date')}/>
                    <Button 
                        buttonText={"جلسه جدید"}
                        rightIconComponent={<Add />}
                        leftIcon={false}
                        size="forty"
                        className={"w-30"}
                        onClick={() => {
                            setAlertMessage({alertMessage});
                            setShowAlert(true);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
