import classNames from "classnames";

export const theme = {
    colors: {
        label: {
            default: "text-neutralgray-5",
            focused: "text-black",
            hover: "text-neutralgray-9",
            disabled: "text-neutralgray-4",
            error: "text-stateerror",
        },
        asterisk: {
            default: "text-stateerror",
            disabled: "text-neutralgray-4",
        },
        select: {
            default: "border-neutralgray-5 text-neutralgray-9",
            focused: "border-black text-black",
            hover: "border-neutralgray-9 text-neutralgray-9",
            disabled: "border-neutralgray-4 text-neutralgray-4 cursor-not-allowed",
            error: "border-stateerror text-black",
        },
        input: {
            default: "border-neutralgray-5 text-neutralgray-9 placeholder-neutralgray-9",
            focused: "border-black text-black placeholder-neutralgray-9",
            hover: "border-neutralgray-9 text-neutralgray-9 placeholder-neutralgray-9",
            disabled: "border-neutralgray-4 text-neutralgray-4 cursor-not-allowed placeholder-neutralgray-4",
            error: "border-stateerror text-black placeholder-neutralgray-9",
        },
        icon: {
            default: "fill-neutralgray-9",
            focused: "fill-black",
            hover: "fill-neutralgray-1",
            disabled: "fill-neutralgray-4",
            error: "fill-black",
        },
        errorMessage: {
            error: "text-stateerror",
        },
    },
    baseClasses: {
        labelContainer:
            "group flex flex-col w-full max-w-92 h-17 justify-start items-end gap-1 flex-shrink-0 relative",
        labelWrapper: "text-body-04 flex h-6 justify-center items-end gap-1 flex-shrink-0",
        asterisk: "w-[0.4375rem] h-6 text-right text-body-03",
        selectContainer: "relative w-full",
        select:
            "peer flex h-10 w-full py-[0.375rem] px-2 justify-center items-center gap-2 flex-shrink-0 self-stretch rounded-lg border border-solid text-right text-body-05 placeholder-neutralgray-9 focus:outline-none appearance-none",
        input:
            "peer flex h-10 w-full py-[0.375rem] px-2 justify-center items-center gap-2 flex-shrink-0 self-stretch rounded-lg border border-solid  text-body-05 focus:outline-none appearance-none",
        icon: "w-4 h-4 flex justify-center items-center absolute left-2 top-2/4 -translate-y-1/2 pointer-events-none",
        inputIcon:
            "flex justify-center items-center w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer",
        errorMessage:
            "text-right text-caption-04 absolute bottom-[-1.0625rem] right-0",
    },
};

export const getLabelClasses = (theme, isFocused, disabled, error) => {
    if (disabled) return theme.colors.label.disabled;
    if (error) return theme.colors.label.error;
    if (isFocused) return theme.colors.label.focused;
    return theme.colors.label.default + theme.colors.label.hover.split(" ").map((cls) => ` group-hover:${cls}`).join(" ");
};

export const getAsteriskColor = (theme, disabled, error) => {
    if (disabled) return theme.colors.asterisk.disabled;
    return theme.colors.asterisk.default;
};

export const getSelectClasses = (theme, isFocused, disabled, error) => {
    if (disabled) return theme.colors.select.disabled;
    if (error) return theme.colors.select.error;
    if (isFocused) return theme.colors.select.focused;
    return theme.colors.select.default + theme.colors.select.hover.split(" ").map((cls) => ` hover:${cls}`).join(" ");
};

export const getInputClasses = (theme, isFocused, disabled, error, dir) => {
    let baseClasses = theme.baseClasses.input + (dir === "rtl" ? " text-right" : " text-left");
    if (disabled) return baseClasses + " " + theme.colors.input.disabled;
    if (error) return baseClasses + " " + theme.colors.input.error;
    if (isFocused) return baseClasses + " " + theme.colors.input.focused;
    return baseClasses + " " + theme.colors.input.default + theme.colors.input.hover.split(" ").map((cls) => ` hover:${cls}`).join(" ");
};

export const getIconClasses = (theme, isFocused, disabled, error) => {
    if (disabled) return theme.colors.icon.disabled;
    if (error) return theme.colors.icon.error;
    if (isFocused) return theme.colors.icon.focused;
    return theme.colors.icon.default + theme.colors.icon.hover.split(" ").map((cls) => ` group-hover:${cls}`).join("");
};

export const getErrorMessageClasses = (theme) => {
    return theme.baseClasses.errorMessage + " " + theme.colors.errorMessage.error;
};


export const checkboxClasses = (touched, hasError) => {
    return classNames(
        "peer cursor-pointer disabled:cursor-not-allowed w-4 h-4 rounded border border-big-stone-900 checked:bg-redp checked:border-big-stone-950 focus:outline-none focus:ring-2 focus:ring-big-stone-50",
        {
            "border-error-1": touched && !!hasError
        }
    );
}