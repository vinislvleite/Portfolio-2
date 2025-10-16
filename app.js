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

app.get("/projetos", (req, res) => {
  const projetos = [
    {
      titulo: "Site para análise de dados de exportação e importação do estado de SP",
      descricao:
        "Desenvolvi um site com gráficos, filtros e caixas de pesquisa para dados públicos de importação e exportação.",
      solucao:
        "Utilizei Python para a limpeza e preparação dos dados, criando o backend e os filtros para o frontend.",
      link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-1DSM-API",
      imagens: [
        "images/Pagina inicial projeto 1.png",
        "images/Sobre projeto 1.png",
        "images/Insights projeto 1.png",
        "images/Gráficos projeto 1.png",
        "images/Top 5 projeto 1.png",
      ],
    },
    {
      titulo:
        "Aplicação web CRM para centralizar e padronizar processos administrativos, comerciais e operacionais da Newe Log",
      descricao:
        "Este projeto visa desenvolver uma plataforma única que centralize processos administrativos, comerciais e operacionais da Newe Log.",
      solucao:
        "Utilizei React para criação das páginas da aplicação web, além de rotas e mockups para as páginas.",
      link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-2DSM-API",
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

app.get("/contato",(req,res)=> {
  res.render("contato")
})

app.get("/dashboard",(req,res)=> {
  res.render("dashboard")
})

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
