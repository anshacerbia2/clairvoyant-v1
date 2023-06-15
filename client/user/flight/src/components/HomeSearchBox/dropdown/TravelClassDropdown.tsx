import React, { useEffect, useState } from "react";
import styles from "@/styles/TravelClassDropdown.module.scss";
import type { ITravelClassDropdownProps } from "@/models/search-flight-form.model";
import { defaultTravelClass } from "@/models/search-flight-form.model";

const TravelClassDropdown: React.FC<ITravelClassDropdownProps> = ({
  travelClass,
  changeTravelClass,
}) => {
  const [selectedClassIdx, setSelectedClassIdx] = useState(0);

  useEffect((): void | (() => void) => {
    const selectedIdx = defaultTravelClass.findIndex((obj) => {
      return obj.value === travelClass.value;
    });
    setSelectedClassIdx(selectedIdx);
  }, []);

  const handleClick =
    (index: number) =>
    (event: React.MouseEvent<HTMLDivElement>): void => {
      changeTravelClass(index);
    };

  return (
    <>
      <div className={styles["dropdown-wrapper"]}>
        {defaultTravelClass.map((data, index) => {
          return (
            <div
              key={`travel-class-${index}`}
              className={`${styles["dropdown-item"]} ${
                index === selectedClassIdx ? styles["current"] : ""
              } `}
              onClick={handleClick(index)}
            >
              {data.display}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default TravelClassDropdown;
