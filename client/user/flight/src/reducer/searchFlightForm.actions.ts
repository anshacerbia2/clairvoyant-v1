import {
  IAirportList,
  ISearchFlightFormDropdown,
  ISearchFlightFormInputStates,
  ISearchKeyStates,
  ISegmentsStates,
  defaultTravelClass,
} from "@/models/search-flight-form.model";
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
export const setAirportList = (airportList: IAirportList[]) => {
  return {
    type: FETCH_AIRPORT_LIST,
    payload: airportList,
  };
};

export const setInputDynamicWidth = (width: number) => {
  return {
    type: SET_DYNAMIC_INPUT_WIDTH,
    payload: width,
  };
};

export const setSegmentIdx = (value: number) => {
  return {
    type: SET_SEGMENT_INDEX,
    payload: value,
  };
};

export const setSegments = (
  key: string,
  value: IAirportList | null,
  segmentIdx: number,
  state: ISegmentsStates[],
  date?: Date
) => {
  let segments = [...state];
  if (value) {
    segments = state.map((segment, index) => {
      if (index === segmentIdx) {
        return { ...segment, [key]: value };
      } else {
        return { ...segment };
      }
    });
  }

  if (date) {
    segments[segmentIdx].departureDate = date;
  }

  return {
    type: SET_SEGMENTS,
    payload: segments,
  };
};

export const addSegments = () => {
  return {
    type: ADD_SEGMENTS,
  };
};

export const resetSegments = () => {
  return {
    type: RESET_SEGMENTS,
  };
};

export const setReturnDate = (value: Date) => {
  return {
    type: SET_RETURN_DATE,
    payload: value,
  };
};

export const setPassenger = (
  value: ISearchFlightFormInputStates["passenger"]
) => {
  return {
    type: SET_PASSENGER,
    payload: value,
  };
};

export const setTravelClass = (idx: number) => {
  return {
    type: SET_TRAVEL_CLASS,
    payload: defaultTravelClass[idx],
  };
};

export const setSearchKey = (
  name: string,
  value: string,
  segmentIdx: number,
  state: ISearchKeyStates[]
) => {
  const searchKey = state.map((v, i) => {
    if (i === segmentIdx) {
      return { ...v, [name]: value };
    } else {
      return { ...v };
    }
  });
  return {
    type: SET_SEARCH_KEY,
    payload: searchKey,
  };
};

export const addSearchKey = () => {
  return {
    type: ADD_SEARCH_KEY,
  };
};

export const resetSearchKey = (state: ISearchKeyStates[]) => {
  const searchKey = state.map(() => {
    return { origin: "", destination: "" };
  });
  return {
    type: RESET_SEARCH_KEY,
    payload: searchKey,
  };
};

export const setTripType = (value: string) => {
  const tripType = {
    oneWay: value === "oneWay" ? true : false,
    roundTrip: value === "roundTrip" ? true : false,
    multiCity: value === "multiCity" ? true : false,
  };
  return {
    type: SET_TRIP_TYPE,
    payload: tripType,
  };
};

export const setNonStop = () => {
  return {
    type: SET_NON_STOP,
  };
};

export const setPromoCode = (value: string) => {
  return {
    type: SET_PROMO_CODE,
    payload: value,
  };
};

export const showDropdownCurrent = (
  key: string,
  value: boolean,
  state: ISearchFlightFormDropdown
) => {
  const showDropdown = { ...state, [key]: value };
  return {
    type: SHOW_DROPDOWN_CURRENT,
    payload: showDropdown,
  };
};

export const forceCloseAll = (state: ISearchFlightFormDropdown) => {
  const forceClose = Object.fromEntries(
    Object.entries(state).map(([key, value]) => {
      return [
        key,
        Array.isArray(value) ? Array(value.length).fill(true) : true,
      ];
    })
  );
  return {
    type: FORCE_CLOSE_ALL,
    payload: forceClose,
  };
};

export const forceCloseCurrent = (
  key: string,
  value: boolean,
  state: ISearchFlightFormDropdown
) => {
  const forceClose = { ...state, [key]: value };
  return {
    type: FORCE_CLOSE_CURRENT,
    payload: forceClose,
  };
};

export const forceCloseAllWithException = (
  state: ISearchFlightFormDropdown
) => {
  return {
    type: FORCE_CLOSE_ALL_WITH_EXCEPTION,
    payload: state,
  };
};

export const setAirportListDropdowntype = (value: string) => {
  return {
    type: SET_AIRPORT_LIST_DROPDOWN_TYPE,
    payload: value,
  };
};

export const setCalendarType = (value: string) => {
  return {
    type: SET_CALENDAR_TYPE,
    payload: value,
  };
};

export const setIsInitDepartureDate = (
  segmentIdx: number,
  state: boolean[]
) => {
  const isInitDepartureDate = state.map((v, i) => {
    if (i === segmentIdx) {
      return false;
    } else {
      return v;
    }
  });
  return {
    type: SET_ISINIT_DEPARTURE_DATE,
    payload: isInitDepartureDate,
  };
};

export const resetIsInitDepartureDate = () => {
  return {
    type: RESET_ISINIT_DEPARTURE_DATE,
  };
};

export const addIsInitDepartureDate = () => {
  return {
    type: ADD_ISINIT_DEPARTURE_DATE,
  };
};

export const setIsInitReturnDate = (value: boolean) => {
  return {
    type: SET_ISINIT_RETURN_DATE,
    payload: value,
  };
};
