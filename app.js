import express from "express";
import path from "path";

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));

app.get("/", (req, res) => {
  res.render("main");
});

app.get("/sobre", (req, res) => {
  res.render("sobre");
});

app.get("/disciplinas",(req,res)=> {
  res.render("disciplinas")
})

app.get("/projetos",(req,res)=> {
  res.render("projetos")
})

app.get("/contato",(req,res)=> {
  res.render("contato")
})

app.get("/dashboard",(req,res)=> {
  res.render("dashboard")
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
