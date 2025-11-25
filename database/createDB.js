import mysql from "mysql2/promise";

export async function createDatabaseIfNotExists() {
  const connection = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "feluvi0511"
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS portfolio`);
  console.log("Banco criado/verificado com sucesso!");

  await connection.end();
}
