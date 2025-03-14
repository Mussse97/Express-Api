// Importerar Express
const express = require("express");
const app = express(); //instansen av en server, "hjärnan" som hanterar inkommande förfrågningar
const port = 4000;

// Middleware för att tolka JSON-data i request-body
app.use(express.json());

// Fejkad databas med användare
let users = [
  { id: 1, name: "Rachel" },
  { id: 2, name: "Lisa" },
];

// Root-endpoint: Enkel beskrivning av API:et
app.get("/", (req, res) => {
  //Callback-funktionen (req, res) => {...} Körs varje gång någon anropar GET /. req (request) innehåller information om förfrågan. response används för att skicka tillbaka ett svar
  res.send(
    //res.send() = metod på res-objektet. Används för att skicka tillbaka ett svar till klienten.
    "REST API med Express: Endpoint för GET-förfrågan av användare är /users"
  );
});

// endpoint för /users som gör 2 saker: Returnerar hela listan av användare om ingen query-param används. Returnerar filtrerade användare om query-parametern "name" skickas med.
app.get("/users", (req, res) => {
  const { name } = req.query; // req.query hämtar query-parametern från URL:en.

  if (name) {
    //Om name finns, filtreras listan baserat på case-insensitive jämförelse. .toLowerCase() används så att Rachel, rachel och RACHEL matchar.
    const filteredUsers = users.filter(
      //returnerar en ny array med alla objekt som uppfyller villkoret i funktionen inuti filter().
      (user) => user.name.toLowerCase() === name.toLowerCase() //funktion som körs på varje element i users-arrayen.
    );
    return res.json(filteredUsers); //En metod som skickar tillbaka filteredUsers i JSON-format.
  }

  // Returnera hela listan av användare om ingen filtrering sker
  res.json(users);
});

// Hämta en enskild användare baserat på ID
app.get("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Konvertera ID från sträng till nummer
  const user = users.find((user) => user.id === userId); // Hitta användaren
  //.find() är en inbyggd metod i JavaScript som letar efter det första elementet i en array som uppfyller ett visst villkor.
  //(user) => user.id === userId En arrow function som går igenom varje user i users. Jämför varje user.id med userId. Om en matchning hittas, returneras användaren (user).

  if (!user) {
    return res.status(404).json({ error: "Användaren hittades inte." }); // Returnera 404 om ej funnen
  }

  res.json(user); // Returnera den hittade användaren
});

// Skapa en ny användare
app.post("/users", (req, res) => {
  const { name } = req.body; // Hämta namn från request-body

  // Validering: Kolla om name finns och är en icke-tom sträng
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Name är obligatoriskt och måste vara en icke-tom sträng.",
    });
  }

  // Generera nytt ID genom att ta det högsta ID:t och lägga till 1
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((user) => user.id)) + 1 : 1,
    name: name.trim(), // Trimma bort onödiga mellanslag
  };

  users.push(newUser); // Lägg till den nya användaren i listan
  res.status(201).json(newUser); // Returnera den skapade användaren med status 201 (Created)
});

// Uppdatera en användares namn baserat på ID
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Konvertera ID från sträng till nummer
  const user = users.find((user) => user.id === userId); // Hitta användaren

  if (!user) {
    return res.status(404).json({ error: "Användaren hittades inte." }); // Returnera 404 om ej funnen
  }

  const { name } = req.body; // Hämta namn från request-body

  // Validering: Kolla om name finns och är en icke-tom sträng
  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      error: "Name är obligatoriskt och måste vara en icke-tom sträng.",
    });
  }

  user.name = name.trim(); // Uppdatera användarens namn
  res.json(user); // Returnera den uppdaterade användaren
});

// Ta bort en användare baserat på ID
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id); // Konvertera ID från sträng till nummer
  const userIndex = users.findIndex((user) => user.id === userId); // Hitta indexet av användaren

  if (userIndex === -1) {
    return res.status(404).json({ error: "Användaren hittades inte." }); // Returnera 404 om ej funnen
  }

  users.splice(userIndex, 1); // Ta bort användaren från listan
  res.sendStatus(204); // Returnera status 204 (No Content) utan innehåll
});

// Starta servern på port 4000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
