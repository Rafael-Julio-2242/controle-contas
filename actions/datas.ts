import { InfoMes } from "@/interfaces/infoMes";
import { Custo } from "@/models/custo";
import { Data } from "@/models/data";
import { CriarEntrada, Entrada } from "@/models/entrada";
import { SQLiteDatabase } from "expo-sqlite";

export class DataActions {
 constructor() {}


 static async getAll(db: SQLiteDatabase) {
  const sql = `
   SELECT * FROM datas;
  `;

  const result = await db.getAllAsync(sql) as Data[];
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

 static async getMounthDetails(db: SQLiteDatabase, id: number) {

  // Vai ser mais de uma busca

  const sql = `
   SELECT id, mes, ano FROM datas WHERE id = ?;
  `;

  const params = [id];

  const result = await db.getFirstAsync(sql, params) as any;

  const sqlCustos = `
   SELECT * FROM custos WHERE id_data = ?;
  `;

  const custos = await db.getAllAsync(sqlCustos, params) as Custo[];

  const sqlEntradas = `
   SELECT * FROM entradas WHERE id_data = ?;
  `;

  const entradas = await db.getAllAsync(sqlEntradas, params) as Entrada[];

  const info: InfoMes = {
   data_id: result.id,
   mes: result.mes,
   ano: result.ano,
   custos,
   entradas
  }

  return info;
 }

 static async addCost(db: SQLiteDatabase, custo: Custo) {

  const sql = `
   INSERT INTO custos (
    valor,
    fonte,
    descricao,
    categoria,
    data,
    id_data
   ) VALUES (
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
   );
  `

  const params = [custo.valor, custo.fonte, custo.descricao, custo.categoria, custo.data.toISOString(), custo.id_data];

  const result = await db.runAsync(sql, params);
  return result;
 }

 static async addEntry(db: SQLiteDatabase, entrada: CriarEntrada) {

  const sql = `
   INSERT INTO entradas (
    titulo,
    fonte,
    valor,
    data,
    id_data
   ) VALUES (
    ?,
    ?,
    ?,
    ?,
    ?
   );
  `;

  const params = [entrada.titulo, entrada.fonte, entrada.valor, entrada.data.toISOString(), entrada.id_data];

  const result = await db.runAsync(sql, params);
  return result;
 };

 static async updateCost(db: SQLiteDatabase, custo: Custo) {
  const sql = `
   UPDATE custos SET
    valor = ?,
    fonte = ?,
    descricao = ?,
    categoria = ?,
    data = ?
   WHERE id = ?;
  `;

  const params = [custo.valor, custo.fonte, custo.descricao, custo.categoria, custo.data.toISOString(), custo.id];

  const result = await db.runAsync(sql, params);
  return result;
 }

 static async updateEntry(db: SQLiteDatabase, entrada: Entrada) {
  const sql = `
   UPDATE entradas SET
    titulo = ?,
    fonte = ?,
    valor = ?,
    data = ?
   WHERE id = ?;
  `;

  const params = [entrada.titulo, entrada.fonte, entrada.valor, entrada.data.toISOString(), entrada.id];

  const result = await db.runAsync(sql, params);
  return result;
 }

 static async deleteCost(db: SQLiteDatabase, id: number) {
  const sql = `
   DELETE FROM custos WHERE id = ?;
  `;

  const params = [id];

  const result = await db.runAsync(sql, params);
  return result;
 }

 static async deleteEntry(db: SQLiteDatabase, id: number) {
  const sql = `
   DELETE FROM entradas WHERE id = ?;
  `;

  const params = [id];

  const result = await db.runAsync(sql, params);
  return result;
 }

}
