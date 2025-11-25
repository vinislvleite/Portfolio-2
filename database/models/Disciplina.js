import { DataTypes } from "sequelize";

export default (sequelize) => {
  const Disciplina = sequelize.define("Disciplina", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Disciplina;
};
