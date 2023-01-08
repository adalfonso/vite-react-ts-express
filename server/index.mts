import express from "express";
import { init } from "./init.mjs";

const source_dir = "./dist/client";
const app = express();

init(app);

app.use(express.static(source_dir));

app.listen(1337, () => {
  console.info(`Server started as http://localhost:!337`);
  console.info(`Serving content from ${source_dir}`);
});
