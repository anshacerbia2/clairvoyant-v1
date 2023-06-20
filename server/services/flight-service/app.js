if (process.env.NODE_ENV !== "production") require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.port || 4002;
const router = require("./routes");
const Amadeus = require("amadeus");
const amadeus = new Amadeus({
  clientId: "nMMpGIhgbhHMSULVsRt80wA9WtMcYm7q",
  clientSecret: "jcGHOmq0Ke0wYSIp",
});

const { AirportsOrAreas, Airports, Areas } = require("./models");
const { Op } = require("sequelize");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(router);

app.get("/multi-search", async (req, res) => {
  try {
    const requestBody = {
      originDestinations: [
        {
          id: "1",
          originLocationCode: "MAD",
          destinationLocationCode: "PAR",
          departureDateTimeRange: {
            date: "2023-07-06",
          },
        },
        {
          id: "2",
          originLocationCode: "PAR",
          destinationLocationCode: "MUC",
          departureDateTimeRange: {
            date: "2023-07-08",
          },
        },
        {
          id: "3",
          originLocationCode: "MUC",
          destinationLocationCode: "AMS",
          departureDateTimeRange: {
            date: "2023-07-10",
          },
        },
        {
          id: "4",
          originLocationCode: "AMS",
          destinationLocationCode: "MAD",
          departureDateTimeRange: {
            date: "2023-07-17",
          },
        },
      ],
      travelers: [
        {
          id: "1",
          travelerType: "ADULT",
          fareOptions: ["STANDARD"],
        },
      ],
      sources: ["GDS"],
      searchCriteria: {
        maxFlightOffers: 1,
      },
    };

    const response = await amadeus.shopping.flightOffersSearch.post(
      JSON.stringify(requestBody)
    );

    // Handle the response
    const flightOffers = response.data;

    res.status(200).json(flightOffers);
  } catch (error) {
    console.error("Error searching flight offers:", error);
  }
  // try {
  //   // Call the Amadeus API to retrieve the list of all cities and airports
  //   const response = await amadeus.referenceData.locations.get({
  //     subType: "CITY,AIRPORT",
  //     keyword: "Los Angeles",
  //   });

  //   // Print the list of cities and airports
  //   console.log(response.data);
  // } catch (error) {
  //   console.log(error);
  // }
  // amadeus.referenceData.locations
  //   .get({
  //     keyword: "Los Angeles",
  //     subType: "CITY,AIRPORT",
  //   })
  //   .then((response) => {
  //     const location = response.data[0];
  //     const originLocationCode =
  //       location.type === "city"
  //         ? location.address.cityCode
  //         : location.iataCode;
  //     console.log(location, originLocationCode);
  //     return amadeus.referenceData.locations
  //       .get({
  //         keyword: "New York",
  //         subType: "CITY,AIRPORT",
  //       })
  //       .then((response) => {
  //         const location = response.data[0];
  //         const destinationLocationCode =
  //           location.type === "city"
  //             ? location.address.cityCode
  //             : location.iataCode;

  //         return amadeus.shopping.flightOffersSearch.get({
  //           originLocationCode: originLocationCode,
  //           destinationLocationCode: destinationLocationCode,
  //           departureDate: "2023-04-01",
  //           adults: 1,
  //         });
  //       });
  //   })
  // .then((response) => {
  //   console.log();
  // })
  // .catch((error) => {
  //   console.log(error.response);
  // });
});

// app.get("/airport-list-popular", async (request, response) => {
//   try {
//     const areas = await Areas.findAll({
//       where: {
//         code: {
//           [Op.in]: [
//             "JKTA",
//             "TYOA",
//             "SUB",
//             "DPS",
//             "KNO",
//             "JFK",
//             "LAX",
//             "UPG",
//             "SINA",
//             "BKKA",
//             "SYD",
//             "ISTA",
//             "MNL",
//           ],
//         },
//       },
//     });
//     const airports = await Airports.findAll({
//       where: {
//         code: {
//           [Op.in]: [
//             "JKTA",
//             "TYOA",
//             "SUB",
//             "DPS",
//             "KNO",
//             "JFK",
//             "LAX",
//             "UPG",
//             "SINA",
//             "BKKA",
//             "SYD",
//             "ISTA",
//             "MNL",
//           ],
//         },
//       },
//     });
//     response.status(200).json(areas.concat(airports));
//   } catch (error) {
//     console.log(error);
//   }
// });

// app.get(`/flight-search`, async (request, response) => {
//   try {
//     const { origin, destination, date, ps, tc, dir, tt } = request.query;
//     console.log(request.query);
//     const y = new Date().getFullYear();
//     const m = new Date().getMonth() + 1;
//     const d = new Date().getDate() + 1;
//     const defaultDate = `${y}-${m > 9 ? m : "0" + m}-${d > 9 ? d : "0" + d}`;
//     const tripType = {
//       oneWay: false,
//       roundTrip: true,
//       multiCity: false,
//     };
//     let originLocationCode =
//       typeof origin === "string" && origin.length === 3 ? origin : "CGK";
//     let destinationLocationCode =
//       typeof destination === "string" && destination.length === 3
//         ? destination
//         : "DPS";
//     let departureDate = defaultDate;
//     let returnDate = defaultDate;
//     let adults = 1;
//     let children = 0;
//     let infants = 0;
//     let travelClass = "ECONOMY";
//     const nonStop = dir === "true" ? true : false;
//     if (date && typeof date === "string" && date.split(".").length === 2) {
//       const arr = date.split(".");
//       if (arr[0].length === 10 && arr[1].length === 10) {
//         const dep = arr[0].split("-");
//         const ret = arr[1].split("-");
//         if (dep.length === 3 && ret.length === 3) {
//           let isValid = true;
//           if (dep[0].length !== 4 || ret[0].length !== 4) {
//             isValid = false;
//           }
//           if (
//             dep[1].length !== 2 ||
//             dep[2].length !== 2 ||
//             ret[1].length !== 2 ||
//             ret[2].length !== 2
//           ) {
//             isValid = false;
//           }
//           if (isValid) {
//             departureDate = arr[0];
//             returnDate = arr[0];
//           }
//         }
//       }
//     }
//     if (ps && typeof ps === "string" && ps.split(".").length === 3) {
//       const arr = ps.split(".");
//       const isValid = true;
//       let counter = 0;
//       arr.forEach((v) => {
//         if (v < 0) {
//           isValid = false;
//         }
//         counter += v;
//       });
//       if (isValid && arr[0] >= 1 && counter <= 9) {
//         adults = arr[0];
//         children = arr[1];
//         infants = arr[2];
//       }
//     }
//     if (
//       typeof tc === "string" &&
//       ["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"].includes(tc)
//     ) {
//       travelClass = tc;
//     }
//     if (tt && typeof tt === "string" && tt.split("").length === 3) {
//       const arr = tt.split("");
//       const isValid = true;
//       arr.forEach((v) => {
//         if (v.length !== 1 && (+v !== 0 || +v !== 1)) {
//           isValid = false;
//         }
//       });
//       if (isValid) {
//         let counter = 0;
//         for (const key in tripType) {
//           tripType[key] = +arr[counter] === 1 ? true : false;
//           counter++;
//         }
//       }
//     }
//     const params = {
//       originLocationCode,
//       destinationLocationCode,
//       departureDate,
//       adults,
//       children,
//       infants,
//       nonStop: nonStop ? true : false,
//       travelClass,
//       max: "250",
//     };
//     if (tripType.roundTrip) {
//       params.returnDate = returnDate;
//     }
//     // if(tripType.multiCity){
//     // add segement here
//     // }
//     const data = await amadeus.shopping.flightOffersSearch.get(params);
//     response.status(200).json(data);
//   } catch (error) {
//     console.log(error);
//   }
// });

// od->malindo
// iu->superjet
// ga->garuda
// id->batik
// jt-lion
// qg-citilink
// iw-wings

// const GDS_URL = "https://test.api.amadeus.com/v2";
// app.get("/flight-service/airport-list", async (request, response) => {
//   try {
//     const GDS_AUTH = new URLSearchParams();
//     GDS_AUTH.append("grant_type", "client_credentials");
//     GDS_AUTH.append("client_id", "Ez2B37fYoSAS7Rsb3DqHI7TlwXrd4Gzm");
//     GDS_AUTH.append("client_secret", "bvyQRIeCwIfl5QET");
//     const RES_GDS_AUTH = await axios.post(
//       "https://test.api.amadeus.com/v1/security/oauth2/token",
//       GDS_AUTH,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );
//     const RES_DATA = await axios.get(
//       `${GDS_URL}/shopping/flight-offers?originLocationCode=CGK&destinationLocationCode=SUB&departureDate=2023-05-02&adults=1&nonStop=false&max=250`,
//       {
//         headers: {
//           Authorization: `Bearer ${RES_GDS_AUTH.data.access_token}`,
//         },
//       }
//     );
//     response.status(RES_DATA.status).json(RES_DATA.data);
//   } catch (error) {
//     console.log(error);
//   }
// });

app.listen(port, () => console.log("Server running on port", port));
