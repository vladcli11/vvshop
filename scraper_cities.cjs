const fs = require("fs");
const axios = require("axios");

const BASE_URL = "https://sameday-api.demo.zitec.com";
const USERNAME = "vvshopTEST";
const PASSWORD = "5ukh&M&7";

async function authenticate() {
  const res = await axios.post(`${BASE_URL}/api/authenticate`, null, {
    headers: {
      "X-AUTH-USERNAME": USERNAME,
      "X-AUTH-PASSWORD": PASSWORD,
      Accept: "application/json",
    },
  });

  return res.data.token;
}

async function fetchAllCities(token) {
  let currentPage = 1;
  const perPage = 500;
  let totalPages = 1;
  const allCities = [];

  while (currentPage <= totalPages) {
    const res = await axios.get(`${BASE_URL}/api/geolocation/city`, {
      headers: {
        "X-AUTH-TOKEN": token,
        Accept: "application/json",
      },
      params: {
        page: currentPage,
        countPerPage: perPage,
      },
    });

    const { data, pages } = res.data;
    allCities.push(...data);
    totalPages = pages;
    currentPage++;
    console.log(`Fetched page ${currentPage - 1} / ${pages}`);
  }

  return allCities;
}

function buildCityMap(cityList) {
  const map = {};
  for (const item of cityList) {
    const city = item.name?.trim();
    const county = item.county?.name?.trim();
    const id = item.id;

    if (city && county && id) {
      map[`${city}, ${county}`] = id;
    }
  }
  return map;
}

(async () => {
  try {
    const token = await authenticate();
    const cities = await fetchAllCities(token);
    const cityMap = buildCityMap(cities);

    fs.writeFileSync(
      "sameday_city_ids.json",
      JSON.stringify(cityMap, null, 2),
      {
        encoding: "utf8",
      }
    );

    console.log(
      `Am salvat ${Object.keys(cityMap).length} orașe în sameday_city_ids.json`
    );
  } catch (err) {
    console.error("Eroare la scraping:", err.response?.data || err);
  }
})();
