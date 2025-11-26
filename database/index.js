import { Sequelize } from "sequelize";
import DisciplinaModel from "./models/Disciplina.js";
import { createDatabaseIfNotExists } from "./createDB.js";

await createDatabaseIfNotExists();

const sequelize = new Sequelize("portfolio", "root", "feluvi0511", {
  host: "localhost",
  dialect: "mysql",
  logging: false
});

const Disciplina = DisciplinaModel(sequelize);

const seedDisciplinas = async () => {
  try {
    const disciplinasExistem = await Disciplina.count();
    
    if (disciplinasExistem === 0) {
      const disciplinasIniciais = [
        {
          "id": 1,
          "nome": "Desenvolvimento web 1"
        },
        {
          "id": 2,
          "nome": "Desenvolvimento web 2"
        },
        {
          "id": 3,
          "nome": "Design digital"
        },
        {
          "id": 4,
          "nome": "Técnicas de progamação"
        },
        {
          "id": 5,
          "nome": "Sistemas operacionais e redes de computadores"
        },
        {
          "id": 6,
          "nome": "Algoritmos e lógica de progamação"
        },
        {
          "id": 7,
          "nome": "Matemática Computacional"
        },
        {
          "id": 8,
          "nome": "Estrutura de dados"
        },
        {
          "id": 9,
          "nome": "Engenharia de Software 1"
        },
        {
          "id": 10,
          "nome": "Engenharia de Software 2"
        },
        {
          "id": 11,
          "nome": "Modelagem de banco de dados"
        },
        {
          "id": 12,
          "nome": "Banco de dados relacional"
        }
      ];

      await Disciplina.bulkCreate(disciplinasIniciais);
      console.log(`${disciplinasIniciais.length} disciplinas inseridas automaticamente!`);
    } else {
      console.log(`Já existem ${disciplinasExistem} disciplinas no banco. Nenhuma inserção necessária.`);
    }
  } catch (error) {
    console.error("Erro ao inserir disciplinas iniciais:", error);
  }
};

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Conectado ao MySQL!");

    await sequelize.sync({ alter: true });
    console.log("Banco sincronizado!");

    await seedDisciplinas();
  } catch (err) {
    console.error("Erro ao conectar/sincronizar o banco:", err);
  }
})();

export { sequelize, Disciplina };