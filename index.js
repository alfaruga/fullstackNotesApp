const app = require("./app");
const http = require("http");
const logger = require("./utils/logger");
const config = require("./utils/config");

const server = http.createServer(app);

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT} can visit it at http://www.localhost:${config.PORT}/`);
});
