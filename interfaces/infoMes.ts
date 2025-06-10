import { Custo } from "@/models/custo";
import { Entrada } from "@/models/entrada";

export interface InfoMes {
 data_id: number;
 mes: string;
 ano: string;
 custos: Custo[];
 entradas: Entrada[];
}
