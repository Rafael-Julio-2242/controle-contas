import { InfoMes } from '@/interfaces/infoMes';
import { Categoria } from '@/models/categoria';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as XLSX from 'xlsx';
import formataData from './formataData';

export default async function exportMonthCsv(info: InfoMes, categorias: Categoria[]) {

 if (!FileSystem.cacheDirectory) {
  console.log("cacheDirectory não encontrado");
  return false;
 }

 const workbook = XLSX.utils.book_new();

 const totalData = [
  {
   "Total Entradas": info.entradas.reduce((acc, entrada) => acc + entrada.valor, 0),
  "Total Custos": info.custos.reduce((acc, custo) => acc + custo.valor, 0),
  "Total Restante": info.entradas.reduce((acc, entrada) => acc + entrada.valor, 0) - info.custos.reduce((acc, custo) => acc + custo.valor, 0)
  }
 ];

 const entradasData = info.entradas.map(entrada => ({
  "Titulo": entrada.titulo, 
  "Fonte": entrada.fonte,
  "Valor": entrada.valor,
  "Data": formataData(typeof entrada.data === 'string' ? entrada.data : entrada.data.toISOString()),
 }));

 const custosData = info.custos.map(custo => ({
  "Descrição": custo.descricao,
  "Fonte": custo.fonte,
  "Valor": custo.valor,
  "Categoria": categorias.find(categoria => categoria.id === custo.categoria)?.nome,
  "Data": formataData(typeof custo.data === 'string' ? custo.data : custo.data.toISOString()),
 }));

 const totalWorksheet = XLSX.utils.json_to_sheet(totalData);
 const entradasWorksheet = XLSX.utils.json_to_sheet(entradasData);
 const custosWorksheet = XLSX.utils.json_to_sheet(custosData);

 XLSX.utils.book_append_sheet(workbook, totalWorksheet, `Total ${info.mes}-${info.ano}`);
 XLSX.utils.book_append_sheet(workbook, entradasWorksheet, `Entradas ${info.mes}-${info.ano}`);
 XLSX.utils.book_append_sheet(workbook, custosWorksheet, `Custos ${info.mes}-${info.ano}`);

 const csvContent = XLSX.write(workbook, {
  bookType: "xlsx",
  type: "base64"
 });
 
 if (await Sharing.isAvailableAsync()) {
  const dirInfo = await FileSystem.getInfoAsync(FileSystem.cacheDirectory!);

  if (!dirInfo.exists) {
   await FileSystem.makeDirectoryAsync(FileSystem.cacheDirectory!, {
    intermediates: true
   });
  }
  const tempFilePath = dirInfo.uri + `/export_${info.mes}-${info.ano}_${new Date().getTime()}.xlsx`;   

  await FileSystem.writeAsStringAsync(tempFilePath, csvContent, {
   encoding: FileSystem.EncodingType.Base64
  });

  await Sharing.shareAsync(tempFilePath, {
   mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
   dialogTitle: 'Compartilhar XLSX'
  });

  await FileSystem.deleteAsync(tempFilePath, { idempotent: true });

  return true;
 } else {
  return false
 }

}
