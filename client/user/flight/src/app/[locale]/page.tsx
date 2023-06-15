import HomeSearchBox from "@/components/HomeSearchBox";

const Home = () => {
  return (
    <>
      <div
        style={{
          height: "calc(100vh - 45px)",
          width: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <HomeSearchBox />
      </div>
    </>
  );
};

export default Home;
