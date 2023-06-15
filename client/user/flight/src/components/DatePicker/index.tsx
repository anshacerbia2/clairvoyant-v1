import styles from "@/styles/DatePickerV1.module.scss";
import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { getDayList } from "./utils";
import { dayShortNames, monthFullNames } from "./consts";
// import chevron_left from "../../../public/images/icon/chevron_left.svg";
// import chevron_right from "../../../public/images/icon/chevron_right.svg";
// import Image from "next/image";

interface IDatePickerProps {
  calendarType: string;
  departureDate: Date;
  returnDate: Date;
  handleChange: (prefix: string, date: Date) => void;
  hideCalendar: () => void;
  forceClose: boolean;
}

interface IDatePickerStates {
  fixedYear: number;
  fixedMonth: number;
  fixedDate: number;
  currentYear: number;
  currentMonth: number;
  currentDate: number;
  selectedYear: number;
  selectedMonth: number;
  selectedDate: number;
}

const DatePickerV1 = React.forwardRef<HTMLDivElement, IDatePickerProps>(
  (
    {
      hideCalendar,
      calendarType,
      departureDate,
      returnDate,
      handleChange,
      forceClose,
    },
    ref
  ) => {
    const [date, setDate] = useState<IDatePickerStates>({
      fixedYear: new Date().getFullYear(),
      fixedMonth: new Date().getMonth(),
      fixedDate: new Date().getDate(),
      currentYear:
        calendarType === "departure"
          ? departureDate.getFullYear()
          : returnDate.getFullYear(),
      currentMonth:
        calendarType === "departure"
          ? departureDate.getMonth()
          : returnDate.getMonth(),
      currentDate:
        calendarType === "departure"
          ? departureDate.getDate()
          : returnDate.getDate(),
      selectedYear:
        calendarType === "departure"
          ? departureDate.getFullYear()
          : returnDate.getFullYear(),
      selectedMonth:
        calendarType === "departure"
          ? departureDate.getMonth()
          : returnDate.getMonth(),
      selectedDate:
        calendarType === "departure"
          ? departureDate.getDate()
          : returnDate.getDate(),
    });
    const [dayList, setDayList] = useState(
      getDayList(date.currentYear, date.currentMonth)
    );
    const [height, setHeight] = useState<number | undefined>();
    const [opacity, setOpacity] = useState<number>(0);
    const [show, setShow] = useState<boolean>(false);

    useEffect((): void | (() => void) => {
      fadeIn();
    }, []);

    useEffect((): void => {
      setHeight((ref as React.RefObject<HTMLDivElement>).current?.offsetHeight);
    }, [date, ref]);

    useEffect((): void => {
      if (forceClose) fadeOut();
    }, [forceClose]);

    const prevMonth = (event: MouseEvent): void => {
      event.stopPropagation();
      if (date.currentMonth === 0) {
        setDate((prev) => {
          return {
            ...prev,
            currentYear: prev.currentYear - 1,
            currentMonth: 11,
          };
        });
      } else {
        setDate((prev) => {
          return {
            ...prev,
            currentMonth: prev.currentMonth - 1,
          };
        });
      }
    };

    const nextMonth = (event: MouseEvent): void => {
      event.stopPropagation();
      if (date.currentMonth < 11) {
        setDate((prev) => {
          return {
            ...prev,
            currentMonth: prev.currentMonth + 1,
          };
        });
      } else {
        setDate((prev) => {
          return {
            ...prev,
            currentYear: prev.currentYear + 1,
            currentMonth: 0,
          };
        });
      }
    };

    const isSelectedDate = (value: number): boolean => {
      if (
        date.currentYear === date.selectedYear &&
        date.currentMonth === date.selectedMonth &&
        value === date.selectedDate
      ) {
        return true;
      }
      return false;
    };

    const isDisabledDay = (value: number): boolean => {
      if (calendarType === "return") {
        return (
          new Date(`${date.currentYear}-${date.currentMonth + 1}-${value}`) <
          departureDate
        );
      } else {
        return (
          new Date(`${date.currentYear}-${date.currentMonth + 1}-${value}`) <
          new Date(`${date.fixedYear}-${date.fixedMonth + 1}-${date.fixedDate}`)
        );
      }
    };

    const changeDate = (value: number): void => {
      handleChange(
        calendarType,
        new Date(`${date.currentYear}-${date.currentMonth + 1}-${value}`)
      );
      setDate({
        ...date,
        selectedYear: date.currentYear,
        selectedMonth: date.currentMonth,
        selectedDate: value,
      });
      fadeOut();
    };

    const fadeIn = (): void => {
      setShow(true);
      setOpacity(1);
    };

    const fadeOut = (): void => {
      setShow(false);
      setOpacity(0);
    };

    const onTransitionEnd = (): void => {
      if (!show) {
        hideCalendar();
      }
    };

    return (
      <div
        ref={ref}
        id={styles["DatePickerV1"]}
        style={{
          top:
            height && show
              ? -height - 15
              : dayList.length / 7 === 5
              ? -280
              : -320,
          opacity: opacity,
          right: 0,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={styles["arrow"]}></div>
        <div className={styles["content"]}>
          <div className={styles["navigation"]}>
            <button type="button" className="c-btn" onClick={prevMonth}>
              <svg
                viewBox="0 0 18 18"
                role="presentation"
                aria-hidden="true"
                focusable="false"
                style={{
                  height: 12,
                  width: 12,
                  display: "block",
                  fill: "currentcolor",
                  color: "#222222",
                }}
              >
                <path
                  d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"
                  fillRule="evenodd"
                />
              </svg>
            </button>
            <div className={styles["title"]}>
              <span>{monthFullNames[date.currentMonth]}</span>
              &nbsp;
              <span>{date.currentYear}</span>
            </div>
            <button type="button" className="c-btn" onClick={nextMonth}>
              <span>
                <svg
                  viewBox="0 0 18 18"
                  role="presentation"
                  aria-hidden="true"
                  focusable="false"
                  style={{
                    height: 12,
                    width: 12,
                    display: "block",
                    fill: "currentcolor",
                    color: "#222222",
                  }}
                >
                  <path
                    d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
                    fillRule="evenodd"
                  />
                </svg>
              </span>
            </button>
          </div>
          <div className={styles["day-list"]}>
            {dayShortNames.map((day) => {
              return (
                <div
                  className={styles["day-item"]}
                  key={"day-item-" + day}
                  style={{
                    color: day === "Sun" ? "#e7090e" : "#687176",
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
          <div
            className={styles["date-list"]}
            style={{
              gridTemplateRows: `repeat(${
                getDayList(date.currentYear, date.currentMonth).length / 7
              }, 40px)`,
            }}
          >
            {getDayList(date.currentYear, date.currentMonth).map(
              (value, idx) => {
                return (
                  <div
                    className={styles["date-item"]}
                    key={"date-item" + idx}
                    style={{
                      color: isDisabledDay(value) ? "#ddd" : "#03121a",
                    }}
                  >
                    {value ? (
                      isDisabledDay(value) ? (
                        <button type="button" className="c-btn" disabled>
                          {value}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            changeDate(value);
                          }}
                          className={
                            isSelectedDate(value)
                              ? styles["selected"] + " c-btn"
                              : "c-btn"
                          }
                        >
                          {value}
                        </button>
                      )
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      </div>
    );
  }
);

DatePickerV1.displayName = "DatePickerV1";
export default DatePickerV1;
