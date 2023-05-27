import express from "express";
const app = express();
// const ejs = require("ejs");
import bodyParser from "body-parser";
// import connection from "database";
import pool from "./database.js";
import dotenv from "dotenv";

dotenv.config();

// ...
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "admin") {
    const elements = await getSymptoms();

    res.render("symptoms", { elements });
  } else {
    res.render("login", { error: "Invalid username or password." });
  }
});

// app.get("/symptoms", (req, res) => {
//   res.render("symptoms", { elements });
// });

app.post("/submit-symptoms", async (req, res) => {
  const { elements } = req.body;
  console.log("elements", elements);

  const diseases = await getDiseases(elements);
  res.render("disease", { diseases });
});

app.get("/tratment_plan", (req, res) => {
  res.render("disease");
});

app.post("/treatment_plan", async (req, res) => {
  const elements = req.body;
  console.log("elements", elements);

  const plans = await getPlan(elements.diseases[0]);
  res.render("treatment_plan", { plans });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function getSymptoms() {
  try {
    const sql = "SELECT symptom_id, name from symptom;";
    const symptoms = await pool.query(sql);
    console.log(symptoms.rows);
    return symptoms.rows;
  } catch (error) {
    throw new Error(` ${error}`);
  }
}

async function getDiseases(symptoms) {
  try {
    const sql =
      "SELECT DISTINCT  d.disease_idd, d.name, d.cause, d.risk_factor from disease d join symptom_disease sd on d.disease_id = sd.disease_id join symptom s on s.symptom_id = sd.symptom_id where s.name = $1 OR s.name = $2 OR s.name = $3 OR s.name = $4 OR s.name = $5";
    const disease = await pool.query(sql, [symptoms[0], symptoms[1], symptoms[2], symptoms[3], symptoms[4]]);
    console.log(disease.rows);

    return disease.rows;
  } catch (error) {
    throw new Error(`${error}`);
  }
}

async function getPlan(disease_name) {
  try {
    console.log("Disease Name", disease_name);

    const sql =
      "SELECT p.type, p.description from treatment_plan p Join treatment_disease td on td.treatment_id = p.treatment_id JOIN disease d on d.disease_id = td.disease_id WHERE d.name = $1 ";

    const plan = await pool.query(sql, [disease_name]);
    console.log(plan.rows);
    return plan.rows;
  } catch (error) {
    throw new Error(`${error}`);
  }
}
