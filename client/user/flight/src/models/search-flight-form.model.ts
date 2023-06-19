export interface ISearchFlightFormChildrenRef {
  airportListDropdownRef: React.RefObject<HTMLDivElement>;
  datePickerRef: React.RefObject<HTMLDivElement>;
  dropdownTransitionRef: React.RefObject<HTMLDivElement>;
}

export interface ISearchKeyStates {
  origin: string;
  destination: string;
}

export interface ISegmentsStates {
  origin: IAirportsOrAreas;
  destination: IAirportsOrAreas;
  departureDate: Date;
}

export interface ISearchFlightFormInputStates {
  tripType: {
    [key: string]: boolean;
    oneWay: boolean;
    roundTrip: boolean;
    multiCity: boolean;
  };
  segments: ISegmentsStates[];
  returnDate: Date;
  passenger: {
    [key: string]: string | number;
    adults: number;
    children: number;
    infants: number;
  };
  travelClass: ITravelClass;
  nonStop: boolean;
  promoCode: string;
  searchKey: ISearchKeyStates[];
  isInitDepartureDate: boolean[];
  isInitReturnDate: boolean;
  showDropdown: ISearchFlightFormDropdown;
  forceClose: ISearchFlightFormDropdown;
  airportListDropdowntype: string;
  calendarType: string;
  segmentIdx: number;
  popularAirportList: IAirportsOrAreas[];
  filteredAirportList: IAirportsOrAreas[];
  inputDynamicWidth: number;
}

export interface ISearchFlightFormDropdown {
  [key: string]: boolean;
  airportDropdown: boolean;
  datePicker: boolean;
  passengerDropdown: boolean;
  travelClassDropdown: boolean;
}

export interface IAirportsOrAreas {
  [key: string]: any;
  id: number | null;
  code: string;
  name: string;
  location: string;
  country: string;
  shortLocation?: string;
  iataCode?: string;
  airports?: string[];
  areaCode?: string;
  airportIcaoCode?: string;
}

export const defaultAirport: Readonly<IAirportsOrAreas> = {
  id: null,
  code: "",
  name: "",
  location: "",
  country: "",
};

export interface ITravelClass {
  [key: string]: string;
  value: string;
  display: string;
}

export const defaultTravelClass: Readonly<ITravelClass[]> = [
  { value: "ECONOMY", display: "Economy" },
  { value: "PREMIUM_ECONOMY", display: "Premium Economy" },
  { value: "BUSINESS", display: "Business Class" },
  { value: "FIRST", display: "First Class" },
];

export interface IPassengerDropdownProps {
  inputPassenger: ISearchFlightFormInputStates["passenger"];
  changePassenger: (
    passenger: ISearchFlightFormInputStates["passenger"]
  ) => void;
}

export interface ITravelClassDropdownProps {
  travelClass: ITravelClass;
  changeTravelClass: (index: number) => void;
}
