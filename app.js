import express from "express";
import path from "path";
import methodOverride from 'method-override';
import fs from 'fs';

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));
app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const dataPath = path.join(process.cwd(), 'disciplinas.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Erro ao ler o arquivo de dados:", error);
        return [];
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
    }
};

app.get("/", (req, res) => { res.render("main"); });
app.get("/sobre", (req, res) => { res.render("sobre"); });

app.get("/projetos", (req, res) => {
  const projetos = [
  {
    titulo: "Site para análise de dados de exportação e importação do estado de SP",
    descricao: "Desenvolvi um site com gráficos, filtros e caixas de pesquisa para dados públicos de importação e exportação.",
    solucao: "Utilizei Python para a limpeza e preparação dos dados, criando o backend e os filtros para o frontend.",
    link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-1DSM-API",
    tecnologias: ["Python", "JavaScript", "HTML", "CSS", "Pandas", "Flask","MySQL"],
    imagens: [
      "images/Pagina inicial projeto 1.png", "images/Sobre projeto 1.png", "images/Insights projeto 1.png", "images/Gráficos projeto 1.png", "images/Top 5 projeto 1.png",
    ],
  },
  {
    titulo: "Aplicação web CRM para centralizar e padronizar processos administrativos, comerciais e operacionais da Newe Log",
    descricao: "Este projeto visa desenvolver uma plataforma única que centralize processos administrativos, comerciais e operacionais da Newe Log.",
    solucao: "Utilizei React para criação das páginas da aplicação web, além de rotas e mockups para as páginas.",
    link: "https://github.com/Kernel-Panic-FatecSjc/KernelPanic-2DSM-API",
    tecnologias: ["React", "JavaScript", "Node.js", "CSS", "Express", "MySQL"],
    imagens: [
      "images/Interações projeto2.png", "images/Vendedores projeto 2.png", "images/Cadastro projeto 2.png", "images/Gestão projeto 2.png", "images/Funil projeto 2.png", "images/Agendamento projeto 2.png", "images/Graficos projeto 2.png",
    ],
  },
];
  res.render("projetos", { projetos });
});

app.get("/contato",(req,res)=> { res.render("contato") });

app.get("/dashboard", (req, res) => {
  try {
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

    let totalDisciplinas = 0;
    
    try {
      const disciplinas = readData();
      totalDisciplinas = disciplinas.length;
    } catch (error) {
      console.log("Usando valor padrão para disciplinas");
    }
    
    res.render("dashboard", {
      totalDisciplinas: totalDisciplinas,
      projetosConcluidos: projetosConcluidos,
      tecnologias: tecnologiasOrdenadas
    });
    
  } catch (error) {
    console.error("Erro no dashboard:", error);
    res.render("dashboard", {
      totalDisciplinas: 0,
      projetosConcluidos: 1,
      tecnologias: [
        { nome: "Python", count: 1 },
        { nome: "JavaScript", count: 1 },
        { nome: "HTML", count: 1 }
      ]
    });
  }
});

app.get('/disciplinas', (req, res) => {
  const disciplinas = readData();
  res.render('disciplinas', { disciplinas: disciplinas });
});

app.get('/disciplinas/nova', (req, res) => {
  res.render('novadisciplinas', { 
    editar: false, 
    disciplina: null 
  });
});

app.post('/disciplinas/nova', (req, res) => {
  try {
    const disciplinas = readData();
    const nextId = disciplinas.length > 0 ? Math.max(...disciplinas.map(d => d.id)) + 1 : 1;
    const nomeDisciplina = req.body.nome;
    
    if (nomeDisciplina && nomeDisciplina.trim() !== '') {
      disciplinas.push({ 
        id: nextId, 
        nome: nomeDisciplina.trim() 
      });
      writeData(disciplinas);
      res.redirect('/disciplinas');
    } else {
      res.render('novadisciplina', { 
        editar: false, 
        disciplina: null,
        error: 'Nome da disciplina é obrigatório' 
      });
    }
  } catch (error) {
    console.error('Erro ao criar disciplina:', error);
    res.status(500).render('novadisciplina', { 
      editar: false, 
      disciplina: null,
      error: 'Erro interno ao criar disciplina' 
    });
  }
});

app.get('/disciplinas/:id/editar', (req, res) => {
  const disciplinas = readData();
  const id = parseInt(req.params.id);
  const disciplina = disciplinas.find(d => d.id === id);
  if (disciplina) {
      res.render('novadisciplinas', { 
        editar: true, 
        disciplina: disciplina 
      });
  } else {
      res.status(404).send("Disciplina não encontrada");
  }
});

app.put('/disciplinas/:id', (req, res) => {
  try {
    const disciplinas = readData();
    const id = parseInt(req.params.id);
    const disciplinaIndex = disciplinas.findIndex(d => d.id === id);
    
    if (disciplinaIndex !== -1 && req.body.nome && req.body.nome.trim() !== '') {
      disciplinas[disciplinaIndex].nome = req.body.nome.trim();
      writeData(disciplinas);
      res.redirect('/disciplinas');
    } else {
      const disciplina = disciplinas.find(d => d.id === id);
      res.render('novadisciplina', { 
        editar: true, 
        disciplina: disciplina,
        error: 'Nome da disciplina é obrigatório' 
      });
    }
  } catch (error) {
    console.error('Erro ao atualizar disciplina:', error);
    res.status(500).send('Erro interno ao atualizar disciplina');
  }
});

app.delete('/disciplinas/:id', (req, res) => {
  let disciplinas = readData();
  const id = parseInt(req.params.id);
  disciplinas = disciplinas.filter(d => d.id !== id);
  writeData(disciplinas);
  res.redirect('/disciplinas');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

