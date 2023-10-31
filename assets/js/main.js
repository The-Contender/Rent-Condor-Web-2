(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (window.location.hash === "#contact") {
      if (window.innerWidth <= 600) {
        console.log(window.innerWidth);
        const contact = document.querySelector("#contact");
        const viewportHeight = window.innerHeight;
        const inputPosition =
          contact.getBoundingClientRect().top + window.pageYOffset;
        const taskbar = document.getElementById("taskbar");
        const taskbarHeight = taskbar.offsetHeight;
        window.scrollTo({
          top: inputPosition + viewportHeight - taskbarHeight - 10,
          behavior: "smooth",
        });
      }
    }
  });

  // data
  //   .then((result) => {
  //     // Ensure the data property exists and is an array before iterating
  //     if (result && Array.isArray(result.data)) {
  //       result.data.forEach((item) => {
  //         console.log(item);
  //         // Do whatever processing you need with each item here
  //       });
  //     }
  //   })
  //   .catch((error) => {
  //     console.error("Error processing data:", error);
  //   }); // This will still log a promise, but now you can use `data` in an async context to get the resolved value.

  /*=====================================
fetch data
    ======================================= */

  // const csvUrl =
  //   "https://raw.githubusercontent.com/aldenkane/Rent-Condor-Web/main/csv_new%2Bold.csv";

  // fetch(csvUrl)
  //   .then((response) => {
  //     if (!response.ok) {
  //       throw new Error("Network response was not ok");
  //     }
  //     return response.text();
  //   })
  //   .then((data) => {
  //     console.log(data); // This will print the raw CSV data to the console
  //     // From here, you can process the CSV data as needed.
  //   })
  //   .catch((error) => {
  //     console.error(
  //       "There was a problem with the fetch operation:",
  //       error.message
  //     );
  //   });
  /*=====================================
    Map Box Work
    ======================================= */

  /*=====================================
    Get Current Position
    ======================================= */

  const coords = navigator.geolocation.getCurrentPosition(function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords = [longitude, latitude];
    console.log(coords);

    mapboxgl.accessToken =
      "pk.eyJ1Ijoic3RldmVvaGFuZXNpYW4iLCJhIjoiY2xuam5lbXN4MGNtMTJ0cG1naHFlcGpiayJ9.grLFPTnEokYgXWfy_T4Ddg";
    var map = new mapboxgl.Map({
      container: "map",
      center: coords,
      style: "mapbox://styles/mapbox/streets-v11",
      zoom: 10,
    });

    async function fetchData() {
      try {
        const response = await fetch("http://localhost:3000/api/properties");
        const db = await response.json();
        return db.data;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    let data = fetchData(); //returns a promise object & Address Data

    async function addPoints() {
      const properties = await data;
      console.log(data);

      const features = properties.reduce((acc, property, index) => {
        if (property[3] === "Exact") {
          const coordinates = property[5].split(",").map(Number);
          acc.push({
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: coordinates,
            },
            properties: {
              address: property[1],
              rent: property["rent"],
              company: property["NA1"],
              link: property["NA2"],
              beds: property["beds"],
              baths: property["baths"],
              index: index,
            },
          });
        }
        return acc;
      }, []);

      map.addSource("points-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: features,
        },
      });

      map.addLayer({
        id: "points-layer",
        type: "circle",
        source: "points-source",
        paint: {
          "circle-radius": 10,
          "circle-color": "#007cbf",
        },
      });
    }

    addPoints();

    // Create a popup but don't add it to the map yet
    const popup = new mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false,
    });

    //Global variables for popup functionality
    let overPopup = false;
    let currentPopup = null;
    let popupTimeout;
    map.on("mouseenter", "points-layer", (e) => {
      // Change the cursor style as a UI indicator.
      map.getCanvas().style.cursor = "pointer";

      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = `
    Address: ${e.features[0].properties.address}<br>
    Rent: ${e.features[0].properties.rent}<br>
    Company: ${e.features[0].properties.company}<br>
    Beds: ${e.features[0].properties.beds}<br>
    Baths: ${e.features[0].properties.baths}<br>
    <a href="${e.features[0].properties.link}" target="_blank">More Info</a>
  `;

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      // Populate the popup and set its coordinates
      // based on the feature found.
      popup.setLngLat(coordinates).setHTML(description).addTo(map);
      // Add mouseover and mouseout event listeners
      const popupElement = popup.getElement();
      popupElement.addEventListener("mouseenter", () => {
        overPopup = true;
      });
      popupElement.addEventListener("mouseleave", () => {
        overPopup = false;
        popup.remove();
      });

      // Keep track of the current popup
      currentPopup = popup;

      map.on("mouseleave", "points-layer", () => {
        map.getCanvas().style.cursor = "";
        if (currentPopup) {
          popupTimeout = setTimeout(() => {
            if (!overPopup && currentPopup.remove) {
              currentPopup.remove();
              currentPopup = null;
            }
            popupTimeout = null;
          }, 50); // Adjust the timeout duration as needed
        }
      });
    });
  });
  /*=====================================
    Sticky
    ======================================= */

  window.onscroll = function () {
    var header_navbar = document.querySelector(".navbar-area");
    var sticky = header_navbar.offsetTop;

    if (window.pageYOffset > sticky) {
      header_navbar.classList.add("sticky");
    } else {
      header_navbar.classList.remove("sticky");
    }

    // show or hide the back-top-top button
    var backToTo = document.querySelector(".scroll-top");
    if (
      document.body.scrollTop > 50 ||
      document.documentElement.scrollTop > 50
    ) {
      backToTo.style.display = "flex";
    } else {
      backToTo.style.display = "none";
    }
  };

  // section menu active
  function onScroll(event) {
    var sections = document.querySelectorAll(".page-scroll");
    var scrollPos =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop;

    for (var i = 0; i < sections.length; i++) {
      var currLink = sections[i];
      var val = currLink.getAttribute("href");
      var refElement = document.querySelector(val);
      var scrollTopMinus = scrollPos + 73;
      if (
        refElement.offsetTop <= scrollTopMinus &&
        refElement.offsetTop + refElement.offsetHeight > scrollTopMinus
      ) {
        document.querySelector(".page-scroll").classList.remove("active");
        currLink.classList.add("active");
      } else {
        currLink.classList.remove("active");
      }
    }
  }

  window.document.addEventListener("scroll", onScroll);

  // for menu scroll
  var pageLink = document.querySelectorAll(".page-scroll");

  pageLink.forEach((elem) => {
    elem.addEventListener("click", (e) => {
      e.preventDefault();
      document.querySelector(elem.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
        offsetTop: 1 - 60,
      });
    });
  });

  ("use strict");
})();
