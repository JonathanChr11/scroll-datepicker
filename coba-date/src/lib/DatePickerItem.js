/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import * as TimeUtil from "./time.js";
import { addPrefixCss, formatCss } from "./prefix.js";
import { ShallowEqual } from "./PureRender.js";

const DATE_HEIGHT = 40;
const DATE_LENGTH = 10;
const MIDDLE_INDEX = Math.floor(DATE_LENGTH / 2);
const MIDDLE_Y = -DATE_HEIGHT * MIDDLE_INDEX;

const isUndefined = (val) => typeof val === "undefined";
const isFunction = (val) =>
    Object.prototype.toString.apply(val) === "[object Function]";

const DatePickerItem = React.memo(
    ({ type, value, min, max, format, step, onSelect }) => {
        const animating = useRef(false);
        const touchY = useRef(0);
        const translateY = useRef(0);
        const currentIndex = useRef(MIDDLE_INDEX);
        const moveDateCount = useRef(0);
        const _moveToTimer = useRef(null);
        const viewport = useRef(null);
        const scrollRef = useRef(null);

        const [state, setState] = useState({
            translateY: MIDDLE_Y,
            marginTop: (currentIndex - MIDDLE_INDEX) * DATE_HEIGHT,
            dates: [],
        });

        const _iniDates = (date) => {
            const typeName = type;
            const dates = Array.from({ length: DATE_LENGTH }, (_, index) =>
                TimeUtil[`next${typeName}`](date, (index - MIDDLE_INDEX) * step)
            );
            setState((prevState) => ({
                ...prevState,
                dates,
            }));
        };

        const _updateDates = (direction) => {
            const typeName = type;
            const { dates } = state;
            if (direction === 1) {
                currentIndex.current++;
                setState((prevState) => ({
                    ...prevState,
                    dates: [
                        ...dates.slice(1),
                        TimeUtil[`next${typeName}`](
                            dates[dates.length - 1],
                            step
                        ),
                    ],
                    marginTop:
                        (currentIndex.current - MIDDLE_INDEX) * DATE_HEIGHT,
                }));
            } else {
                currentIndex.current--;
                setState((prevState) => ({
                    ...prevState,
                    dates: [
                        TimeUtil[`next${typeName}`](dates[0], -step),
                        ...dates.slice(0, dates.length - 1),
                    ],
                    marginTop:
                        (currentIndex.current - MIDDLE_INDEX) * DATE_HEIGHT,
                }));
            }
        };

        const _checkIsUpdateDates = (direction, translateY) => {
            return direction === 1
                ? currentIndex.current * DATE_HEIGHT + DATE_HEIGHT / 2 <
                      -translateY
                : currentIndex.current * DATE_HEIGHT - DATE_HEIGHT / 2 >
                      -translateY;
        };

        const _clearTransition = (obj) => {
            addPrefixCss(obj, { transition: "" });
        };

        const _moveToNext = (direction) => {
            const date = state.dates[MIDDLE_INDEX] || new Date();
            if (
                direction === -1 &&
                date.getTime() < min.getTime() &&
                moveDateCount.current
            ) {
                _updateDates(1);
            } else if (
                direction === 1 &&
                date.getTime() > max.getTime() &&
                moveDateCount.current
            ) {
                _updateDates(-1);
            }

            _moveTo(currentIndex.current, date);
        };

        const _moveTo = (currentIndex, date) => {
            animating.current = true;
            addPrefixCss(scrollRef.current, {
                transition: "transform .2s ease-out",
            });

            setState((prevState) => ({
                ...prevState,
                translateY: -currentIndex * DATE_HEIGHT,
            }));

            // console.log("date", date);

            _moveToTimer.current = setTimeout(() => {
                console.log("date", date);
                animating.current = false;
                onSelect(date);
                _clearTransition(scrollRef.current);
            }, 200);
        };

        const handleStart = (event) => {
            touchY.current =
                !isUndefined(event.targetTouches) &&
                !isUndefined(event.targetTouches[0])
                    ? event.targetTouches[0].pageY
                    : event.pageY;

            translateY.current = state.translateY;
            moveDateCount.current = 0;
        };

        const handleMove = (event) => {
            const touchYValue =
                !isUndefined(event.targetTouches) &&
                !isUndefined(event.targetTouches[0])
                    ? event.targetTouches[0].pageY
                    : event.pageY;

            const dir = touchYValue - touchY.current;
            const translateYValue = translateY.current + dir;
            const direction = dir > 0 ? -1 : 1;

            const date = state.dates[MIDDLE_INDEX] || new Date();
            if (
                date.getTime() < min.getTime() ||
                date.getTime() > max.getTime()
            ) {
                return;
            }

            if (_checkIsUpdateDates(direction, translateYValue)) {
                moveDateCount.current =
                    direction > 0
                        ? moveDateCount.current + 1
                        : moveDateCount.current - 1;
                _updateDates(direction);
            }

            setState((prevState) => ({
                ...prevState,
                translateY: translateYValue,
            }));
        };

        const handleEnd = (event) => {
            const touchYValue = event.pageY || event.changedTouches[0].pageY;
            const dir = touchYValue - touchY.current;
            const direction = dir > 0 ? -1 : 1;
            _moveToNext(direction);
        };

        const handleContentTouch = (event) => {
            event.preventDefault();
            // if (animating.current) return;
            if (event.type === "touchstart") {
                handleStart(event);
            } else if (event.type === "touchmove") {
                handleMove(event);
            } else if (event.type === "touchend") {
                handleEnd(event);
            }
        };

        const handleContentMouseDown = (event) => {
            // if (animating.current) return;
            handleStart(event);
            document.addEventListener("mousemove", handleContentMouseMove);
            document.addEventListener("mouseup", handleContentMouseUp);
        };

        const handleContentMouseMove = (event) => {
            // if (animating.current) return;
            handleMove(event);
        };

        const handleContentMouseUp = (event) => {
            // if (animating.current) return;
            handleEnd(event);
            document.removeEventListener("mousemove", handleContentMouseMove);
            document.removeEventListener("mouseup", handleContentMouseUp);
        };

        const renderDatepickerItem = (date, index) => {
            const className = date < min || date > max ? "disabled" : "";

            let formatDate;
            if (isFunction(format)) {
                formatDate = format(date);
            } else {
                formatDate = TimeUtil.convertDate(date, format);
            }

            return (
                <li key={index} className={className}>
                    {formatDate}
                </li>
            );
        };

        useEffect(() => {
            _iniDates(value);
            currentIndex.current = MIDDLE_INDEX;
            setState((prevState) => ({
                ...prevState,
                translateY: MIDDLE_Y,
                marginTop: (currentIndex.current - MIDDLE_INDEX) * DATE_HEIGHT,
            }));
        }, [value]);

        useEffect(() => {
            const viewportElement = viewport.current;
            viewportElement.addEventListener(
                "touchstart",
                handleContentTouch,
                false
            );
            viewportElement.addEventListener(
                "touchmove",
                handleContentTouch,
                false
            );
            viewportElement.addEventListener(
                "touchend",
                handleContentTouch,
                false
            );
            viewportElement.addEventListener(
                "mousedown",
                handleContentMouseDown,
                false
            );

            return () => {
                viewportElement.removeEventListener(
                    "touchstart",
                    handleContentTouch,
                    false
                );
                viewportElement.removeEventListener(
                    "touchmove",
                    handleContentTouch,
                    false
                );
                viewportElement.removeEventListener(
                    "touchend",
                    handleContentTouch,
                    false
                );
                viewportElement.removeEventListener(
                    "mousedown",
                    handleContentMouseDown,
                    false
                );

                // clearTimeout(_moveToTimer.current);
            };
        }, [handleContentMouseDown, handleContentTouch]);

        const scrollStyle = formatCss({
            transform: `translateY(${state.translateY}px)`,
            marginTop: state.marginTop,
        });

        return (
            <div className="datepicker-col-1">
                <div ref={viewport} className="datepicker-viewport">
                    <div className="datepicker-wheel">
                        <ul
                            ref={scrollRef}
                            className="datepicker-scroll"
                            style={scrollStyle}
                        >
                            {state.dates.map(renderDatepickerItem)}
                        </ul>
                    </div>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        return ShallowEqual(prevProps, nextProps);
    }
);

export default DatePickerItem;
