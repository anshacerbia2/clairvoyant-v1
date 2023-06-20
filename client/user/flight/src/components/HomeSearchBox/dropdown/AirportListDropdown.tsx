import React, {
  forwardRef,
  MouseEvent,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/AirportListDropdown.module.scss";
import type { IAirportsOrAreas } from "@/models/search-flight-form.model";
import { defaultAirport } from "@/models/search-flight-form.model";
import { MdOutlineLocationCity, MdLocalAirport } from "react-icons/md";
import { transform } from "typescript";
import { symlink } from "fs";

interface IAirportListDropdownProps {
  airportListDropdowntype: string;
  origin: IAirportsOrAreas;
  destination: IAirportsOrAreas;
  handleChange: (prefix: string, value: IAirportsOrAreas) => void;
  hideDropdown: () => void;
  forceClose: boolean;
  popularAirportList: IAirportsOrAreas[];
  filteredAirportList: IAirportsOrAreas[];
  searchKey: string;
}

interface IMatchAirportListState {
  popular: IAirportsOrAreas[];
  more: IAirportsOrAreas[];
}

const AirportListDropdown = React.forwardRef<
  HTMLDivElement,
  IAirportListDropdownProps
>(
  (
    {
      airportListDropdowntype,
      origin,
      destination,
      handleChange,
      hideDropdown,
      forceClose,
      popularAirportList,
      filteredAirportList,
      searchKey,
    },
    ref
  ) => {
    const dropdownItemRef = useRef<HTMLDivElement>(null);
    const [matchAirportList, setMatchAirportList] =
      useState<IMatchAirportListState>({
        popular: [],
        more: [],
      });
    const [opacity, setOpacity] = useState(0);
    const [show, setShow] = useState(false);
    const [temporaryHidden, setTemporaryHidden] = useState(false);
    const [selectedDropdownIndex, setSelectedDropdownIndex] = useState<
      null | number
    >(null);

    useEffect((): void | (() => void) => {
      fadeIn();
    }, []);

    useEffect((): void => {
      if (forceClose) {
        fadeOut();
      }
    }, [forceClose]);

    const handleEnter = (): void => {
      if (
        selectedDropdownIndex !== null &&
        typeof selectedDropdownIndex === "number"
      ) {
        const data = matchAirportList.popular.concat(matchAirportList.more)[
          selectedDropdownIndex
        ];
        handleChange(airportListDropdowntype, data);
        fadeOut();
      }
    };

    useEffect((): void => {
      setSelectedDropdownIndex(null);
      let filteredPopular = popularAirportList;
      let filteredMore = filteredAirportList;
      if (airportListDropdowntype === "origin" && destination.id) {
        filteredPopular = popularAirportList.filter(
          (airport) => airport.id !== destination.id
        );
        filteredMore = filteredAirportList.filter(
          (airport) => airport.id !== destination.id
        );
      }
      if (airportListDropdowntype === "destination" && origin.id) {
        filteredPopular = popularAirportList.filter(
          (airport) => airport.id !== origin.id
        );
        filteredMore = filteredAirportList.filter(
          (airport) => airport.id !== origin.id
        );
      }
      // Handle filter for popular airports and areas
      if (searchKey.trim()) {
        filteredPopular = filteredPopular.filter((obj) =>
          [obj.code, obj.name, obj.location, obj.country].some((value) =>
            value.match(new RegExp(searchKey, "gi"))
          )
        );
        if (filteredPopular.length || filteredMore.length) {
          if (temporaryHidden) {
            setTemporaryHidden(false);
            fadeIn();
          }
        } else {
          setTemporaryHidden(true);
          fadeOut();
        }
      } else {
        if (temporaryHidden) {
          setTemporaryHidden(false);
          fadeIn();
        }
      }
      setMatchAirportList({ popular: filteredPopular, more: filteredMore });
    }, [searchKey, popularAirportList, filteredAirportList]);

    useEffect((): void | (() => void) => {
      const handleKeyDown = (event: KeyboardEvent) => {
        console.log(event.key);
        if (
          event.key === "ArrowUp" ||
          event.key === "ArrowDown" ||
          event.key === "Tab"
        ) {
          event.preventDefault();
          const dropdownContainer = dropdownItemRef?.current;
          if (dropdownContainer) {
            const dropdownItemsLength =
              matchAirportList.popular.length +
              matchAirportList.more.length -
              1;
            console.log(dropdownItemsLength, "length");

            let currentIndex = selectedDropdownIndex;

            if (currentIndex === null) {
              if (event.key === "ArrowUp") {
                currentIndex = dropdownItemsLength;
              } else {
                currentIndex = 0;
              }
            } else {
              if (event.key === "ArrowDown" || event.key === "Tab") {
                if (currentIndex === dropdownItemsLength) {
                  currentIndex = 0;
                } else {
                  currentIndex++;
                }
              } else {
                if (currentIndex === 0) {
                  currentIndex = dropdownItemsLength;
                } else {
                  currentIndex--;
                }
              }
            }
            console.log(currentIndex, selectedDropdownIndex);
            setSelectedDropdownIndex(currentIndex);
            Array.from(dropdownContainer.children).forEach((child) => {
              if ((child as HTMLElement).tabIndex === currentIndex) {
                child.classList.add(styles["active"]);
                dropdownContainer.scrollTop =
                  (child as HTMLElement).offsetTop - 39;
              } else {
                child.classList.remove(styles["active"]);
              }
            });
          }
        }

        if (event.key == "Enter") {
          handleEnter();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [searchKey, selectedDropdownIndex, matchAirportList]);

    const handleClick = (event: MouseEvent): void => {
      event.stopPropagation();
      const value = event.currentTarget.getAttribute("data-value");
      let data = matchAirportList.popular
        .concat(matchAirportList.more)
        .find((obj) => obj.code === value);
      data = data?.code ? data : defaultAirport;
      handleChange(airportListDropdowntype, data);
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
      if (!show && !temporaryHidden) {
        hideDropdown();
      }
    };

    const matchFormatter = (
      code: string | null,
      name: string | null,
      location: string | null,
      country: string | null
    ): React.ReactNode => {
      let str = "";
      if (code && name) {
        str = code + " - " + name;
      }
      if (location && country) {
        str = location + ", " + country;
      }
      if (!searchKey.trim()) {
        return str;
      } else {
        const searchKeyRegex = new RegExp(searchKey, "gi");
        const splitString = str.split(searchKeyRegex);
        const matchArr = str.match(searchKeyRegex);
        const result: any[] = [];
        splitString.forEach((value, index) => {
          if (value) {
            result.push(value);
          }
          if (matchArr && index <= matchArr.length) {
            result.push(
              <span key={index} style={{ color: "#07a0dc" }}>
                {matchArr[index]}
              </span>
            );
          }
        });
        return result;
      }
    };

    return (
      <div
        ref={ref}
        id={styles["AirportListDropdown"]}
        style={{
          top: show ? 67 : 46,
          opacity: opacity,
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <div className={styles["arrow"]}></div>
        <div className={styles["dropdown-wrapper"]}>
          <div ref={dropdownItemRef}>
            {matchAirportList.popular.length ? (
              <div
                className={styles["list-category"]}
                style={{ position: "sticky", top: 0, zIndex: 1 }}
              >
                <div>Popular Cities or Airports</div>
              </div>
            ) : (
              <></>
            )}
            {matchAirportList.popular.length ? (
              matchAirportList.popular.map((airport, airportIdx) => {
                return (
                  <div
                    role="airportsandareas-option-item"
                    tabIndex={airportIdx}
                    key={"popular-airport-" + airport.code}
                    className={styles["dropdown-item"]}
                    data-value={airport.code}
                    onClick={handleClick}
                  >
                    {!airport.areaCode ? (
                      <MdOutlineLocationCity
                        size={24}
                        style={{ transform: "none" }}
                      />
                    ) : (
                      <MdLocalAirport size={24} />
                    )}
                    <div style={{ fontWeight: 500 }}>
                      {matchFormatter(
                        null,
                        null,
                        airport.location,
                        airport.country
                      )}
                    </div>
                    <div>
                      {matchFormatter(
                        airport.code,
                        airport.areaCode
                          ? airport.name
                          : `All airports in ${airport.name}`,
                        null,
                        null
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
            {matchAirportList.more.length && searchKey.trim() ? (
              <div
                className={styles["list-category"]}
                style={{ position: "sticky", top: 0, zIndex: 2 }}
              >
                <div>More Cities or Airports</div>
              </div>
            ) : (
              <></>
            )}
            {matchAirportList.more.length && searchKey.trim() ? (
              matchAirportList.more.map((airport, airportIdx) => {
                return (
                  <div
                    role="airportsandareas-option-item"
                    tabIndex={airportIdx + matchAirportList.popular.length}
                    key={"filtere-airport-" + airport.code}
                    className={styles["dropdown-item"]}
                    data-value={airport.code}
                    onClick={handleClick}
                  >
                    {!airport.areaCode ? (
                      <MdOutlineLocationCity
                        size={24}
                        style={{ transform: "none" }}
                      />
                    ) : (
                      <MdLocalAirport size={24} />
                    )}
                    <div style={{ fontWeight: 500 }}>
                      {matchFormatter(
                        null,
                        null,
                        airport.location,
                        airport.country
                      )}
                    </div>
                    <div>
                      {matchFormatter(
                        airport.code,
                        airport.areaCode
                          ? airport.name
                          : `All airports in ${airport.name}`,
                        null,
                        null
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <></>
            )}
            {!popularAirportList.length && !filteredAirportList.length && (
              <div className={styles["item-not-found"]}>
                No result found for {searchKey}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

AirportListDropdown.displayName = "AirportListDropdown";
export default AirportListDropdown;
