const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("./public"));
app.set("view engine", "ejs");

const Recipe = mongoose.model("recipe", {
  receipeName: String,
  receipeTime: String,
  ingredeints: Array,
  serves: String,
});

app.get("/", (req, res) => {
  res.send("All Working Good!");
});

app.get("/recipies", (req, res) => {
  Recipe.find()
    .then((recipes) => res.render("listRecipes", { recipes: recipes }))
    .catch(() => {
      console.log("Error getting data");
      res.send("Sever Error");
    });
});

app.post("/create-recipe", (req, res) => {
  
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  console.log(req.body)
  const newRecipe = new Recipe({
    receipeName: receipeName,
    receipeTime: receipeTime,
    ingredeints: ingredeints,
    serves: serves
  });

  newRecipe
    .save()
    .then((recipe) => {
      res.json({ message: "recipe added successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Someting went wrong" });
    });
});

app.put("/update-receipe/:id", (req, res) => {
  let { id } = req.params;
  const { receipeName, receipeTime, ingredeints, serves } = req.body;
  Recipe.findByIdAndUpdate(id, {
    receipeName: receipeName,
    receipeTime: receipeTime,
    ingredeints: ingredeints,
    serves: serves
  })
    .then((recipe) => {
      res.json({ message: "recipe updated successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Someting went wrong" });
    });
});

app.delete("/delete-receipe/:id", (req, res) => {
  let { id } = req.params;
  Recipe.findByIdAndDelete(id)
    .then((recipe) => {
      res.json({ message: "recipe deleted successfully!" });
    })
    .catch((error) => {
      res.json({ error: "Someting went wrong" });
    });
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB Connected"))
    .catch((err) => console.log("connection failed", err));
});
