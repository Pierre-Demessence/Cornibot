import "reflect-metadata";
require("dotenv-safe").config();

import Cornibot from "./Engine/CorniBot";
import moment from "moment";

moment.locale("en");

new Cornibot().Start();
