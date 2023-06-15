/**
 * Note: This reducer not connected to redux
 */
import {
  ADD_ISINIT_DEPARTURE_DATE,
  ADD_SEARCH_KEY,
  ADD_SEGMENTS,
  FETCH_AIRPORT_LIST,
  FORCE_CLOSE_ALL,
  FORCE_CLOSE_ALL_WITH_EXCEPTION,
  FORCE_CLOSE_CURRENT,
  RESET_ISINIT_DEPARTURE_DATE,
  RESET_SEARCH_KEY,
  RESET_SEGMENTS,
  SET_AIRPORT_LIST_DROPDOWN_TYPE,
  SET_CALENDAR_TYPE,
  SET_DYNAMIC_INPUT_WIDTH,
  SET_ISINIT_DEPARTURE_DATE,
  SET_ISINIT_RETURN_DATE,
  SET_NON_STOP,
  SET_PASSENGER,
  SET_PROMO_CODE,
  SET_RETURN_DATE,
  SET_SEARCH_KEY,
  SET_SEGMENTS,
  SET_SEGMENT_INDEX,
  SET_TRAVEL_CLASS,
  SET_TRIP_TYPE,
  SHOW_DROPDOWN_CURRENT,
} from "./saerchFlightForm.constants";
// Helpers
import {
  createNewDate,
  dateToStringAmadeus,
  dateToStringWithSlash,
} from "@/helpers/createNewDate";
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

export type Action = {
  type: string;
  payload?: any;
};

// Avoiding recreating the initial state using initializer
export const createInitialState = () => {
  return {
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
    searchKey: [
      {
        origin: "",
        destination: "",
      },
    ],
    isInitDepartureDate: [true],
    isInitReturnDate: true,
    showDropdown: {
      airportDropdown: false,
      datePicker: false,
      passengerDropdown: false,
      travelClassDropdown: false,
    },
    forceClose: {
      airportDropdown: false,
      datePicker: false,
      passengerDropdown: false,
      travelClassDropdown: false,
    },
    airportListDropdowntype: "origin-1",
    calendarType: "departure-1",
    segmentIdx: 0,
    airportList: [],
    inputDynamicWidth: 260.83,
  };
};

const searchFlightFormReducer = (
  state: ISearchFlightFormInputStates = createInitialState(),
  action: Action
) => {
  switch (action.type) {
    case FETCH_AIRPORT_LIST:
      return {
        ...state,
        airportList: action.payload,
      };
    case SET_DYNAMIC_INPUT_WIDTH:
      return {
        ...state,
        inputDynamicWidth: action.payload,
      };
    case SET_SEGMENT_INDEX:
      return {
        ...state,
        segmentIdx: action.payload,
      };
    case SET_SEGMENTS:
      return {
        ...state,
        segments: action.payload,
      };
    case ADD_SEGMENTS:
      return {
        ...state,
        segments: [
          ...state.segments,
          {
            origin: defaultAirport,
            destination: defaultAirport,
            departureDate: initDate,
          },
        ],
      };
    case RESET_SEGMENTS:
      return {
        ...state,
        segments: [state.segments[0]],
      };
    case SET_RETURN_DATE:
      return {
        ...state,
        returnDate: action.payload,
      };
    case SET_PASSENGER:
      return {
        ...state,
        passenger: action.payload,
      };
    case SET_TRAVEL_CLASS:
      return {
        ...state,
        travelClass: action.payload,
      };
    case SET_SEARCH_KEY:
      return {
        ...state,
        searchKey: action.payload,
      };
    case ADD_SEARCH_KEY:
      return {
        ...state,
        searchKey: [
          ...state.searchKey,
          {
            origin: "",
            destination: "",
          },
        ],
      };
    case RESET_SEARCH_KEY:
      return {
        ...state,
        searchKey: action.payload,
      };
    case SET_TRIP_TYPE:
      return {
        ...state,
        tripType: action.payload,
      };
    case SET_NON_STOP:
      return {
        ...state,
        nonStop: !state.nonStop,
      };
    case SET_PROMO_CODE:
      return {
        ...state,
        promoCode: action.payload,
      };
    case SHOW_DROPDOWN_CURRENT:
      return {
        ...state,
        showDropdown: action.payload,
      };
    case FORCE_CLOSE_ALL:
      return {
        ...state,
        forceClose: action.payload,
      };
    case FORCE_CLOSE_CURRENT:
      return {
        ...state,
        forceClose: action.payload,
      };
    case FORCE_CLOSE_ALL_WITH_EXCEPTION:
      return {
        ...state,
        forceClose: action.payload,
      };
    case SET_AIRPORT_LIST_DROPDOWN_TYPE:
      return {
        ...state,
        airportListDropdowntype: action.payload,
      };
    case SET_CALENDAR_TYPE:
      return {
        ...state,
        calendarType: action.payload,
      };
    case SET_ISINIT_DEPARTURE_DATE:
      return {
        ...state,
        isInitDepartureDate: action.payload,
      };
    case RESET_ISINIT_DEPARTURE_DATE:
      return {
        ...state,
        isInitDepartureDate: [state.isInitDepartureDate[0]],
      };
    case ADD_ISINIT_DEPARTURE_DATE:
      return {
        ...state,
        isInitDepartureDate: [...state.isInitDepartureDate, true],
      };
    case SET_ISINIT_RETURN_DATE:
      return {
        ...state,
        isInitReturnDate: action.payload,
      };
  }
};

export default searchFlightFormReducer;
