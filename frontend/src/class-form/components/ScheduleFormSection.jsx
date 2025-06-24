import React from 'react';
import Input from '../../components/Input';
import Button from "../../components/Button";
import { Add, Trash } from 'iconsax-react';

const daysOfWeek = [
    { value: 0, label: 'شنبه' },
    { value: 1, label: 'یکشنبه' },
    { value: 2, label: 'دوشنبه' },
    { value: 3, label: 'سه شنبه' },
    { value: 4, label: 'چهارشنبه' },
    { value: 5, label: 'پنج شنبه' },
    { value: 6, label: 'جمعه' },
];

export default function ScheduleFormSection({ formik, handleAddSchedule, handleRemoveSchedule }) {
    return (
        <div className="w-full flex flex-col justify-start items-end gap-4 border-t pt-4 border-neutralgray-3">
            <div className="w-full max-w-100 flex flex-row-reverse flex-wrap justify-between items-end gap-y-4">
                <div className="flex flex-col items-end">
                    <label htmlFor="currentScheduleDayOfWeek" className="text-body-04 text-neutralgray-5 mb-1">روزهای هفته</label>
                    <select
                        id="currentScheduleDayOfWeek"
                        name="currentScheduleDayOfWeek"
                        value={formik.values.currentScheduleDayOfWeek}
                        dir='rtl'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-26 h-10 p-2 border border-neutralgray-3 rounded-md text-body-04"
                    >
                        <option value="">انتخاب روز</option>
                        {daysOfWeek.map(day => (
                            <option key={day.value} value={day.value}>{day.label}</option>
                        ))}
                    </select>
                    {/* {formik.touched.currentScheduleDayOfWeek && formik.errors.currentScheduleDayOfWeek ? (
                        <div className="text-stateerror text-right text-caption-04 mt-1">{formik.errors.currentScheduleDayOfWeek}</div>
                    ) : null} */}
                </div>

                <Input
                    className="!max-w-16"
                    type='time'
                    label={"زمان‌ شروع"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('currentScheduleStartTime')}
                    value={formik.values.currentScheduleStartTime || ''}
                />
                <Input
                    className="!max-w-16"
                    type='time'
                    label={"زمان پایان"}
                    dir='ltr'
                    form={formik}
                    field={formik.getFieldProps('currentScheduleEndTime')}
                    value={formik.values.currentScheduleEndTime || ''}
                />

                <Button
                    buttonText={"افزودن جلسه"}
                    rightIconComponent={<Add />}
                    leftIcon={false}
                    size="forty"
                    className={"!w-30"}
                    onClick={handleAddSchedule}
                    type="button"
                    disabled={formik.isSubmitting}
                />
            </div>


            <div className="w-full mt-4">
                <h4 className="w-full text-caption-01 text-neutralgray-5 text-right mb-2">جلسات اضافه شده</h4>
                <ul className="list-none p-0 m-0 border border-neutralgray-2 rounded-md">
                    <li className="flex flex-row-reverse justify-between items-center bg-neutralgray-1 py-2 px-2 text-caption-01 text-neutralgray-10 font-bold text-right rounded-t-md">
                        <div className="flex flex-grow justify-around items-center flex-row">
                            <span className="flex-1 text-center">زمان پایان</span>
                            <span className="flex-1 text-center">زمان شروع</span>
                            <span className="flex-1 text-center">روز</span>
                        </div>
                        <span className="w-8 text-center"></span>
                    </li>
                    {formik.values.schedules.map((schedule, index) => (
                        <li
                            key={index}
                            className={`flex flex-row-reverse justify-between items-center border-b border-neutralgray-2 py-2 px-2 last:border-b-0 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                        >
                            <div className="flex flex-grow justify-around items-center text-right flex-row text-body-04 text-neutralgray-10">
                                <span className="flex-1 text-center">{schedule.endTime}</span>
                                <span className="flex-1 text-center">{schedule.startTime}</span>
                                <span className="flex-1 text-center">{daysOfWeek.find(day => day.value === schedule.dayOfWeek)?.label}</span>
                            </div>
                            <span data-testid="remove-button" className="cursor-pointer w-8 flex justify-center items-center"
                                onClick={() => handleRemoveSchedule(index)}
                                disabled={formik.isSubmitting}
                            >
                                <Trash size={20} color={"var(--color-stateerror)"} />
                            </span>
                        </li>
                    ))}
                </ul>
                {formik.touched.schedules && formik.errors.schedules && typeof formik.errors.schedules === 'string' ? (
                    <div className="text-stateerror text-right text-caption-04 mb-2">{formik.errors.schedules}</div>
                ) : null}
            </div>
        </div>
    );
}
