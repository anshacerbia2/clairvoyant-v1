"use client";
import styles from "@/styles/SearchFlightForm.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios, { AxiosResponse } from "axios";
// Helpers
import {
  createNewDate,
  dateToStringAmadeus,
  dateToStringWithSlash,
} from "@/helpers/createNewDate";
// Components
import DatePickerV1 from "@/components/DatePicker";
import AirportListDropdown from "../dropdown/AirportListDropdown";
import PassengerDropdown from "../dropdown/PassengerDropdown";
import TravelClassDropdown from "../dropdown/TravelClassDropdown";
import DropdownTransition from "../dropdown/DropdownTransition";
// I18n
import { useTranslations } from "next-intl";
// Icons
import { VscCalendar, VscAdd } from "react-icons/vsc";
import { IoAddCircle } from "react-icons/io5";
import flightIcon from "../../../../public/images/icon/plane_icon.png";
import {
  MdDone,
  MdOutlineAirlineSeatReclineExtra,
  MdOutlineMan,
} from "react-icons/md";
// Models
import {
  defaultAirport,
  defaultTravelClass,
} from "@/models/search-flight-form.model";
import type {
  IAirportList,
  ISearchFlightFormChildrenRef,
  ISearchFlightFormInputStates,
  ISearchFlightFormDropdown,
} from "@/models/search-flight-form.model";

const initDate = createNewDate(
  new Date().getFullYear(),
  new Date().getMonth(),
  new Date().getDate()
);

const SearchFlightForm: React.FC = () => {
  const dateBorderRef = useRef<HTMLDivElement>(null);
  /* The Ref bellow can be accessed:
   **inputRef.current.origin or inputRef.current['origin']
   */
  const inputRef = useRef({
    origin: [] as HTMLInputElement[],
    destination: [] as HTMLInputElement[],
    departure: [] as HTMLInputElement[],
    return: null,
    passenger: null,
    travelClass: null,
    promoCode: null,
  } as Record<string, null | HTMLInputElement | HTMLInputElement[]>);
  /* The Ref bellow can be accessed:
   **childrenRef.current.airportListDropdownRef.current
   */
  const childrenRef = useRef<ISearchFlightFormChildrenRef>({
    airportListDropdownRef: useRef(null),
    datePickerRef: useRef(null),
    dropdownTransitionRef: useRef(null),
  });

  const t = useTranslations("Index");

  const [input, setInput] = useState<ISearchFlightFormInputStates>({
    tripType: {
      oneWay: false,
      roundTrip: true,
      multiCity: false,
    },
    segments: [
      {
        origin: defaultAirport,
        destination: defaultAirport,
        departureDate: initDate,
      },
    ],
    returnDate: initDate,
    passenger: {
      adults: 1,
      children: 0,
      infants: 0,
    },
    travelClass: {
      value: "ECONOMY",
      display: "Economy",
    },
    nonStop: false,
    promoCode: "",
  });
  const [searchKey, setSearchKey] = useState([
    {
      origin: "",
      destination: "",
    },
  ]);
  const [isInitDepartureDate, setIsInitDepartureDate] = useState([true]);
  const [isInitReturnDate, setIsInitReturnDate] = useState(true);
  const [showDropdown, setShowDropdown] = useState<ISearchFlightFormDropdown>({
    airportDropdown: false,
    datePicker: false,
    passengerDropdown: false,
    travelClassDropdown: false,
  });
  const [forceClose, setForceClose] = useState<ISearchFlightFormDropdown>({
    airportDropdown: false,
    datePicker: false,
    passengerDropdown: false,
    travelClassDropdown: false,
  });
  const [airportListDropdowntype, setAirportListDropdowntype] =
    useState("origin-1");
  const [airportListDropdownidx, setAirportListDropdownidx] = useState(0);
  const [calendarType, setCalendarType] = useState("departure-1");
  const [segmentsIdx, setSegmentsIdx] = useState(0);
  const [airportList, setAirportList] = useState<IAirportList[]>([]);
  // const [flighList, setFlightList] = useState<any[]>([]);
  const [inputDynamicWidth, setInputDynamicWidth] = useState(232);

  // const [showCalendar, setShowCalendar] = useState(false);
  // const [showAirportListDropdown, setShowAirportListDropdown] = useState(false);
  // const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  // const [showTravelClassDropdown, setShowTravelClassDropdown] = useState(false);

  useEffect(() => {}, [input, showDropdown, forceClose]);

  useEffect((): void => {
    const fetchAirportList = async () => {
      const response: AxiosResponse<IAirportList[]> = await axios.get<
        IAirportList[]
      >("http://localhost:4002/airport-list");
      if (response.status === 200) {
        setAirportList(response.data);
      }
    };
    fetchAirportList();
  }, []);

  useEffect((): void | (() => void) => {
    if (
      showDropdown.airportDropdown ||
      showDropdown.datePicker ||
      showDropdown.passengerDropdown ||
      showDropdown.travelClassDropdown
    ) {
      const handleClickOutside: EventListener = (event: Event): void => {
        const airportDropdownEleId = `#${childrenRef.current.airportListDropdownRef.current?.id}`;
        const datePickerEleId = `#${childrenRef.current.datePickerRef.current?.id}`;
        const dropdownTransitionEleId = `#${childrenRef.current.dropdownTransitionRef.current?.id}`;
        let isNotTarget: boolean = true;
        for (const key in inputRef.current) {
          const currentRef = inputRef.current[key];
          if (Array.isArray(currentRef)) {
            isNotTarget = currentRef.every((val) => {
              return val !== event.target;
            });
          } else {
            isNotTarget = currentRef !== event.target;
          }
          if (!isNotTarget) break;
        }
        if (
          event.target instanceof HTMLElement &&
          isNotTarget &&
          event.target !== inputRef.current.return &&
          event.target !== inputRef.current.passenger &&
          event.target !== inputRef.current.travelClass &&
          event.target !== inputRef.current.promoCode &&
          event.target.id !==
            childrenRef.current.airportListDropdownRef.current?.id &&
          event.target.id !== childrenRef.current.datePickerRef.current?.id &&
          event.target.id !==
            childrenRef.current.dropdownTransitionRef.current?.id &&
          !event.target.closest(airportDropdownEleId) &&
          !event.target.closest(datePickerEleId) &&
          !event.target.closest(dropdownTransitionEleId)
        ) {
          clearSearchKey();
          for (const key in inputRef.current) {
            const inputRefArr = inputRef.current[key];
            if (inputRefArr) {
              if (Array.isArray(inputRefArr)) {
                inputRefArr.forEach((element) => {
                  element.classList.remove("focused-input");
                });
              } else {
                inputRefArr.classList.remove("focused-input");
              }
            }
          }
          normalizeDateBorder();
          setForceClose((prevState) => {
            const newState = Object.fromEntries(
              Object.entries(prevState).map(([key, value]) => {
                return [
                  key,
                  Array.isArray(value) ? Array(value.length).fill(true) : true,
                ];
              })
            );
            return newState as ISearchFlightFormDropdown;
          });
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [showDropdown]);

  useEffect((): void => {
    const originRef = inputRef.current.origin;
    const originWidth = Array.isArray(originRef)
      ? originRef[0]?.offsetWidth
      : originRef?.offsetWidth;
    if (originWidth) {
      setInputDynamicWidth(originWidth);
    }
  }, [input.tripType]);

  const getOriginOrDestinationValue = (value: IAirportList): string => {
    const { id, city, country, name, code } = value;
    return id ? `${city} (${code}), ${name}, ${country}` : "";
  };

  const getPassengerValue = (): string => {
    return `${input.passenger.adults} Adults, ${input.passenger.children} Children, ${input.passenger.infants} Infants`;
  };

  const handleChangeSearchKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const name = event.target.name.split("-")[0];
    const value = event.target.value;
    setSearchKey((prevState) => {
      const searchValue = prevState.map((v, i) => {
        if (i === segmentsIdx) {
          return { ...v, [name]: value };
        } else {
          return { ...v };
        }
      });
      return searchValue;
    });
  };

  const clearSearchKey = (): void => {
    setSearchKey((prevState) => {
      const value = prevState.map((key) => {
        return { origin: "", destination: "" };
      });
      return value;
    });
  };

  /*
   ** Input with dropdown UI/UX (Require DOM manipulation)
   ** Since these elements binded with focus, blur and click event,
   ** and the CSS (only) cannot give the expected result, we need to manipulate the DOM
   */
  const setCurrentForceClose = (
    dropdown: string,
    value: boolean
    // segmentIdx: number | undefined
  ) => {
    setForceClose((prevState) => {
      // const index = segmentIdx ? segmentIdx : segmentsIdx;
      // let newValue: boolean | boolean[];
      // if (dropdown === "airportDropdown" || dropdown === "datePicker") {
      //   newValue = [...prevState[dropdown]];
      //   newValue[index] = value;
      // } else {
      //   newValue = value;
      // }
      return {
        ...prevState,
        [dropdown]: value,
      };
    });
  };

  const setCurrentDropDown = (
    dropdown: string,
    value: boolean
    // segmentIdx: number | undefined
  ) => {
    console.log(dropdown, value, ">2");

    setShowDropdown((prevState) => {
      // const index = segmentIdx ? segmentIdx : segmentsIdx;
      // let newValue: boolean | boolean[];
      // if (dropdown === "airportDropdown" || dropdown === "datePicker") {
      //   newValue = [...prevState[dropdown]];
      //   newValue[index] = value;
      // } else {
      //   newValue = value;
      // }
      return {
        ...prevState,
        [dropdown]: value,
      };
    });
  };

  const onFocus =
    (prefix: string, dropdown: string, segmentIdx: number) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {
      clearSearchKey();
      setSegmentsIdx(segmentIdx);
      const currentRef = inputRef.current[prefix];
      const inputElement = Array.isArray(currentRef)
        ? currentRef[segmentIdx]
        : currentRef;
      if (dropdown === "datePicker" || !input.tripType.roundTrip) {
        dateBorderRef.current?.classList.add("active-border");
      } else {
        if (!input.tripType.multiCity) normalizeDateBorder();
      }
      inputElement?.classList.add("focused-input");
      const updateForceClose: ISearchFlightFormDropdown = {
        airportDropdown: true,
        datePicker: true,
        passengerDropdown: true,
        travelClassDropdown: true,
      };
      if (dropdown) updateForceClose[dropdown] = false;
      console.log(updateForceClose, ">1");

      setForceClose(updateForceClose);
      if (dropdown === "datePicker") {
        (inputElement as HTMLInputElement)?.select();
      }
      for (const key in inputRef.current) {
        const inputRefArr = inputRef.current[key];
        if (inputRefArr) {
          if (Array.isArray(inputRefArr)) {
            inputRefArr.forEach((value) => {
              if (value.id !== inputElement?.id) {
                value.classList.remove("focused-input");
              }
            });
          } else {
            if (inputRefArr.id !== inputElement?.id) {
              inputRefArr.classList.remove("focused-input");
            }
          }
        }
      }
      if (dropdown === "airportDropdown") {
        setAirportListDropdowntype(`${prefix}-${segmentIdx}`);
      }
      if (dropdown === "datePicker") {
        setCalendarType(`${prefix}-${segmentIdx}`);
      }
      if (dropdown) setCurrentDropDown(dropdown, true);
    };

  const onBlurPromoCode = (event: React.FocusEvent<HTMLInputElement>): void => {
    (inputRef.current.promoCode as HTMLInputElement)?.classList.remove(
      "focused-input"
    );
  };

  const handleHideDropdown = (dropdown: string): void => {
    console.log("ends");

    setCurrentForceClose(dropdown, false);
    setCurrentDropDown(dropdown, false);
  };

  const normalizeDateBorder = (): void => {
    dateBorderRef.current?.classList.remove("active-border");
  };

  const changeOriginDestination = (
    prefix: string,
    value: IAirportList
  ): void => {
    prefix = prefix.split("-")[0];
    const currentInputRef = inputRef.current[prefix];
    if (Array.isArray(currentInputRef)) {
      currentInputRef[segmentsIdx]?.classList.remove("focused-input");
    }
    setInput((prevState) => {
      const segmentsValue = prevState.segments.map((segment, index) => {
        if (index === segmentsIdx) {
          return { ...segment, [prefix]: value };
        } else {
          return { ...segment };
        }
      });
      return { ...prevState, segments: segmentsValue };
    });
    clearSearchKey();
    setCurrentForceClose("airportDropdown", true);
  };

  const changeInitDepartureDate = (): void => {
    setIsInitDepartureDate((prevState) => {
      const isInitValues = prevState.map((v, i) => {
        if (i === segmentsIdx) {
          return false;
        } else {
          return v;
        }
      });
      return isInitValues;
    });
  };

  const changeDepartureReturnDate = (prefix: string, date: Date): void => {
    prefix = prefix.split("-")[0];
    if (prefix === "departure") {
      if (isInitDepartureDate[segmentsIdx]) changeInitDepartureDate();
    }
    if (prefix === "return" && !input.tripType.multiCity) {
      if (isInitDepartureDate[0]) changeInitDepartureDate();
      if (isInitReturnDate) setIsInitReturnDate(false);
    }
    const currentInputRef = inputRef.current[prefix];
    if (Array.isArray(currentInputRef)) {
      currentInputRef[segmentsIdx]?.classList.remove("focused-input");
    } else {
      currentInputRef?.classList.remove("focused-input");
    }
    normalizeDateBorder();
    if (prefix === "departure") {
      const isHigherThanReturn =
        date >
        new Date(
          `${input.returnDate.getFullYear()}-${
            input.returnDate.getMonth() + 1
          }-${input.returnDate.getDate()}`
        );
      setInput((prevState) => {
        const segmentsValue = [...prevState.segments];
        segmentsValue[segmentsIdx].departureDate = date;
        return {
          ...prevState,
          segments: segmentsValue,
          returnDate:
            !input.tripType.multiCity && isHigherThanReturn
              ? date
              : prevState.returnDate,
        };
      });
    }
    if (prefix === "return") {
      setInput((prevState) => {
        return {
          ...prevState,
          returnDate: date,
        };
      });
    }
    setCurrentForceClose("datePicker", true);
  };

  const changePassenger = (
    passenger: ISearchFlightFormInputStates["passenger"]
  ): void => {
    setInput({ ...input, passenger });
  };

  const changeTravelClass = (index: number): void => {
    setInput({ ...input, travelClass: defaultTravelClass[index] });
    setCurrentForceClose("travelClassDropdown", true);
  };

  const handleAddSegment = () => {
    if (input.segments.length < 5) {
      setInput((prevState) => {
        const newSegments = [
          ...prevState.segments,
          {
            origin: defaultAirport,
            destination: defaultAirport,
            departureDate: initDate,
          },
        ];
        return {
          ...prevState,
          segments: newSegments,
        };
      });
      setSearchKey((prevState) => {
        return [
          ...prevState,
          {
            origin: "",
            destination: "",
          },
        ];
      });
      setIsInitDepartureDate((prevState) => {
        return [...prevState, true];
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "nonStop") {
      setInput((prevState) => {
        return {
          ...prevState,
          nonStop: !prevState.nonStop,
        };
      });
    }
    if (name === "tripType") {
      setInput((prevState) => {
        return {
          ...prevState,
          tripType: {
            oneWay: value === "oneWay" ? true : false,
            roundTrip: value === "roundTrip" ? true : false,
            multiCity: value === "multiCity" ? true : false,
          },
          segments:
            value === "multiCity"
              ? [...prevState.segments].concat(
                  Array(2).fill({
                    origin: defaultAirport,
                    destination: defaultAirport,
                    departureDate: initDate,
                  })
                )
              : [prevState.segments[0]],
          returnDate: prevState.segments[0].departureDate,
        };
      });
      setSearchKey(
        Array(3).fill({
          origin: "",
          destination: "",
        })
      );
      if (value === "oneWay" || value === "roundTrip") {
        setIsInitReturnDate(true);
        setIsInitDepartureDate((prevState) => {
          return [prevState[0]];
        });
        /**
         * This one to prevent bug that happens if the return datepicker is open then
         * the tripType change, the forceClose will not passed to the return datePicker
         * element because it just deleted. The forceClose will not trigger handleHideDropdown
         * so the showDropdown.datePicker won't set to false. When the return datePicker shown
         * again it will not open the dropdown when it's being focused
         */
        if (value === "oneWay" && showDropdown.datePicker) {
          setShowDropdown((prevState) => {
            const result = { ...prevState };
            result.datePicker = false;
            return result;
          });
        }
      }
      if (value === "multiCity") {
        setIsInitDepartureDate((prevState) => {
          return [prevState[0], true, true];
        });
      }
    }
    if (name === "promoCode") {
      setInput((prevState) => {
        return {
          ...prevState,
          promoCode: value,
        };
      });
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    let tripType = "";
    for (const key in input.tripType) {
      if (input.tripType[key]) {
        tripType += "1";
      } else {
        tripType += "0";
      }
    }
    // const url = `/flight?origin=${input.origin.code}&destination=${
    //   input.destination.code
    // }&date=${
    //   dateToStringAmadeus(input.departureDate) +
    //   "." +
    //   dateToStringAmadeus(input.returnDate)
    // }&ps=${
    //   input.passenger.adults +
    //   "." +
    //   input.passenger.children +
    //   "." +
    //   input.passenger.infants
    // }&tc=${input.travelClass.value}&dir=${input.nonStop}&tt=${tripType}`;
    // router.push(url);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <br />
        <div className="c-row-ssb">
          <div
            className={
              styles.col +
              " c-form-group c-form-floating inc-img c-radio-group c-fg-ssb mb-3"
            }
            style={{ display: "flex" }}
          >
            <label htmlFor="radioOW" className={styles["radio"]}>
              {t("oneWay")}
              <input
                type="radio"
                id="radioOW"
                name="tripType"
                value="oneWay"
                checked={input.tripType.oneWay}
                onChange={handleChange}
              />
              <span className={styles["radiomark"]}></span>
            </label>
            <label
              htmlFor="radioRT"
              className={styles["radio"]}
              style={{ marginLeft: 12 }}
            >
              {t("roundTrip")}
              <input
                type="radio"
                id="radioRT"
                name="tripType"
                value="roundTrip"
                checked={input.tripType.roundTrip}
                onChange={handleChange}
              />
              <span className={styles["radiomark"]}></span>
            </label>
            <label
              htmlFor="radioMC"
              className={styles["radio"]}
              style={{ marginLeft: 12 }}
            >
              {t("multiCity")}
              <input
                type="radio"
                id="radioMC"
                name="tripType"
                value="multiCity"
                checked={input.tripType.multiCity}
                onChange={handleChange}
              />
              <span className={styles["radiomark"]}></span>
            </label>
            <div style={{ flexGrow: 1 }}></div>
            <label htmlFor="nonStop" className={styles["checkbox"]}>
              {t("directFlights")}
              <input
                type="checkbox"
                id="nonStop"
                name="nonStop"
                checked={input.nonStop}
                onChange={handleChange}
              />
              <span className={styles["checkmark"]}>
                <MdDone />
              </span>
            </label>
          </div>
        </div>
        {input.segments.map((segment, segmentIdx) => {
          return (
            <div
              key={`segment-${segmentIdx}`}
              className="c-row-ssb"
              style={{ position: "relative" }}
            >
              <div
                className={
                  styles.col +
                  " c-form-group c-form-floating inc-img c-fg-ssb mb-3"
                }
                style={{ width: "calc(100%/3)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className=""
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "calc(50% - 14px)",
                  }}
                >
                  <Image
                    src={flightIcon}
                    height={24}
                    alt="Depart from"
                    style={{ transform: "rotate(-45deg)", opacity: 0.85 }}
                  />
                </div>
                <input
                  ref={(element) => {
                    if (element) {
                      if (Array.isArray(inputRef.current.origin)) {
                        inputRef.current.origin[segmentIdx] = element;
                      } else {
                        inputRef.current.origin = [element];
                      }
                    }
                  }}
                  id={`SSBOrigin-${segmentIdx}`}
                  className="c-form-control"
                  placeholder="Origin"
                  autoComplete="off"
                  name={`origin-${segmentIdx}`}
                  value={searchKey[segmentIdx].origin}
                  onChange={handleChangeSearchKey}
                  onFocus={onFocus("origin", "airportDropdown", segmentIdx)}
                />
                <input
                  className="c-form-control-mask"
                  value={getOriginOrDestinationValue(segment.origin)}
                  readOnly
                  disabled
                  placeholder="Origin"
                />
                <div className="c-control-label-wrapper">
                  <label className="c-control-label">{t("from")}</label>
                </div>
                {showDropdown.airportDropdown &&
                airportListDropdowntype === `origin-${segmentIdx}` ? (
                  <AirportListDropdown
                    ref={childrenRef.current.airportListDropdownRef}
                    airportList={airportList}
                    airportListDropdowntype="origin"
                    origin={segment.origin}
                    destination={segment.destination}
                    handleChange={changeOriginDestination}
                    hideDropdown={() => handleHideDropdown("airportDropdown")}
                    forceClose={forceClose.airportDropdown}
                    searchKey={searchKey[segmentIdx].origin}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div
                className={
                  styles.col +
                  " c-form-group c-form-floating inc-img c-fg-ssb mb-3"
                }
                style={{ width: "calc(100%/3)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "calc(50% - 14px)",
                  }}
                >
                  <Image
                    src={flightIcon}
                    height={24}
                    alt="Flying to"
                    style={{ opacity: 0.85 }}
                  />
                </div>
                <input
                  ref={(element) => {
                    if (element) {
                      if (Array.isArray(inputRef.current.destination)) {
                        inputRef.current.destination[segmentIdx] = element;
                      } else {
                        inputRef.current.destination = [element];
                      }
                    }
                  }}
                  id={`SSBDestination-${segmentIdx}`}
                  className="c-form-control"
                  placeholder="Destination"
                  autoComplete="off"
                  name={`destination-${segmentIdx}`}
                  value={searchKey[segmentIdx].destination}
                  onChange={handleChangeSearchKey}
                  onFocus={onFocus(
                    "destination",
                    "airportDropdown",
                    segmentIdx
                  )}
                />
                <input
                  className="c-form-control-mask"
                  value={getOriginOrDestinationValue(segment.destination)}
                  readOnly
                  disabled
                  placeholder="Destination"
                />
                <div className="c-control-label-wrapper">
                  <label className="c-control-label">{t("to")}</label>
                </div>
                {showDropdown.airportDropdown &&
                airportListDropdowntype === `destination-${segmentIdx}` ? (
                  <AirportListDropdown
                    ref={childrenRef.current.airportListDropdownRef}
                    airportList={airportList}
                    airportListDropdowntype="destination"
                    origin={segment.origin}
                    destination={segment.destination}
                    handleChange={changeOriginDestination}
                    hideDropdown={() => handleHideDropdown("airportDropdown")}
                    forceClose={forceClose.airportDropdown}
                    searchKey={searchKey[segmentIdx].destination}
                  />
                ) : (
                  <></>
                )}
              </div>
              <div
                className="c-date-group-ssb mb-3"
                style={{
                  width:
                    input.tripType.oneWay || input.tripType.multiCity
                      ? "calc(100%/3)"
                      : "auto",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div
                  className={
                    styles.col +
                    " c-form-group c-form-floating inc-img c-fg-ssb mb-0"
                  }
                  style={{ cursor: "pointer" }}
                >
                  <div
                    style={{
                      display: "flex",
                      position: "absolute",
                      right: 8,
                      top: "calc(50% - 12px)",
                    }}
                  >
                    <VscCalendar size={24} style={{ color: "#9a9c9f" }} />
                  </div>
                  <input
                    ref={(element) => {
                      if (element) {
                        if (Array.isArray(inputRef.current.departure)) {
                          inputRef.current.departure[segmentIdx] = element;
                        } else {
                          inputRef.current.departure = [element];
                        }
                      }
                    }}
                    id={`SSBDeparture-${segmentIdx}`}
                    className={
                      "c-form-control departure-date-input" +
                      (isInitDepartureDate ? "" : " active-border")
                    }
                    style={{
                      borderTopRightRadius:
                        input.tripType.oneWay || input.tripType.multiCity
                          ? 4
                          : 0,
                      borderBottomRightRadius:
                        input.tripType.oneWay || input.tripType.multiCity
                          ? 4
                          : 0,
                      borderRight:
                        input.tripType.oneWay || input.tripType.multiCity
                          ? ""
                          : "none",
                    }}
                    value={
                      isInitDepartureDate[segmentIdx]
                        ? ""
                        : dateToStringWithSlash(segment.departureDate)
                    }
                    placeholder="Departure"
                    autoComplete="off"
                    onFocus={onFocus("departure", "datePicker", segmentIdx)}
                    onChange={() => {}}
                  />
                  <div className="c-control-label-wrapper">
                    <label className="c-control-label">
                      {t("departureDate")}
                    </label>
                  </div>
                  {showDropdown.datePicker &&
                    calendarType === `departure-${segmentIdx}` && (
                      <DatePickerV1
                        ref={childrenRef.current.datePickerRef}
                        calendarType="departure"
                        departureDate={segment.departureDate}
                        returnDate={input.returnDate}
                        handleChange={changeDepartureReturnDate}
                        hideCalendar={() => handleHideDropdown("datePicker")}
                        forceClose={forceClose.datePicker}
                      />
                    )}
                </div>
                {input.tripType.roundTrip &&
                  !input.tripType.multiCity &&
                  segmentIdx === 0 && (
                    <>
                      <div ref={dateBorderRef} className="date-border"></div>
                      <div
                        className={
                          styles.col +
                          " c-form-group c-form-floating inc-img c-fg-ssb mb-0"
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            position: "absolute",
                            right: 8,
                            top: "calc(50% - 12px)",
                          }}
                        >
                          <VscCalendar size={24} style={{ color: "#9a9c9f" }} />
                        </div>
                        <input
                          ref={(element) => {
                            inputRef.current.return = element;
                          }}
                          id="SSBReturn"
                          className={
                            "c-form-control return-date-input" +
                            (isInitReturnDate ? "" : " active-border")
                          }
                          style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                          }}
                          value={
                            isInitReturnDate
                              ? ""
                              : dateToStringWithSlash(input.returnDate)
                          }
                          placeholder="Return"
                          autoComplete="off"
                          onFocus={onFocus("return", "datePicker", segmentIdx)}
                          onChange={() => {}}
                        />
                        <div className="c-control-label-wrapper">
                          <label className="c-control-label">
                            {t("returnDate")}
                          </label>
                        </div>
                        {showDropdown.datePicker &&
                          calendarType === `return-${segmentIdx}` && (
                            <DatePickerV1
                              ref={childrenRef.current.datePickerRef}
                              calendarType="return"
                              departureDate={segment.departureDate}
                              returnDate={input.returnDate}
                              handleChange={changeDepartureReturnDate}
                              hideCalendar={() =>
                                handleHideDropdown("datePicker")
                              }
                              forceClose={forceClose.datePicker}
                            />
                          )}
                      </div>
                    </>
                  )}
              </div>
            </div>
          );
        })}
        {input.tripType.multiCity && input.segments.length < 5 ? (
          <div className={styles["add-segment-wrapper"]}>
            <button
              type="button"
              className="c-btn mb-4"
              onClick={handleAddSegment}
            >
              <span className="c-icon-wrapper">
                <IoAddCircle size={24} />
              </span>
              Add Another Flights
            </button>
          </div>
        ) : (
          <></>
        )}
        <div className="c-row-ssb" style={{ position: "relative" }}>
          <div
            className={
              styles.col + " c-form-group c-form-floating inc-img c-fg-ssb mb-2"
            }
            style={{
              width: inputDynamicWidth,
              minWidth: inputDynamicWidth,
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                right: 8,
                top: "calc(50% - 12px)",
              }}
            >
              <MdOutlineMan size={24} style={{ color: "#9a9c9f" }} />
            </div>
            <input
              ref={(element) => {
                inputRef.current.passenger = element;
              }}
              id={styles.SSBPassenger}
              className="c-form-control"
              placeholder="Passenger"
              autoComplete="off"
              value={getPassengerValue()}
              onChange={() => {}}
              onFocus={onFocus("passenger", "passengerDropdown", segmentsIdx)}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("passenger")}</label>
            </div>
            <DropdownTransition
              ref={childrenRef.current.dropdownTransitionRef}
              shouldRender={showDropdown.passengerDropdown}
              hideDropdown={() => handleHideDropdown("passengerDropdown")}
              forceClose={forceClose.passengerDropdown}
              width={300}
            >
              <PassengerDropdown
                inputPassenger={input.passenger}
                changePassenger={changePassenger}
              />
            </DropdownTransition>
          </div>
          <div
            className={
              styles.col + " c-form-group c-form-floating inc-img c-fg-ssb mb-2"
            }
            style={{
              width: inputDynamicWidth,
              minWidth: inputDynamicWidth,
            }}
          >
            <div
              style={{
                display: "flex",
                position: "absolute",
                right: 8,
                top: "calc(50% - 12px)",
              }}
            >
              <MdOutlineAirlineSeatReclineExtra
                size={24}
                style={{ color: "#9a9c9f" }}
              />
            </div>
            <input
              ref={(element) => {
                inputRef.current.travelClass = element;
              }}
              id={styles.SSBTravelClass}
              className="c-form-control"
              placeholder="Travel Class"
              autoComplete="off"
              value={input.travelClass.display}
              onChange={() => {}}
              onFocus={onFocus(
                "travelClass",
                "travelClassDropdown",
                segmentsIdx
              )}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("travelClass")}</label>
            </div>
            <DropdownTransition
              ref={childrenRef.current.dropdownTransitionRef}
              shouldRender={showDropdown.travelClassDropdown}
              hideDropdown={() => handleHideDropdown("travelClassDropdown")}
              forceClose={forceClose.travelClassDropdown}
            >
              <TravelClassDropdown
                travelClass={input.travelClass}
                changeTravelClass={changeTravelClass}
              />
            </DropdownTransition>
          </div>
          <div
            className={
              styles.col + " c-form-group c-form-floating inc-img c-fg-ssb mb-2"
            }
            style={{
              width: "100%",
            }}
          >
            <input
              ref={(element) => {
                inputRef.current.promoCode = element;
              }}
              id={styles.SSBPromoCode}
              className="c-form-control"
              placeholder="Promo Code"
              autoComplete="off"
              name="promoCode"
              value={input.promoCode}
              onChange={handleChange}
              onFocus={onFocus("promoCode", "", segmentsIdx)}
              onBlur={onBlurPromoCode}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("promoCode")}</label>
            </div>
          </div>
          <div
            className={
              styles.col + " c-form-group c-form-floating inc-img c-fg-ssb mb-2"
            }
            style={{
              width: "100%",
            }}
          >
            <button id={styles.SSBFlightSubmit} className="c-btn" type="submit">
              Search Flight
            </button>
          </div>
        </div>
      </form>
    </>
  );
};

export default SearchFlightForm;

// // const isoDurationToHoursMinutes = (duration) => {
// //   const durationSeconds = moment.duration(duration).asSeconds();
// //   const hours = Math.floor(durationSeconds / 3600);
// //   const minutes = Math.floor((durationSeconds % 3600) / 60);
// //   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// // };

// // // Example usage:
// // const duration = "PT17H30M";
// // const durationStr = isoDurationToHoursMinutes(duration);
// // console.log(durationStr); // Output: "17:30"

// const isoDurationToHoursMinutes = (duration) => {
//   const durationSeconds = moment.duration(duration).asSeconds();
//   const hours = Math.floor(durationSeconds / 3600);
//   const minutes = Math.floor((durationSeconds % 3600) / 60);
//   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
// };

// // Example usage:
// const duration = "PT17H30M";
// const durationStr = isoDurationToHoursMinutes(duration);
// console.log(durationStr); // Output: "17:30"
