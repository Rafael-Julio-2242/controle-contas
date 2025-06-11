export interface Entrada {
 id: number;
 titulo: string;
 fonte: string;
 valor: number;
 data: Date;
 created_at?: string;
 id_data: number;
}


export interface CriarEntrada {
 titulo: string;
 fonte: string;
 valor: number;
 data: Date;
 id_data: number;
}

export interface AtualizarEntrada {
  id: number;
  titulo: string;
  fonte: string;
  valor: number;
  data: string;
}