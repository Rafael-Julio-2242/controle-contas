import { Data } from "@/models/data";
import { SQLiteDatabase } from "expo-sqlite";

export class DataActions {
 constructor() {}


 static async getAll(db: SQLiteDatabase) {
  const sql = `
   SELECT * FROM datas;
  `;

  const result = await db.getAllAsync(sql) as Data[];
  console.log("result", result);
  return result;
 }

 static async create(db: SQLiteDatabase, mes: string, ano: string) {
  const sql = `
   INSERT INTO datas (mes, ano) VALUES (?, ?);
  `;

  const params = [mes, ano];

  const result = await db.runAsync(sql, params);
  return result;
 }

 static async delete(db: SQLiteDatabase, id: number) {
  const sql = `
   DELETE FROM datas WHERE id = ?;
  `;

  const params = [id];

  const result = await db.runAsync(sql, params);
  return result;
 }


}
