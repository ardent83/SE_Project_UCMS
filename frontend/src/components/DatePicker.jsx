import DatePicker from "react-multi-date-picker"
import persian from "react-date-object/calendars/persian"
import persian_fa from "react-date-object/locales/persian_fa"
import Input from "./Input"
import React, { useState, useRef, useEffect } from "react"
import { DateObject } from "react-multi-date-picker"

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
    const [dateValue, setDateValue] = useState(new DateObject({ date: value, calendar: persian, locale: persian_fa }));
    const inputRef = useRef(null);

    const handleChange = (dateObject) => {
        setDateValue(dateObject);
    };

    useEffect(() => {
        if (!form.values[field.name]) {
            form.setFieldValue(field.name, new DateObject({ date: value, calendar: persian, locale: persian_fa }));
        }
    }, [form, field.name]);

    const formatDate = (date) => {
        return date ? date.format("YYYY/MM/DD") : "";
    };

    const handleInputChange = (e, newValue) => {
        if (newValue) {
            try {
                const parts = newValue.split("/");
                if (parts.length === 3) {
                    const year = parseInt(parts[0], 10);
                    const month = parseInt(parts[1], 10);
                    const day = parseInt(parts[2], 10);

                    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
                        const newDate = new DateObject({
                            calendar: persian,
                            locale: persian_fa,
                            year: year,
                            month: month,
                            day: day,
                        });
                        setDateValue(newDate);
                    }
                }
            } catch (error) {
                console.error("Invalid date format:", error);
            }
        } else {
            setDateValue(null);
        }
    };

    return (
        <DatePicker
            value={dateValue}
            onChange={handleChange}
            render={<Input
                className={className}
                ref={inputRef}
                type='date'
                label={label}
                dir={dir | 'ltr'}
                value={formatDate(dateValue)}
                onChange={handleInputChange}
                disabled={disabled}
                field={field}
                form={form}
                props={props}
            />}
            disabled={disabled}
            calendar={persian}
            locale={persian_fa}
            calendarPosition="bottom-left"
        />
    );
}
