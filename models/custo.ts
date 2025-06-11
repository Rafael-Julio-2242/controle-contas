export interface Custo {
 id: number;
 valor: number;
 fonte: string;
 descricao: string;
 categoria: number | null;
 data: Date;
 created_at?: string;
 id_data: number;
}
