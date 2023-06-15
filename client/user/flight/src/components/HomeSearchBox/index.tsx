import React from "react";
import FlightForm from "./form/SearchFlightForm";
import styles from "@/styles/components/HomeSearchBox.module.scss";

const HomeSearchBox: React.FC = () => {
  return (
    <>
      <div className={styles.container}>
        <div style={{ padding: 20, borderRadius: 8, backgroundColor: "#fff" }}>
          <FlightForm />
        </div>
      </div>
    </>
  );
};

export default HomeSearchBox;
