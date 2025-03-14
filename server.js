const express = require("express");

const app = express();
const port = 3000;

const authMiddleware = require("./authMiddleware");
const validationMiddleware = require("./validatorMiddleware");
const loggerMiddleware = require("./validatorMiddleware");

app.use(express.json()); 
app.use(loggerMiddleware); // Loggar alla requests

let teams = [
  { id: 1, name: "FC Barcelona", country: "Spain", coach: "Xavi", players: 25 },
  { id: 2, name: "Manchester City", country: "England", coach: "Pep Guardiola", players: 24 },
  { id: 3, name: "Bayern Munich", country: "Germany", coach: "Thomas Tuchel", players: 26 },
];

// Hämta alla lag
app.get("/teams",authMiddleware, (req, res) => {
  res.json(teams);
});

// Hämta ett specifikt lag
app.get("/teams/:id", (req, res) => {
  const team = teams.find((t) => t.id === parseInt(req.params.id));
  if (team) {
    res.json(team);
  } else {
    res.status(404).json({ message: "Team not found" });
  }
});

// Lägg till ett nytt lag
app.post("/teams", authMiddleware, validationMiddleware, (req, res) => {
  const { name, country, coach, players } = req.body;
  const newTeam = { id: teams.length + 1, name, country, coach, players };

  teams.push(newTeam);
  res.status(201).json(newTeam);
});

// Uppdatera ett lag (PUT)
app.put("/teams/:id", (req, res) => {
  const { name, country, coach, players } = req.body;
  const teamIndex = teams.findIndex((t) => t.id === parseInt(req.params.id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: "Team not found" });
  }

  teams[teamIndex] = { ...teams[teamIndex], name, country, coach, players };
  res.json(teams[teamIndex]);
});

// Ta bort ett lag
app.delete("/teams/:id", (req, res) => {
  const teamIndex = teams.findIndex((t) => t.id === parseInt(req.params.id));

  if (teamIndex === -1) {
    return res.status(404).json({ message: "Team not found" });
  }

  const deletedTeam = teams.splice(teamIndex, 1);
  res.json({ message: "Team deleted", deletedTeam });
});

app.listen(port, () => {
  console.log(`Servern körs på http://localhost:${port}`);
});
