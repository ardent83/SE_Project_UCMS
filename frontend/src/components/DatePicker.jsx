import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import Input from "./Input";
import React, { useState, useRef, useEffect } from "react";
import { DateObject } from "react-multi-date-picker";

export default function MyDatePicker({
    label,
    dir,
    field,
    form,
    value,
    className,
    disabled,
    ...props
}) {
    const [dateValue, setDateValue] = useState(() => {
        if (value) {
            try {
                const jsDate = new Date(value);
                if (!isNaN(jsDate.getTime())) {
                    return new DateObject({
                        date: jsDate,
                        calendar: persian,
                        locale: persian_fa
                    });
                }
            } catch (error) {
                console.error("Failed to parse initial date value:", value, error);
            }
        }
        return null;
    });

    const inputRef = useRef(null);

    const formatDateForInput = (dateObject) => {
        return dateObject ? dateObject.format("YYYY/MM/DD") : "";
    };

    const handlePickerChange = (dateObject) => {
        setDateValue(dateObject);

        const isoString = dateObject ? dateObject.toDate().toISOString() : null;

        form.setFieldValue(field.name, isoString);
    };

    const handleInputChange = (e) => {
        const newValue = e.target.value;

        if (newValue) {
            try {
                const parts = newValue.split("/");
                if (parts.length === 3) {
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);

                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                        const newDateObject = new DateObject({
                            calendar: persian,
                            locale: persian_fa,
                            year: year,
                            month: month,
                            day: day,
                        });

                        if (newDateObject.isValid) {
                            setDateValue(newDateObject);

                            const isoString = newDateObject.toDate().toISOString();

                            form.setFieldValue(field.name, isoString);
                            return;
                        }
                    }
                }
                 console.warn("Invalid date format or value entered:", newValue);

            } catch (error) {
                console.error("Error parsing date input:", error);
            }
        } else {
            setDateValue(null);
            form.setFieldValue(field.name, null);
        }
    };

    useEffect(() => {
        if (value) {
            try {
                const jsDate = new Date(value);
                 if (!isNaN(jsDate.getTime())) {
                    const newDateObject = new DateObject({
                        date: jsDate,
                        calendar: persian,
                        locale: persian_fa
                    });
                    if (!dateValue || newDateObject.format() !== dateValue.format()) {
                         setDateValue(newDateObject);
                    }
                 } else {
                     setDateValue(null);
                 }
            } catch (error) {
                 console.error("Error updating date picker state from value prop:", value, error);
                 setDateValue(null);
            }
        } else {
             if (dateValue !== null) {
                setDateValue(null);
             }
        }
    }, [value]);

    return (
        <DatePicker
            value={dateValue}
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
            // format="YYYY/MM/DD"
        />
    );
}
