import React, {
  forwardRef,
  MouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "@/styles/AirportListDropdown.module.scss";
import type { IAirportList } from "@/models/search-flight-form.model";
import { defaultAirport } from "@/models/search-flight-form.model";
import { MdOutlineLocationCity, MdLocalAirport } from "react-icons/md";
import { transform } from "typescript";
import { symlink } from "fs";

interface IAirportListDropdownProps {
  airportListDropdowntype: string;
  origin: IAirportList;
  destination: IAirportList;
  handleChange: (prefix: string, value: IAirportList) => void;
  hideDropdown: () => void;
  forceClose: boolean;
  airportList: IAirportList[];
  searchKey: string;
}

interface IMatchAirportListState {
  popular: IAirportList[];
  more: IAirportList[];
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
      airportList,
      searchKey,
    },
    ref
  ) => {
    const [matchAirportList, setMatchAirportList] =
      useState<IMatchAirportListState>({
        popular: [],
        more: [],
      });
    const [opacity, setOpacity] = useState(0);
    const [show, setShow] = useState(false);
    const [temporaryHidden, setTemporaryHidden] = useState(false);

    useEffect((): void | (() => void) => {
      fadeIn();
    }, []);

    useEffect((): void => {
      if (forceClose) {
        fadeOut();
      }
    }, [forceClose]);

    useEffect((): void => {
      let filteredAirport = airportList;
      if (airportListDropdowntype === "origin" && destination.id) {
        filteredAirport = airportList.filter(
          (airport) => airport.id !== destination.id
        );
      }
      if (airportListDropdowntype === "destination" && origin.id) {
        filteredAirport = airportList.filter(
          (airport) => airport.id !== origin.id
        );
      }
      if (searchKey.trim()) {
        const isMatch = (airport: IAirportList) => {
          for (const key in airport) {
            const value = airport[key];
            if (
              typeof value === "string" &&
              value.match(new RegExp(searchKey, "gi"))
            ) {
              return true;
            }
          }
          return false;
        };
        const result = filteredAirport.filter(isMatch);
        if (result.length) {
          if (temporaryHidden) {
            setTemporaryHidden(false);
            fadeIn();
          }
          const popular = result.filter((airport) => {
            return (
              airport.code === "JKTA" ||
              airport.code === "TYOA" ||
              airport.code === "DPS"
            );
          });
          const more = result.filter((airport) => {
            return (
              airport.code !== "JKTA" &&
              airport.code !== "TYOA" &&
              airport.code !== "DPS"
            );
          });
          setMatchAirportList({
            popular,
            more,
          });
        } else {
          setTemporaryHidden(true);
          fadeOut();
        }
      } else {
        const popular = filteredAirport.filter((airport) => {
          return (
            airport.code === "JKTA" ||
            airport.code === "TYOA" ||
            airport.code === "DPS"
          );
        });
        setMatchAirportList({ ...matchAirportList, popular });
        if (temporaryHidden) {
          setTemporaryHidden(false);
          fadeIn();
        }
      }
    }, [searchKey]);

    const handleClick = (event: MouseEvent): void => {
      event.stopPropagation();
      const value = event.currentTarget.getAttribute("data-value");
      let data = airportList.find((airport) => airport.code === value);
      data = data?.code ? data : defaultAirport;
      // console.log(data);

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
      city: string | null,
      country: string | null
    ): React.ReactNode => {
      let str = "";
      if (code && name) {
        str = code + " - " + name;
      }
      if (city && country) {
        str = city + ", " + country;
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
          <div>
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
              matchAirportList.popular.map((airport) => {
                if (
                  airport.code === "JKTA" ||
                  airport.code === "TYOA" ||
                  airport.code === "DPS"
                ) {
                  return (
                    <div
                      key={"CODE-popular-" + airport.code}
                      className={styles["dropdown-item"]}
                      data-value={airport.code}
                      onClick={handleClick}
                    >
                      {airport.type === "CITY" ? (
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
                          airport.city,
                          airport.country
                        )}
                      </div>
                      <div>
                        {matchFormatter(airport.code, airport.name, null, null)}
                      </div>
                    </div>
                  );
                }
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
              matchAirportList.more.map((airport) => {
                if (
                  airport.code !== "JKTA" &&
                  airport.code !== "TYOA" &&
                  airport.code !== "DPS"
                ) {
                  return (
                    <div
                      key={"CODE-more-" + airport.code}
                      className={styles["dropdown-item"]}
                      data-value={airport.code}
                      onClick={handleClick}
                    >
                      {airport.type === "CITY" ? (
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
                          airport.city,
                          airport.country
                        )}
                      </div>
                      <div>
                        {matchFormatter(airport.code, airport.name, null, null)}
                      </div>
                    </div>
                  );
                }
              })
            ) : (
              <></>
            )}
            {!matchAirportList.popular.length &&
              !matchAirportList.more.length && (
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
