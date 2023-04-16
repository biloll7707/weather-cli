import getArgs from "./helpers/args.js";
import { getIcon, getWeather } from "./services/api.service.js";
import { printError, printSuccess, printHelp, printWeather } from "./services/log.service.js";
import { TOKEN_DICTIONARY, getKeyValue, saveKeyValue } from "./services/storage.service.js";

const saveToken = async (token) => {
  if (!token.length) {
    printError("Token does not exist");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.token, token);
    printSuccess("Token has been saved");
  } catch (error) {
    printError(error.message);
  }
};
const saveCity = async (city) => {
  if (!city.length) {
    printError("City does not exist");
    return;
  }
  try {
    await saveKeyValue(TOKEN_DICTIONARY.city, city);
    printSuccess("City has been saved");
  } catch (error) {
    printError(error.message);
  }
};

const getForecast = async () => {
  try {
    const city = process.env.CITY ?? (await getKeyValue(TOKEN_DICTIONARY.city))
    const response = await getWeather(city);
    printWeather(response, getIcon(response.weather[0].icon))
  } catch (error) {
    if (error?.response?.status == 404) {
      printError("City is not found");
    } else if (error?.response?.status == 401) {
      printError("Invalid token");
    } else {
      printError(error.message);
    }
  }
};

const startCLI = () => {
  const args = getArgs(process.argv);
  if (args.h) {
    return printHelp();
  }
  if (args.s) {
    return saveCity(args.s);
  }
  if (args.t) {
    return saveToken(args.t);
  }
  return getForecast();
};

startCLI();
