const { createClient } = require("redis");

const client = createClient({
  host: "127.0.0.1",
  port: 6379,
});

(async () => {
  client.connect();
  client.on("connect", () => {
    // eslint-disable-next-line no-console
    console.log("You're now connected db redis ...");
  });
})();

module.exports = client;
