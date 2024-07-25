import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user:"postgres",
  host:"localhost",
  password:"Aaditya",
  port:5434,
  database:"permalist"
})

const app = express();
const port = 3000;
db.connect(err=>{
  if (err){
    console.log("Error connecting to database");
  }
  else console.log("Connected successfully");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async(req, res) => {
    const databaseTasks = await db.query("SELECT * FROM tasks ORDER BY id");
    const items = databaseTasks.rows.map(row => ({id:row.id, title: row.title}));
    // console.log(items)
    
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", (req, res) => {
  const newitem = req.body.newItem;
  // console.log(newitem)
  db.query(`INSERT INTO tasks (title) VALUES ($1)`,[newitem]);
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
const getID = req.body.updatedItemId;
const getTitle = req.body.updatedItemTitle;
// console.log(getTitle);
// console.log(getID);
await db.query(`UPDATE tasks SET title = ($1) WHERE id = ($2)`,[getTitle,getID]);
res.redirect("/")
});

app.post("/delete", async(req, res) => {
  const getID = req.body.deleteItemId;
  await db.query(`DELETE FROM tasks WHERE id=($1)`,[getID]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
