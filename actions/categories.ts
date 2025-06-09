import { Categoria } from "@/models/categoria";
import { SQLiteDatabase } from "expo-sqlite";


export class CategoriesActions {
 constructor() {}

 static async getAll(db: SQLiteDatabase) {
  const categories = await db.getAllAsync("SELECT * FROM categorias") as Categoria[];
  return categories;
 }

 static async create(db: SQLiteDatabase, name: string, icon: string, color: string) {
  const category = await db.runAsync("INSERT INTO categorias (nome, icon, cor) VALUES (?, ?, ?)", [name, icon, color]);
  return category;
 }

 static async delete(db: SQLiteDatabase, id: number) {
  const category = await db.runAsync("DELETE FROM categorias WHERE id = ?", [id]);
  return category;
 }

}
