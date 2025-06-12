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

export interface CriarCusto {
 valor: number;
 fonte: string;
 descricao: string;
 categoria: number | null;
 data: Date;
 id_data: number;
}

export interface AtualizarCusto {
 id: number;
 valor: number;
 fonte: string;
 descricao: string;
 categoria: number | null;
 data: Date;
 id_data: number;
}
