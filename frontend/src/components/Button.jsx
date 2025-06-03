import React, { useState, useEffect, useMemo } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";

import { ArrowLeft2, ArrowRight2 } from 'iconsax-react';

export default function Button({
    textShow = true,
    rightIcon = true,
    leftIcon = true,
    disabled = false,
    buttonText,
    color = "primary",
    style = "fill",
    size = "forty",
    className,
    rightIconComponent = <ArrowRight2 variant="Outline" />,
    leftIconComponent = <ArrowLeft2 variant="Outline" />,
    onClick,
    ...otherProps
}) {
    const baseButtonStyles = "inline-flex justify-center items-center text-center gap-1 flex-shrink-0 rounded-lg cursor-pointer disabled:cursor-not-allowed";

    const sizeClasses = {
        forty: "text-button-02 h-10 py-2 px-6",
        fortyEight: "text-button-02 h-12 py-2 px-6",
        thirtyTwo: "text-caption-04 h-8 py-2 px-3"
    };

    const colorClasses = {
        primary: {
            fill: "bg-redp text-white fill-white border-none hover:bg-primaryshade-6 disabled:bg-primarytint-2 disabled:text-primarytint-5 disabled:fill-primarytint-5",
            stroke: "border border-solid border-redp text-redp fill-redp bg-transparent hover:border-primaryshade-6 hover:text-primaryshade-6 hover:fill-primaryshade-6 disabled:border-primarytint-2 disabled:text-primarytint-5 disabled:fill-primarytint-5",
            none: "text-redp fill-redp bg-transparent border-none hover:text-primaryshade-6 hover:fill-primaryshade-6 disabled:text-primarytint-5 disabled:fill-primarytint-5",
        },
        grey: {
            fill: "bg-neutralgray-9 text-white fill-white border-none hover:bg-neutralgray-10 disabled:bg-neutralgray-3 disabled:text-neutralgray-6 disabled:neutralgray-6",
            stroke: "border border-solid border-neutralgray-9 text-neutralgray-9 fill-neutralgray-9 bg-transparent hover:border-neutralgray-10 hover:text-neutralgray-10 hover:fill-neutralgray-10 disabled:border-neutralgray-6 disabled:text-neutralgray-6 disabled:fill-neutralgray-6",
            none: "text-neutralgray-9 fill-neutralgray-9 bg-transparent border-none hover:text-neutralgray-10 hover:fill-neutralgray-10 disabled:text-neutralgray-6 disabled:fill-neutralgray-6",
        }
    };

    const fillRegex = /\bfill-\S+\b/g;
    const hoverFillRegex = /\bhover:fill-\S+\b/g;
    const disabledFillRegex = /\bdisabled:fill-\S+\b/g;

    const fillMatch = colorClasses[color]?.[style]?.match(fillRegex)?.[0] || "";
    const hoverFillMatch = colorClasses[color]?.[style]?.match(hoverFillRegex)?.[0] || `hover:${fillMatch}`;
    const disabledFillMatch = colorClasses[color]?.[style]?.match(disabledFillRegex)?.[0] || `disabled:${fillMatch}`;

    const iconColors = useMemo(() => ({
        normal: fillMatch.replace(/^fill-/, "--color-"),
        hovered: hoverFillMatch.replace(/^hover:fill-/, "--color-"),
        disabled: disabledFillMatch.replace(/^disabled:fill-/, "--color-"),
    }), [color, style, fillMatch, hoverFillMatch, disabledFillMatch]);

    const [iconColor, setIconColor] = useState(iconColors.normal);

    useEffect(() => {
        setIconColor(disabled ? iconColors.disabled : iconColors.normal);
    }, [disabled, iconColors]);

    return (
        <button
            className={classNames(
                className,
                baseButtonStyles,
                sizeClasses[size],
                colorClasses[color]?.[style],
            )}
            onClick={onClick}
            onMouseEnter={() => setIconColor(iconColors.hovered)}
            onMouseLeave={() => setIconColor(disabled ? iconColors.disabled : iconColors.normal)}
            disabled={disabled}
            {...otherProps}
        >
            {leftIcon && (
                <div className={`${size === "thirtyTwo" ? "h-4 w-4" : "h-6 w-6"} flex justify-center items-center flex-shrink-0`}>
                    {React.isValidElement(leftIconComponent) ? React.cloneElement(leftIconComponent, { color: `var(${iconColor})` }) : leftIconComponent}
                </div>
            )}
            {textShow && <div className="whitespace-nowrap">{buttonText}</div>}
            {rightIcon && (
                <div className={`${size === "thirtyTwo" ? "h-4 w-4" : "h-6 w-6"} flex justify-center items-center flex-shrink-0`}>
                    {React.isValidElement(rightIconComponent) ? React.cloneElement(rightIconComponent, { color: `var(${iconColor})` }) : rightIconComponent}
                </div>
            )}
        </button>
    );
};

Button.propTypes = {
    textShow: PropTypes.bool,
    rightIcon: PropTypes.bool,
    leftIcon: PropTypes.bool,
    disabled: PropTypes.bool,
    buttonText: PropTypes.string,
    color: PropTypes.oneOf(["grey", "primary"]),
    style: PropTypes.oneOf(["none", "fill", "stroke"]),
    size: PropTypes.oneOf(["forty", "fortyEight", "thirtyTwo"]),
    className: PropTypes.string,
    rightIconComponent: PropTypes.node,
    leftIconComponent: PropTypes.node,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(["button", "submit", "reset"]),
    id: PropTypes.string,
    'aria-label': PropTypes.string,
};

Button.defaultProps = {
    textShow: true,
    rightIcon: true,
    leftIcon: true,
    disabled: false,
    rightIconComponent: <ArrowRight2 variant="Outline" />,
    leftIconComponent: <ArrowLeft2 variant="Outline" />,
    onClick: () => {},
    type: "button",
};
