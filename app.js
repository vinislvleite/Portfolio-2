import express from "express";
import path from "path";
import methodOverride from "method-override";
import multer from "multer";
import { sequelize, Disciplina } from "./database/index.js";

const app = express();
const PORT = 3000;
const upload = multer();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.get("/", (req, res) => res.render("main"));
app.get("/sobre", (req, res) => res.render("sobre"));

app.get("/projetos", (req, res) => {
  const projetos = [
    {
      titulo: "Site para análise de dados de importação e exportação de SP",
      descricao: "Site com gráficos e filtros usando Python + Flask.",
      solucao: "Limpeza de dados com Pandas e backend em Flask.",
      link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-1DSM-API",
      tecnologias: ["Python", "JavaScript", "HTML", "CSS", "Pandas", "Flask", "MySQL"],
      imagens: [
        "images/Pagina inicial projeto 1.png",
        "images/Sobre projeto 1.png",
        "images/Insights projeto 1.png",
        "images/Gráficos projeto 1.png",
        "images/Top 5 projeto 1.png",
      ],
    },
    {
      titulo: "CRM web para Newe Log",
      descricao: "CRM para centralizar processos comerciais e operacionais.",
      solucao: "Frontend em React, rotas e mockups.",
      link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-2DSM-API",
      tecnologias: ["React", "JavaScript", "CSS", "Express", "MySQL"],
      imagens: [
        "images/Interações projeto2.png",
        "images/Vendedores projeto 2.png",
        "images/Cadastro projeto 2.png",
        "images/Gestão projeto 2.png",
        "images/Funil projeto 2.png",
        "images/Agendamento projeto 2.png",
        "images/Graficos projeto 2.png",
      ],
    },
  ];

  res.render("projetos", { projetos });
});

app.get("/contato", (req, res) => res.render("contato"));

app.get("/dashboard", async (req, res) => {
  try {
    const totalDisciplinas = await Disciplina.count();

    const projetosConcluidos = 1;

    const tecnologiasProjetoConcluido = [
      { nome: "Python", count: 1 },
      { nome: "JavaScript", count: 2 },
      { nome: "HTML", count: 2 },
      { nome: "CSS", count: 2 },
      { nome: "Pandas", count: 1 },
      { nome: "Flask", count: 1 },
      { nome: "React", count: 1 },
    ];

    const tecnologiasOrdenadas = tecnologiasProjetoConcluido
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .slice(0, 5);

    res.render("dashboard", {
      totalDisciplinas,
      projetosConcluidos,
      tecnologias: tecnologiasOrdenadas,
    });

  } catch (err) {
    console.log(err);
    res.render("dashboard", {
      totalDisciplinas: 0,
      projetosConcluidos: 1,
      tecnologias: [],
    });
  }
});

app.get("/disciplinas", async (req, res) => {
  const disciplinas = await Disciplina.findAll();
  res.render("disciplinas", { disciplinas });
});

app.get("/disciplinas/nova", (req, res) => {
  res.render("novadisciplinas", { editar: false, disciplina: null });
});

app.post("/disciplinas/nova", upload.none(), async (req, res) => {
  const nome = req.body.nome?.trim();

  if (!nome) {
    return res.status(400).render("novadisciplinas", {
      editar: false,
      disciplina: null,
      error: "O nome da disciplina é obrigatório",
    });
  }

  await Disciplina.create({ nome });
  res.redirect("/disciplinas");
});

app.get("/disciplinas/:id/editar", async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);

  if (!disciplina) return res.status(404).send("Disciplina não encontrada");

  res.render("novadisciplinas", { editar: true, disciplina });
});

app.put("/disciplinas/:id", async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);

  if (!disciplina) return res.status(404).send("Disciplina não encontrada");

  const nome = req.body.nome?.trim();
  if (!nome) {
    return res.status(400).render("novadisciplinas", {
      editar: true,
      disciplina,
      error: "O nome da disciplina é obrigatório",
    });
  }

  disciplina.nome = nome;
  await disciplina.save();

  res.redirect("/disciplinas");
});

app.delete("/disciplinas/:id", async (req, res) => {
  const disciplina = await Disciplina.findByPk(req.params.id);

  if (!disciplina) return res.status(404).send("Disciplina não encontrada");

  await disciplina.destroy();

  res.redirect("/disciplinas");
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
