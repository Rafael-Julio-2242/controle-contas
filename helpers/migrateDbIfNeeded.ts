import { SQLiteDatabase } from "expo-sqlite";

export default async function migrateDbIfNeeded(db: SQLiteDatabase) {
 const DATABASE_VERSION = 3;

 let versionResult = await db.getFirstAsync<{user_version: number}>(
  'PRAGMA user_version'
 );

 if (!versionResult || versionResult.user_version < DATABASE_VERSION) {
  console.log('Migrating database...');
  
   await db.execAsync(`
    DROP TABLE IF EXISTS migrations;
    DROP TABLE IF EXISTS datas;
    DROP TABLE IF EXISTS categorias;
    DROP TABLE IF EXISTS custos;
    DROP TABLE IF EXISTS entradas;
   `);
  
  await db.execAsync(`
   BEGIN TRANSACTION;

   -- Tabela que controla versão/migrações executadas
   CREATE TABLE IF NOT EXISTS migrations (
     version INTEGER PRIMARY KEY,
     applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
   );

   -- Tabela Datas
   CREATE TABLE IF NOT EXISTS datas (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     mes TEXT NOT NULL,
     ano TEXT NOT NULL,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   );

   -- Tabela Categorias
   CREATE TABLE IF NOT EXISTS categorias (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     nome TEXT NOT NULL,
     icon TEXT,
     cor TEXT,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
   );

   -- Tabela Custos
   CREATE TABLE IF NOT EXISTS custos (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     valor REAL NOT NULL,
     fonte TEXT,
     descricao TEXT,
     categoria INTEGER,
     data DATETIME,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     id_data INTEGER NOT NULL,
     FOREIGN KEY(categoria) REFERENCES categorias(id),
     FOREIGN KEY(id_data) REFERENCES datas(id)
   );

   -- Tabela Entradas
   CREATE TABLE IF NOT EXISTS entradas (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     titulo TEXT NOT NULL,
     fonte TEXT,
     valor REAL NOT NULL,
     data DATETIME,
     created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
     id_data INTEGER NOT NULL,
     FOREIGN KEY(id_data) REFERENCES datas(id)
   );

   COMMIT;
  `);

  await db.execAsync(`
   PRAGMA user_version = ${DATABASE_VERSION};
  `);

  console.log('Database migrated successfully');
 } else {
  console.log('Database is up to date');
 }
}
