import express from "express";
import path from "path";
import methodOverride from 'method-override';
import fs from 'fs';
import multer from 'multer';

const app = express();
const PORT = 3000;
const upload = multer();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use(express.static(path.join(process.cwd(), "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const dataPath = path.join(process.cwd(), 'disciplinas.json');

const readData = () => {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error("Erro ao ler o arquivo de dados:", error);
        throw error;
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Erro ao salvar os dados:", error);
        throw error;
    }
};

app.get("/", (req, res) => { res.render("main"); });
app.get("/sobre", (req, res) => { res.render("sobre"); });
app.get("/projetos", (req, res) => {
  const projetos = [];
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
        const tecnologiasOrdenadas = tecnologiasProjetoConcluido.sort((a, b) => a.nome.localeCompare(b.nome)).slice(0, 5);
        const disciplinas = readData();
        res.render("dashboard", { totalDisciplinas: disciplinas.length, projetosConcluidos: projetosConcluidos, tecnologias: tecnologiasOrdenadas });
    } catch (error) {
        console.error("Erro no dashboard:", error);
        res.render("dashboard", { totalDisciplinas: 0, projetosConcluidos: 1, tecnologias: [] });
    }
});

app.get('/disciplinas', (req, res) => {
    try {
        console.log('--- ROTA GET /disciplinas ACIONADA ---');
        const disciplinas = readData();
        console.log(`${disciplinas.length} disciplinas encontradas.`);
        res.render('disciplinas', { disciplinas: disciplinas });
    } catch (error) {
        res.status(500).send("Erro ao buscar as disciplinas.");
    }
});

app.get('/disciplinas/nova', (req, res) => {
    res.render('novadisciplinas', { editar: false, disciplina: null });
});

app.post('/disciplinas/nova', upload.none(), (req, res) => {
    try {
        console.log('--- ROTA POST /disciplinas/nova ACIONADA ---');
        console.log('Body recebido:', req.body);
        
        const disciplinas = readData();
        const nextId = disciplinas.length > 0 ? Math.max(...disciplinas.map(d => d.id)) + 1 : 1;
        const nomeDisciplina = req.body.nome?.trim();

        if (!nomeDisciplina) {
            console.log('Nenhum nome recebido');
            return res.status(400).render('novadisciplinas', { editar: false, disciplina: null, error: 'Nome da disciplina é obrigatório' });
        }

        const novaDisciplina = { id: nextId, nome: nomeDisciplina };
        disciplinas.push(novaDisciplina);
        writeData(disciplinas);
        console.log('Disciplina salva:', novaDisciplina);

        res.redirect('/disciplinas');

    } catch (error) {
        res.status(500).send("Erro ao criar a disciplina.");
    }
});

app.get('/disciplinas/:id/editar', (req, res) => {
    try {
        console.log('--- ROTA GET /disciplinas/:id/editar ACIONADA ---');
        const id = parseInt(req.params.id);
        console.log(`Buscando disciplina com ID: ${id}`);

        const disciplinas = readData();
        const disciplina = disciplinas.find(d => d.id === id);

        if (disciplina) {
            console.log('Disciplina encontrada:', disciplina);
            res.render('novadisciplinas', { editar: true, disciplina: disciplina });
        } else {
            console.log(`Disciplina com ID ${id} não encontrada.`);
            res.status(404).send("Disciplina não encontrada");
        }
    } catch (error) {
        console.error('ERRO na rota GET de edição:', error);
        res.status(500).send("Erro interno ao buscar disciplina para edição.");
    }
});

app.put('/disciplinas/:id', (req, res) => {
    try {
        console.log('--- ROTA PUT /disciplinas/:id ACIONADA ---');
        console.log('ID recebido nos parâmetros:', req.params.id);
        console.log('Corpo (body) da requisição recebido:', req.body);

        const disciplinas = readData();
        const id = parseInt(req.params.id);
        const disciplinaIndex = disciplinas.findIndex(d => d.id === id);
        
        console.log(`Índice da disciplina encontrado no array: ${disciplinaIndex}`);

        if (disciplinaIndex !== -1 && req.body.nome && req.body.nome.trim() !== '') {
            console.log('Atualizando a disciplina...');
            disciplinas[disciplinaIndex].nome = req.body.nome.trim();
            writeData(disciplinas);
            res.redirect('/disciplinas');
        } else {
            console.log('Não foi possível atualizar.');
            const disciplina = disciplinas.find(d => d.id === id);
            res.status(400).render('novadisciplinas', { editar: true, disciplina: disciplina, error: 'Nome da disciplina é obrigatório' });
        }
    } catch (error) {
        console.error('ERRO na rota PUT:', error);
        res.status(500).send('Erro interno ao atualizar disciplina');
    }
});

app.delete('/disciplinas/:id', (req, res) => {
    try {
        console.log('--- ROTA DELETE /disciplinas/:id ACIONADA ---');
        const id = parseInt(req.params.id);
        console.log(`Tentando deletar disciplina com ID: ${id}`);

        let disciplinas = readData();
        const totalAntes = disciplinas.length;
        
        const disciplinasFiltradas = disciplinas.filter(d => d.id !== id);
        const totalDepois = disciplinasFiltradas.length;

        if (totalAntes > totalDepois) {
            writeData(disciplinasFiltradas);
            console.log(`Disciplina com ID ${id} deletada com sucesso.`);
        } else {
            console.log(`Nenhuma disciplina com ID ${id} foi encontrada para deletar.`);
        }

        res.redirect('/disciplinas');
    } catch (error) {
        console.error('ERRO na rota DELETE:', error);
        res.status(500).send('Erro interno ao deletar disciplina');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});