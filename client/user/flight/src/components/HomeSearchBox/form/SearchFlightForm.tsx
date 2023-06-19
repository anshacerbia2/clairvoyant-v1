"use client";
import styles from "@/styles/SearchFlightForm.module.scss";
import React, {
  useEffect,
  useReducer,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import axios, { AxiosResponse } from "axios";
// Reducer
import searchFlightFormReducer, {
  createInitialState,
} from "@/reducer/searchFlightForm.reducer";
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
  ISegmentsStates,
  defaultAirport,
  defaultTravelClass,
} from "@/models/search-flight-form.model";
import type {
  IAirportsOrAreas,
  ISearchFlightFormChildrenRef,
  ISearchFlightFormInputStates,
  ISearchFlightFormDropdown,
} from "@/models/search-flight-form.model";

import {
  addIsInitDepartureDate,
  addSearchKey,
  addSegments,
  forceCloseAll,
  forceCloseAllWithException,
  forceCloseCurrent,
  resetIsInitDepartureDate,
  resetSearchKey,
  resetSegments,
  setPopularAirportList,
  setAirportListDropdowntype,
  setCalendarType,
  setInputDynamicWidth,
  setIsInitDepartureDate,
  setIsInitReturnDate,
  setNonStop,
  setPassenger,
  setPromoCode,
  setReturnDate,
  setSearchKey,
  setSegmentIdx,
  setSegments,
  setTravelClass,
  setTripType,
  showDropdownCurrent,
  setFilteredAirportList,
} from "@/reducer/searchFlightForm.actions";
import { useDebounce } from "@/hooks";
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

  const [state, dispatch] = useReducer(
    searchFlightFormReducer,
    null,
    createInitialState
  );

  // useEffect((): void | (() => void) => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key == "Tab") {
  //       event.preventDefault();
  //     }
  //   };
  //   document.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, []);

  useEffect((): void => {
    const fetchAirportList = async () => {
      // const response: AxiosResponse<IAirportsOrAreas[]> = await axios.get<
      //   IAirportsOrAreas[]
      // >("http://localhost:4002/airport-list-popular");

      const response = await axios.get(
        "http://localhost:4002/airports-and-areas/popular"
      );
      if (response.status === 200) {
        // response.data.forEach((obj) => {
        //   if (obj.airports) {
        //     obj.airports = JSON.parse(obj.airports);
        //   }
        // });
        console.log(response.data);

        dispatch(setPopularAirportList(response.data));
      }
    };
    fetchAirportList();
  }, []);

  const debouncedSearchKey = useDebounce(state!.searchKey, 200);

  const fetchFilteredAirportList = async () => {
    const searchKey = debouncedSearchKey[state!.segmentIdx];
    const key = searchKey.origin || searchKey.destination;

    if (key) {
      const response = await axios.get(
        `http://localhost:4002/airports-and-areas?search=${key}`
      );
      if (response.status === 200) {
        console.log(response.data);
        dispatch(setFilteredAirportList(response.data));
      }
    }
  };

  useEffect(() => {
    fetchFilteredAirportList();
  }, [debouncedSearchKey]);

  useEffect((): void | (() => void) => {
    if (
      state!.showDropdown.airportDropdown ||
      state!.showDropdown.datePicker ||
      state!.showDropdown.passengerDropdown ||
      state!.showDropdown.travelClassDropdown
    ) {
      const handleClickOutside: EventListener = (event: Event): void => {
        const target = event.target as HTMLElement;
        // Notes: for checking closest element id using regex (return boolean)
        // const regexOrigin = /^SSBOrigin-[0-4]$/;
        // const regexDestination = /^SSBDestination-[0-4]$/;
        // const regexDeparture = /^SSBDeparture-[0-4]$/;
        // const mergedRegex = new RegExp(
        //   `${regexOrigin.source}|${regexDestination.source}|${regexDeparture.source}`
        // );
        // or:
        // const mergedRegex2 = new RegExp(
        //   `^SSBOrigin-[0-4]$|^SSBDestination-[0-4]$|^SSBDeparture-[0-4]$`
        // );
        const closestElement = target.closest(
          "[id^='SSBOrigin-'], [id^='SSBDestination-'], [id^='SSBDeparture-']"
        );
        const airportDropdownEleId = `#${childrenRef.current.airportListDropdownRef.current?.id}`;
        const datePickerEleId = `#${childrenRef.current.datePickerRef.current?.id}`;
        const dropdownTransitionEleId = `#${childrenRef.current.dropdownTransitionRef.current?.id}`;
        let isNotTarget = true;

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
          isNotTarget &&
          !closestElement &&
          target.id !== airportDropdownEleId &&
          target.id !== datePickerEleId &&
          target.id !== dropdownTransitionEleId &&
          !target.closest(airportDropdownEleId) &&
          !target.closest(datePickerEleId) &&
          !target.closest(dropdownTransitionEleId)
        ) {
          console.log("clicked outside >>>>>>>>>>");
          clearSearchKey();
          normalizeDateBorder();
          removeFocusedInputClassName();
          dispatch(forceCloseAll(state!.forceClose));
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [state!.showDropdown]);

  useEffect((): void => {
    const originRef = inputRef.current.origin;
    const originWidth = Array.isArray(originRef)
      ? originRef[0]?.offsetWidth
      : originRef?.offsetWidth;
    if (originWidth) {
      dispatch(setInputDynamicWidth(originWidth));
    }
  }, [state!.tripType]);

  /*
   ** Input with dropdown UI/UX (Require DOM manipulation)
   ** Since these elements binded with focus, blur and click event,
   ** and the CSS (only) cannot give the expected result, we need to manipulate the DOM
   */
  const removeFocusedInputClassName = (
    currentTarget?: HTMLInputElement | null
  ) => {
    for (const key in inputRef.current) {
      const inputRefArr = inputRef.current[key];
      if (inputRefArr) {
        if (Array.isArray(inputRefArr)) {
          inputRefArr.forEach((element) => {
            if (element !== currentTarget) {
              element.classList.remove("focused-input");
            }
          });
        } else {
          if (inputRefArr !== currentTarget) {
            inputRefArr.classList.remove("focused-input");
          }
        }
      }
    }
  };

  const getOriginOrDestinationValue = (value: IAirportsOrAreas): string => {
    const { id, location, country, name, code } = value;
    return id ? `${location} (${code}), ${name}, ${country}` : "";
  };

  const getPassengerValue = (): string => {
    return `${state!.passenger.adults} Adults, ${
      state!.passenger.children
    } Children, ${state!.passenger.infants} Infants`;
  };

  const handleChangeSearchKey = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    dispatch(
      setSearchKey(
        event.target.name.split("-")[0],
        event.target.value,
        state!.segmentIdx,
        state!.searchKey
      )
    );
  };

  const clearSearchKey = (): void => {
    dispatch(resetSearchKey(state!.searchKey));
  };

  const setCurrentDropDown = (
    dropdown: string,
    value: boolean
    // segmentIdx: number | undefined
  ) => {
    console.log(dropdown, value, ">2");
    dispatch(showDropdownCurrent(dropdown, value, state!.showDropdown));
  };

  const handleHideDropdown = (dropdown: string): void => {
    setCurrentForceClose(dropdown, false);
    setCurrentDropDown(dropdown, false);
    if (dropdown === "airportDropdown") {
      const prefix = state!.airportListDropdowntype.split("-")[0];
      const input = inputRef.current[prefix];
      if (input && Array.isArray(input)) {
        const element = input[state!.segmentIdx];
        if (element) {
          element.blur();
        }
      }
    }
  };

  const setCurrentForceClose = (dropdown: string, value: boolean) => {
    dispatch(forceCloseCurrent(dropdown, value, state!.forceClose));
  };

  const changeInitDepartureDate = (): void => {
    dispatch(
      setIsInitDepartureDate(state!.segmentIdx, state!.isInitDepartureDate)
    );
  };

  const normalizeDateBorder = (): void => {
    dateBorderRef.current?.classList.remove("active-border");
  };

  const onFocus =
    (prefix: string, dropdown: string, segmentIdx: number) =>
    (event: React.FocusEvent<HTMLInputElement>): void => {
      clearSearchKey();
      dispatch(setSegmentIdx(segmentIdx));
      const currentRef = inputRef.current[prefix];
      const inputElement = Array.isArray(currentRef)
        ? currentRef[segmentIdx]
        : currentRef;
      if (dropdown === "datePicker" || !state!.tripType.roundTrip) {
        dateBorderRef.current?.classList.add("active-border");
      } else {
        if (!state!.tripType.multiCity) normalizeDateBorder();
      }
      inputElement?.classList.add("focused-input");
      const updateForceClose: ISearchFlightFormDropdown = {
        airportDropdown: true,
        datePicker: true,
        passengerDropdown: true,
        travelClassDropdown: true,
      };
      if (dropdown) updateForceClose[dropdown] = false;
      dispatch(forceCloseAllWithException(updateForceClose));
      if (dropdown === "datePicker") {
        (inputElement as HTMLInputElement)?.select();
      }
      removeFocusedInputClassName(inputElement);
      if (dropdown === "airportDropdown") {
        dispatch(setAirportListDropdowntype(`${prefix}-${segmentIdx}`));
      }
      if (dropdown === "datePicker") {
        dispatch(setCalendarType(`${prefix}-${segmentIdx}`));
      }
      if (dropdown) setCurrentDropDown(dropdown, true);
    };

  const onBlurAirportOriginDestination = () => {
    dispatch(resetSearchKey(state!.searchKey));
  };

  const onBlurPromoCode = (event: React.FocusEvent<HTMLInputElement>): void => {
    (inputRef.current.promoCode as HTMLInputElement)?.classList.remove(
      "focused-input"
    );
  };

  const changeOriginDestination = (
    prefix: string,
    value: IAirportsOrAreas
  ): void => {
    prefix = prefix.split("-")[0];
    const currentInputRef = inputRef.current[prefix];
    if (Array.isArray(currentInputRef)) {
      currentInputRef[state!.segmentIdx]?.classList.remove("focused-input");
    }
    console.log(
      setSegments(prefix, value, state!.segmentIdx, state!.segments),
      "ini"
    );
    dispatch(setSegments(prefix, value, state!.segmentIdx, state!.segments));
    clearSearchKey();
    setCurrentForceClose("airportDropdown", true);
  };

  const changeDepartureReturnDate = (prefix: string, date: Date): void => {
    prefix = prefix.split("-")[0];
    if (prefix === "departure") {
      if (state!.isInitDepartureDate[state!.segmentIdx])
        changeInitDepartureDate();
    }
    if (prefix === "return" && !state!.tripType.multiCity) {
      if (state!.isInitDepartureDate[0]) changeInitDepartureDate();
      if (state!.isInitReturnDate) dispatch(setIsInitReturnDate(false));
    }
    const currentInputRef = inputRef.current[prefix];
    if (Array.isArray(currentInputRef)) {
      currentInputRef[state!.segmentIdx]?.classList.remove("focused-input");
    } else {
      currentInputRef?.classList.remove("focused-input");
    }
    normalizeDateBorder();
    if (prefix === "departure") {
      const isHigherThanReturn =
        date >
        new Date(
          `${state!.returnDate.getFullYear()}-${
            state!.returnDate.getMonth() + 1
          }-${state!.returnDate.getDate()}`
        );
      dispatch(
        setSegments(
          "departureDate",
          null,
          state!.segmentIdx,
          state!.segments,
          date
        )
      );
      if (!state!.tripType.multiCity && isHigherThanReturn) {
        dispatch(setReturnDate(date));
      }
    }
    if (prefix === "return") {
      dispatch(setReturnDate(date));
    }
    setCurrentForceClose("datePicker", true);
  };

  const changePassenger = (
    passenger: ISearchFlightFormInputStates["passenger"]
  ): void => {
    dispatch(setPassenger(passenger));
  };

  const changeTravelClass = (index: number): void => {
    dispatch(setTravelClass(index));
    setCurrentForceClose("travelClassDropdown", true);
  };

  const handleAddSegment = () => {
    if (state!.segments.length < 5) {
      dispatch(addSegments());
      dispatch(addSearchKey());
      dispatch(addIsInitDepartureDate());
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const name = event.target.name;
    const value = event.target.value;
    if (name === "nonStop") {
      dispatch(setNonStop());
    }
    if (name === "tripType") {
      dispatch(setTripType(value));
      if (value === "multiCity") {
        dispatch(addSegments());
        dispatch(addSegments());
        dispatch(addIsInitDepartureDate());
        dispatch(addIsInitDepartureDate());
        dispatch(addSearchKey());
        dispatch(addSearchKey());
      }
      dispatch(setReturnDate(state!.segments[0].departureDate));
      if (value === "oneWay" || value === "roundTrip") {
        dispatch(resetSegments());
        dispatch(setSegmentIdx(0));
        dispatch(resetIsInitDepartureDate());
        dispatch(setIsInitReturnDate(true));
        dispatch(resetSearchKey([state!.searchKey[0]]));
        /**
         * This one to prevent bug that happens if the return datepicker is open then
         * the tripType change, the forceClose will not passed to the return datePicker
         * element because it just deleted. The forceClose will not trigger handleHideDropdown
         * so the showDropdown.datePicker won't set to false. When the return datePicker shown
         * again it will not open the dropdown when it's being focused
         */
        if (value === "oneWay" && state!.showDropdown.datePicker) {
          dispatch(
            showDropdownCurrent("datePicker", false, state!.showDropdown)
          );
        }
      }
    }
    if (name === "promoCode") {
      dispatch(setPromoCode(value));
    }
  };

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (
    event
  ) => {
    event.preventDefault();
    let tripType = "";
    for (const key in state!.tripType) {
      if (state!.tripType[key]) {
        tripType += "1";
      } else {
        tripType += "0";
      }
    }
    // const url = `/flight?origin=${state.origin.code}&destination=${
    //   state.destination.code
    // }&date=${
    //   dateToStringAmadeus(state.departureDate) +
    //   "." +
    //   dateToStringAmadeus(state.returnDate)
    // }&ps=${
    //   state.passenger.adults +
    //   "." +
    //   state.passenger.children +
    //   "." +
    //   state.passenger.infants
    // }&tc=${state.travelClass.value}&dir=${state.nonStop}&tt=${tripType}`;
    // router.push(url);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <br />
        {/* Start - Triptype Component */}
        <div className="c-row-ssb">
          <div
            className={
              styles.col + " c-form-group c-form-floating inc-img c-radio-group"
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
                checked={state!.tripType.oneWay}
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
                checked={state!.tripType.roundTrip}
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
                checked={state!.tripType.multiCity}
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
                checked={state!.nonStop}
                onChange={handleChange}
              />
              <span className={styles["checkmark"]}>
                <MdDone />
              </span>
            </label>
          </div>
        </div>
        {/* End - Triptype Component */}
        {/* Start - Segments Component */}
        {state!.segments
          .slice(0, 5)
          .map((segment: ISegmentsStates, segmentIdx: number) => {
            return (
              <div
                key={`segment-${segmentIdx}`}
                className="c-row-ssb"
                style={{ position: "relative" }}
              >
                <div
                  id={`SSBOrigin-${segmentIdx}`}
                  className={
                    styles.col + " c-form-group c-form-floating inc-img"
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
                    className="c-form-control"
                    placeholder="Origin"
                    autoComplete="off"
                    name={`origin-${segmentIdx}`}
                    value={state!.searchKey[segmentIdx].origin}
                    onChange={handleChangeSearchKey}
                    onFocus={onFocus("origin", "airportDropdown", segmentIdx)}
                    onBlur={onBlurAirportOriginDestination}
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
                  {state!.showDropdown.airportDropdown &&
                  state!.airportListDropdowntype === `origin-${segmentIdx}` ? (
                    <AirportListDropdown
                      ref={childrenRef.current.airportListDropdownRef}
                      popularAirportList={state!.popularAirportList}
                      filteredAirportList={state!.filteredAirportList}
                      airportListDropdowntype="origin"
                      origin={segment.origin}
                      destination={segment.destination}
                      handleChange={changeOriginDestination}
                      hideDropdown={() => handleHideDropdown("airportDropdown")}
                      forceClose={state!.forceClose.airportDropdown}
                      searchKey={debouncedSearchKey[segmentIdx].origin}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  id={`SSBDestination-${segmentIdx}`}
                  className={
                    styles.col + " c-form-group c-form-floating inc-img"
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
                    className="c-form-control"
                    placeholder="Destination"
                    autoComplete="off"
                    name={`destination-${segmentIdx}`}
                    value={state!.searchKey[segmentIdx].destination}
                    onChange={handleChangeSearchKey}
                    onFocus={onFocus(
                      "destination",
                      "airportDropdown",
                      segmentIdx
                    )}
                    onBlur={onBlurAirportOriginDestination}
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
                  {state!.showDropdown.airportDropdown &&
                  state!.airportListDropdowntype ===
                    `destination-${segmentIdx}` ? (
                    <AirportListDropdown
                      ref={childrenRef.current.airportListDropdownRef}
                      popularAirportList={state!.popularAirportList}
                      filteredAirportList={state!.filteredAirportList}
                      airportListDropdowntype="destination"
                      origin={segment.origin}
                      destination={segment.destination}
                      handleChange={changeOriginDestination}
                      hideDropdown={() => handleHideDropdown("airportDropdown")}
                      forceClose={state!.forceClose.airportDropdown}
                      searchKey={debouncedSearchKey[segmentIdx].destination}
                    />
                  ) : (
                    <></>
                  )}
                </div>
                <div
                  id={`SSBDeparture-${segmentIdx}`}
                  className="c-date-group-ssb"
                  style={{
                    width:
                      state!.tripType.oneWay || state!.tripType.multiCity
                        ? "calc(100%/3)"
                        : "auto",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className={
                      styles.col + " c-form-group c-form-floating inc-img"
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
                      className="c-form-control departure-date-input"
                      style={{
                        borderTopRightRadius:
                          state!.tripType.oneWay || state!.tripType.multiCity
                            ? 4
                            : 0,
                        borderBottomRightRadius:
                          state!.tripType.oneWay || state!.tripType.multiCity
                            ? 4
                            : 0,
                        borderRight:
                          state!.tripType.oneWay || state!.tripType.multiCity
                            ? ""
                            : "none",
                      }}
                      value={
                        state!.isInitDepartureDate[segmentIdx]
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
                    {state!.showDropdown.datePicker &&
                      state!.calendarType === `departure-${segmentIdx}` && (
                        <DatePickerV1
                          ref={childrenRef.current.datePickerRef}
                          calendarType="departure"
                          departureDate={segment.departureDate}
                          returnDate={state!.returnDate}
                          handleChange={changeDepartureReturnDate}
                          hideCalendar={() => handleHideDropdown("datePicker")}
                          forceClose={state!.forceClose.datePicker}
                        />
                      )}
                  </div>
                  {state!.tripType.roundTrip &&
                    !state!.tripType.multiCity &&
                    segmentIdx === 0 && (
                      <>
                        <div
                          ref={dateBorderRef}
                          className="c-form-group date-border"
                        ></div>
                        <div
                          className={
                            styles.col + " c-form-group c-form-floating inc-img"
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
                            <VscCalendar
                              size={24}
                              style={{ color: "#9a9c9f" }}
                            />
                          </div>
                          <input
                            ref={(element) => {
                              inputRef.current.return = element;
                            }}
                            id="SSBReturn"
                            className="c-form-control return-date-input"
                            style={{
                              borderTopLeftRadius: 0,
                              borderBottomLeftRadius: 0,
                            }}
                            value={
                              state!.isInitReturnDate
                                ? ""
                                : dateToStringWithSlash(state!.returnDate)
                            }
                            placeholder="Return"
                            autoComplete="off"
                            onFocus={onFocus(
                              "return",
                              "datePicker",
                              segmentIdx
                            )}
                            onChange={() => {}}
                          />
                          <div className="c-control-label-wrapper">
                            <label className="c-control-label">
                              {t("returnDate")}
                            </label>
                          </div>
                          {state!.showDropdown.datePicker &&
                            state!.calendarType === `return-${segmentIdx}` && (
                              <DatePickerV1
                                ref={childrenRef.current.datePickerRef}
                                calendarType="return"
                                departureDate={segment.departureDate}
                                returnDate={state!.returnDate}
                                handleChange={changeDepartureReturnDate}
                                hideCalendar={() =>
                                  handleHideDropdown("datePicker")
                                }
                                forceClose={state!.forceClose.datePicker}
                              />
                            )}
                        </div>
                      </>
                    )}
                </div>
              </div>
            );
          })}
        {state!.tripType.multiCity && state!.segments.length < 5 ? (
          <div className={styles["add-segment-wrapper"]}>
            <button type="button" className="c-btn" onClick={handleAddSegment}>
              <span className="c-icon-wrapper">
                <IoAddCircle size={24} />
              </span>
              Add Another Flights
            </button>
          </div>
        ) : (
          <></>
        )}
        {/* End - Segments Component */}
        {/* Start - Travel Class Component */}
        <div className="c-row-ssb" style={{ position: "relative" }}>
          <div
            className={styles.col + " c-form-group c-form-floating inc-img"}
            style={{
              width: state!.inputDynamicWidth,
              minWidth: state!.inputDynamicWidth,
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
              onFocus={onFocus(
                "passenger",
                "passengerDropdown",
                state!.segmentIdx
              )}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("passenger")}</label>
            </div>
            <DropdownTransition
              ref={childrenRef.current.dropdownTransitionRef}
              shouldRender={state!.showDropdown.passengerDropdown}
              hideDropdown={() => handleHideDropdown("passengerDropdown")}
              forceClose={state!.forceClose.passengerDropdown}
              width={300}
            >
              <PassengerDropdown
                inputPassenger={state!.passenger}
                changePassenger={changePassenger}
              />
            </DropdownTransition>
          </div>
          <div
            className={styles.col + " c-form-group c-form-floating inc-img"}
            style={{
              width: state!.inputDynamicWidth,
              minWidth: state!.inputDynamicWidth,
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
              value={state!.travelClass.display}
              onChange={() => {}}
              onFocus={onFocus(
                "travelClass",
                "travelClassDropdown",
                state!.segmentIdx
              )}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("travelClass")}</label>
            </div>
            <DropdownTransition
              ref={childrenRef.current.dropdownTransitionRef}
              shouldRender={state!.showDropdown.travelClassDropdown}
              hideDropdown={() => handleHideDropdown("travelClassDropdown")}
              forceClose={state!.forceClose.travelClassDropdown}
            >
              <TravelClassDropdown
                travelClass={state!.travelClass}
                changeTravelClass={changeTravelClass}
              />
            </DropdownTransition>
          </div>
          <div
            className={styles.col + " c-form-group c-form-floating inc-img"}
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
              value={state!.promoCode}
              onChange={handleChange}
              onFocus={onFocus("promoCode", "", state!.segmentIdx)}
              onBlur={onBlurPromoCode}
            />
            <div className="c-control-label-wrapper">
              <label className="c-control-label">{t("promoCode")}</label>
            </div>
          </div>
          <div
            className={styles.col + " c-form-group c-form-floating inc-img"}
            style={{
              width: "100%",
            }}
          >
            <button id={styles.SSBFlightSubmit} className="c-btn" type="submit">
              Search Flight
            </button>
          </div>
        </div>
        {/* End - Travel Class Component */}
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
