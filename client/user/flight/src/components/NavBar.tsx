"use client";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import React from "react";
import { VscGlobe } from "react-icons/vsc";
// import { useRouter } from "next-intl/client";

const NavBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const query = useSearchParams();

  const en = () => {
    // router.push("/en/" + pathname + query.toString());
  };

  const id = () => {
    // router.push("/id/" + pathname + query.toString());
  };

  return (
    <div
      style={{
        backgroundColor: "#fff",
      }}
    >
      <div
        className="c-container"
        style={{
          height: 45,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <VscGlobe />
        &nbsp;
        <button onClick={en}>en</button>&nbsp;
        <button onClick={id}>id</button>&nbsp;
      </div>
    </div>
  );
};

export default NavBar;
