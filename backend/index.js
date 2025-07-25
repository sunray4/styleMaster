const { createClient } = require("pexels");

const client = createClient(
  "apA1aj2qwnlRurrTaQDJ9Qjue6TVWaeXkzF0igU6vOswtZsKKca7a6c5"
);
const query = "Nature";

client.photos
  .search({ query, per_page: 1 })
  .then((photos) => {
    console.log(photos);
  })
  .catch((error) => {
    console.error(error);
  });
