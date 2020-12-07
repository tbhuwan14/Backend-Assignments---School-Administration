const studentsData = require("./InitialData");
const Joi = require("joi");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here

app.get("/api/student", (req, res) => {
  res.send(studentsData);
});

app.get("/api/student/:id", (req, res) => {
  const student = studentsData.find((c) => c.id === parseInt(req.params.id));
  if (!student) return res.status(404).send("Invalid Id");
  res.send(student);
});

app.post("/api/student", (req, res) => {
  const schema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    currentClass: Joi.required(),
    division: Joi.string().max(1).required(),
  });

  const result = schema.validate(req.body);
  console.log(result);
  if (result.error) return res.status(400).send("Invalid input");

  const student = {
    id: studentsData.length + 1,
    name: req.body.name,
    currentClass: parseInt(req.body.currentClass),
    division: req.body.division,
  };
  studentsData.push(student);
  res.send(student);
});

app.put("/api/student/:id", (req, res) => {
  const student = studentsData.find((c) => c.id == parseInt(req.params.id));
  if (!student) return res.status(400).send("Invalid Id");

  const schema = Joi.object().keys({
    name: Joi.string().min(1).required(),
    currentClass: Joi.required(),
    division: Joi.string().max(1).required(),
  });

  const result = schema.validate(req.body);
  console.log(result);
  if (result.error) return res.status(400).send("Invalid input");

  student.name = req.body.name;
  student.currentClass = parseInt(req.body.currentClass);
  student.division = req.body.division;
  res.send(student);
});

app.delete("/api/student/:id", (req, res) => {
  const student = studentsData.find((c) => c.id === parseInt(req.params.id));
  if (!student) return res.status(404).send("Invalid Id");

  const index = studentsData.indexOf(student);
  studentsData.splice(index, 1);

  res.send(student);
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
