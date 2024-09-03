/**
 * @module DatePicker Component
 */

import React, { useState, useEffect, useMemo } from "react";
import DatePickerItem from "./DatePickerItem.js";
import { convertDate, nextDate } from "./time.js";
import { dateConfigMap } from "./dataSource";
import { ShallowEqual } from "./PureRender.js";

/**
 * 大写首字母
 * @param {String} str 字符串
 */
const capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join("");

/**
 * 判断数组
 * @param {any} val
 */
const isArray = (val) =>
    Object.prototype.toString.apply(val) === "[object Array]";

/**
 * DatePicker Functional Component
 */

const DatePicker = React.memo(
    (props) => {
        const [value, setValue] = useState(nextDate(props.value));
        console.log(value)

        useEffect(() => {
            const date = nextDate(props.value);
            if (date.getTime() !== value.getTime()) {
                setValue(date);
            }
        }, [props.value, value]);

        useEffect(() => {
            if (value.getTime() > props.max.getTime()) {
                setValue(props.max);
            } else if (value.getTime() < props.min.getTime()) {
                setValue(props.min);
            }
        }, [value, props.min, props.max]);

        const handleFinishBtnClick = () => {
            props.onSelect(value);
        };

        const handleDateSelect = (selectedValue) => {
            setValue(selectedValue);
            props.onChange(selectedValue);
        };

        const normalizeDateConfig = (dataConfig) => {
            const configList = [];
            if (isArray(dataConfig)) {
                dataConfig.forEach((item) => {
                    if (typeof item === "string") {
                        const lowerCaseKey = item.toLocaleLowerCase();
                        configList.push({
                            ...dateConfigMap[lowerCaseKey],
                            type: capitalize(lowerCaseKey),
                        });
                    }
                });
            } else {
                for (const key in dataConfig) {
                    if (dataConfig.hasOwnProperty(key)) {
                        const lowerCaseKey = key.toLocaleLowerCase();
                        if (dateConfigMap.hasOwnProperty(lowerCaseKey)) {
                            configList.push({
                                ...dateConfigMap[lowerCaseKey],
                                ...dataConfig[key],
                                type: capitalize(lowerCaseKey),
                            });
                        }
                    }
                }
            }
            return configList;
        };

        const dataConfigList = useMemo(
            () => normalizeDateConfig(props.dateConfig),
            [props.dateConfig]
        );

        const themeClassName = useMemo(
            () =>
                ["default", "dark", "ios", "android", "android-dark"].includes(
                    props.theme
                )
                    ? props.theme
                    : "default",
            [props.theme]
        );

        return (
            <div className={`datepicker ${themeClassName}`}>
                {props.showHeader && (
                    <div className="datepicker-header">
                        {props.customHeader ||
                            convertDate(value, props.headerFormat)}
                    </div>
                )}
                {props.showCaption && (
                    <div className="datepicker-caption">
                        {dataConfigList.map((item, index) => (
                            <div
                                key={index}
                                className="datepicker-caption-item"
                            >
                                {item.caption}
                            </div>
                        ))}
                    </div>
                )}
                <div className="datepicker-content">
                    {dataConfigList.map((item, index) => (
                        <DatePickerItem
                            key={index}
                            value={value}
                            min={props.min}
                            max={props.max}
                            step={item.step}
                            type={item.type}
                            format={item.format}
                            onSelect={handleDateSelect}
                        />
                    ))}
                </div>
                {props.showFooter && (
                    <div className="datepicker-navbar">
                        <button
                            className="datepicker-navbar-btn"
                            onClick={handleFinishBtnClick}
                        >
                            {props.confirmText}
                        </button>
                        <button
                            className="datepicker-navbar-btn"
                            onClick={props.onCancel}
                        >
                            {props.cancelText}
                        </button>
                    </div>
                )}
            </div>
        );
    },
    (prevProps, nextProps) => {
        return ShallowEqual(prevProps, nextProps);
    }
);

export default DatePicker;
