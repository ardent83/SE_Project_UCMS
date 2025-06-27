import React, { useState, useRef, useEffect } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import Input from "./Input";

export default function MyDatePicker({
    label,
    dir,
    field,
    form,
    value,
    className,
    disabled,
    storageFormat = "isoString",
    displayFormat = "YYYY/MM/DD",
    showTime = false,
    ...props
}) {
    const [dateValue, setDateValue] = useState(null);
    const inputRef = useRef(null);

    const formatDateForInput = (dateObject) => {
        if (!dateObject || !dateObject.isValid) return "";
        if (dateObject.calendar !== persian) {
            const persianDate = new DateObject(dateObject).convert(persian, persian_fa);
            return persianDate.format(displayFormat);
        }
        return dateObject.format(displayFormat);
    };

    const formatDateForFormik = (dateObject) => {
        if (!dateObject || !dateObject.isValid) return null;

        const gregorianDateObject = new DateObject(dateObject).convert(gregorian, gregorian_en);

        if (!gregorianDateObject || !gregorianDateObject.isValid) return null;

        if (showTime) {
            return gregorianDateObject.toDate().toISOString();
        } else {
            const utcDate = new Date(Date.UTC(
                gregorianDateObject.year,
                gregorianDateObject.month.index,
                gregorianDateObject.day
            ));

            if (storageFormat === "isoString") {
                return utcDate.toISOString();
            } else {
                const utcDateObject = new DateObject({ date: utcDate, calendar: gregorian });
                return utcDateObject.format(storageFormat);
            }
        }
    };

    const handlePickerChange = (selectedDateObject) => {
        setDateValue(selectedDateObject);
        form.setFieldValue(field.name, formatDateForFormik(selectedDateObject));
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const parts = inputValue.split(/[/.\-]/);

        if (parts.length === 3) {
            const [year, month, day] = parts.map(Number);
            const newDateObject = new DateObject({ calendar: persian, locale: persian_fa, year, month, day });

            if (newDateObject.isValid) {
                setDateValue(newDateObject);
                form.setFieldValue(field.name, formatDateForFormik(newDateObject));
                return;
            }
        }
        setDateValue(null);
        form.setFieldValue(field.name, null);
    };

    useEffect(() => {
        if (value) {
            try {
                const initialGregorianDate = new DateObject({
                    date: value,
                    calendar: gregorian,
                    locale: gregorian_en,
                    format: storageFormat === "isoString" ? undefined : storageFormat
                });

                if (initialGregorianDate.isValid) {
                    const persianDisplayDate = initialGregorianDate.convert(persian, persian_fa);
                    setDateValue(persianDisplayDate);
                } else {
                    setDateValue(null);
                }
            } catch (error) {
                setDateValue(null);
            }

        } else {
            setDateValue(null);
        }
    }, [value, storageFormat]);

    return (
        <DatePicker
            value={dateValue}
            format={showTime ? "YYYY/MM/DD HH:mm:ss" : displayFormat}
            plugins={showTime ? [
                <TimePicker position="bottom" />
            ] : []}
            onChange={handlePickerChange}
            render={
                <Input
                    className={className}
                    ref={inputRef}
                    type='date'
                    label={label}
                    dir={dir || 'ltr'}
                    value={formatDateForInput(dateValue)}
                    onChange={handleInputChange}
                    onFocus={() => inputRef.current?.select()}
                    disabled={disabled}
                    field={field}
                    form={form}
                    {...props}
                />
            }
            disabled={disabled}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-left"
            portal
        />
    );
}
