import React, { MouseEvent, useEffect, useState } from "react";
import styles from "@/styles/PassengerDropdown.module.scss";
import type { IPassengerDropdownProps } from "@/models/search-flight-form.model";
import { VscAdd, VscRemove } from "react-icons/vsc";

const PassengerDropdown: React.FC<IPassengerDropdownProps> = ({
  inputPassenger,
  changePassenger,
}) => {
  const handleClick =
    (type: string, prefix: string) =>
    (event: MouseEvent): void => {
      if (type !== "+" && type !== "-") return;
      const newValue =
        type === "+"
          ? +inputPassenger[prefix] + 1
          : +inputPassenger[prefix] - 1;
      if (newValue < 0 || (newValue < 1 && prefix === "adults")) return;
      let totalPassenger = newValue;
      for (const key in inputPassenger) {
        if (key !== prefix) {
          totalPassenger += +inputPassenger[key];
        }
      }
      if (totalPassenger > 9) return;
      console.log(totalPassenger);

      const passenger = {
        ...inputPassenger,
        [prefix]: newValue,
      };
      changePassenger(passenger);
    };

  return (
    <>
      <div className={styles["dropdown-wrapper"]}>
        {[
          { key: "adults", title: "Adults", info: "Aged 11+" },
          { key: "children", title: "Children", info: "Aged 2+ to 11" },
          { key: "infants", title: "Infants", info: "Aged 0 to 2" },
        ].map((data) => {
          return (
            <div
              key={data.key}
              className={styles["passenger-quantity-container"] + " mb-3"}
            >
              <div className={styles["passenger-type"]}>
                <strong>{data.title}</strong>
                <small>{data.info}</small>
              </div>
              <div className={styles["action"]}>
                <button
                  type="button"
                  className="c-btn"
                  onClick={handleClick("-", data.key)}
                >
                  <VscRemove size={18} style={{ color: "#9a9c9f" }} />
                </button>
                <input
                  type="text"
                  className="c-form-control"
                  readOnly
                  disabled
                  value={inputPassenger[data.key]}
                />
                <button
                  type="button"
                  className="c-btn"
                  onClick={handleClick("+", data.key)}
                >
                  <VscAdd size={18} style={{ color: "#9a9c9f" }} />
                </button>
              </div>
            </div>
          );
        })}
        <div className={styles["info"]}>
          <p className="mt-2 mb-2">
            Your age at the time of travel must be valid for the age category
            booked. Airlines have restrictions on people under the age of 18
            traveling alone.
          </p>
          <p className="mb-0">
            Age limits and policies for traveling with children may vary, so
            please check with the airline before booking
          </p>
        </div>
      </div>
    </>
  );
};

export default PassengerDropdown;
