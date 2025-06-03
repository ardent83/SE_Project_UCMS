import React from 'react';
import Input from '../../components/Input';
import Button from "../../components/Button";
import { Add, CloseCircle } from 'iconsax-react';

export default function GroupMemberFormSection({ formik, handleAddMember, handleRemoveMember }) {
    return (
        <div className="w-full flex flex-col justify-start items-end gap-4 border-t pt-4 border-neutralgray-3">
            <h4 className="w-full text-caption-01 text-neutralgray-5 text-right mb-2">اعضای گروه</h4>
            <div className="w-full max-w-100 flex flex-row-reverse justify-start items-end gap-4">
                <Input
                    className="!max-w-84 flex-grow"
                    type='text'
                    label={"شماره دانشجویی"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('currentMemberStudentNumber')}
                    value={formik.values.currentMemberStudentNumber}
                />

                <Button
                    textShow={false}
                    rightIconComponent={<Add />}
                    leftIcon={false}
                    size="forty"
                    className={"!max-w-10"}
                    onClick={handleAddMember}
                    type="button"
                    disabled={formik.isSubmitting}
                />
            </div>

            {((formik.touched.currentMemberStudentNumber && formik.errors.currentMemberStudentNumber && typeof formik.errors.currentMemberStudentNumber === 'string')) && (
                <div className="w-full text-stateerror text-right text-caption-04 mt-1">
                    {formik.errors.currentMemberStudentNumber}
                </div>
            )}


            <div className="w-full mt-4">
                <h4 className="w-full text-caption-01 text-neutralgray-5 text-right mb-2">دانشجویان اضافه شده</h4>
                <ul className="list-none p-0 m-0 border border-neutralgray-2 rounded-md">
                    <li className="flex flex-row-reverse justify-between items-center bg-neutralgray-1 py-2 px-2 text-caption-01 text-neutralgray-10 font-bold text-right rounded-t-md">
                        <div className="flex flex-grow justify-around items-center flex-row">
                            <span className="flex-1 text-center">شماره دانشجویی</span>
                        </div>
                        <span className="w-8 text-center"></span>
                    </li>
                    {formik.values.studentTeams.map((member, index) => (
                        <li
                            key={member.studentNumber}
                            className={`flex flex-row-reverse justify-between items-center border-b border-neutralgray-2 py-2 px-2 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            <div className="flex flex-grow justify-around items-center text-right flex-row text-body-04 text-neutralgray-10">
                                <span className="flex-1 text-center">{member.studentNumber}</span>
                            </div>
                            <span className="cursor-pointer w-8 flex justify-center items-center"
                                onClick={() => handleRemoveMember(index)}
                                disabled={formik.isSubmitting}
                            >
                                <CloseCircle size={24} color={"var(--color-stateerror)"} />
                            </span>
                        </li>
                    ))}
                </ul>
                {formik.touched.studentTeams && formik.errors.studentTeams && typeof formik.errors.studentTeams === 'string' ? (
                    <div className="text-stateerror text-right text-caption-04 mb-2">{formik.errors.studentTeams}</div>
                ) : null}
            </div>
        </div>
    );
}
