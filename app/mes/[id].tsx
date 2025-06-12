import { CategoriesActions } from '@/actions/categories';
import { DataActions } from '@/actions/datas';
import { CustoModal } from '@/components/CustoModal';
import { EntradaModal } from '@/components/EntradaModal';
import exportMonthCsv from '@/helpers/exportMonthCsv';
import { InfoMes } from '@/interfaces/infoMes';
import { Categoria } from '@/models/categoria';
import { AtualizarCusto, CriarCusto, Custo } from '@/models/custo';
import { AtualizarEntrada, CriarEntrada, Entrada } from '@/models/entrada';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { PieChart } from 'react-native-chart-kit';
import { Appbar, Button, DefaultTheme, IconButton, PaperProvider, Portal, Text, TouchableRipple } from "react-native-paper";

const theme = {
 ...DefaultTheme,
 dark: false,        // para manter sempre claro
 colors: {
  ...DefaultTheme.colors,
  primary: '#1E90FF',            // azul dodger
  accent: '#1C86EE',             // azul complementar
  background: '#FFFFFF',         // fundo branco
  surface: '#FFFFFF',
  text: '#000000',
  placeholder: '#666666',
  disabled: '#CCCCCC',
  backdrop: 'rgba(0,0,0,0.5)',
 },
};

export default function Mes() {

 const router = useRouter();
 const { id } = useLocalSearchParams<{ id: string }>();

 const [infoMes, setInfoMes] = useState<InfoMes>();
 const [categorias, setCategorias] = useState<Categoria[]>([]);
 const [selectedCategoria, setSelectedCategoria] = useState<string>('todos');
 const [modalEntradaVisible, setModalEntradaVisible] = useState(false);
 const [modalCustoVisible, setModalCustoVisible] = useState(false);
 const [selectedEntrada, setSelectedEntrada] = useState<Entrada | null>(null);
 const [selectedCusto, setSelectedCusto] = useState<Custo | null>(null);

 // Estados para formulários
 const [tituloEntrada, setTituloEntrada] = useState('');
 const [fonteEntrada, setFonteEntrada] = useState('');
 const [valorEntrada, setValorEntrada] = useState('');
 const [fonteCusto, setFonteCusto] = useState('');
 const [descricaoCusto, setDescricaoCusto] = useState('');
 const [valorCusto, setValorCusto] = useState('');
 const [categoriaCusto, setCategoriaCusto] = useState('');
 const [dataCusto, setDataCusto] = useState(new Date());

 const db = useSQLiteContext();

 const handleBuscaInfo = async () => {

  try {
   const resInfoMes = DataActions.getMounthDetails(db, Number(id))
   const resCategorias = CategoriesActions.getAll(db)

   const [ infoMes, categorias ] = await Promise.all([resInfoMes, resCategorias])

   setInfoMes(infoMes)
   setCategorias(categorias)
  } catch (e: any) {
   console.log("Erro ao buscar informações do mês: ",e);
   Alert.alert("Houve um erro ao buscar informações do mês, contate o suporte: ", e.message);
  }

 }

 useEffect(() => {
  handleBuscaInfo()
 },[])

 const calcularTotalEntradas = () => {
  return infoMes?.entradas.reduce((acc, entrada) => acc + entrada.valor, 0) || 0;
 };

 const calcularTotalCustos = () => {
  return infoMes?.custos.reduce((acc, custo) => acc + custo.valor, 0) || 0;
 };

 const handleSalvarEntrada = async (entrada: CriarEntrada) => {
  try {
    entrada = {
      ...entrada,
      id_data: Number(id)
    }
    await DataActions.addEntry(db, entrada)
    handleBuscaInfo()
  } catch (e: any) {
    console.log("Erro ao salvar entrada: ",e);
    Alert.alert("Houve um erro ao salvar entrada, contate o suporte: ", e.message);
  }

  setModalEntradaVisible(false);
  limparFormularioEntrada();
 };

 const handleAtualizarEntrada = async (entrada: AtualizarEntrada) => {
  try {
    await DataActions.updateEntry(db, entrada)
    handleBuscaInfo()
  } catch (e: any) {
    console.log("Erro ao salvar entrada: ",e);
    Alert.alert("Houve um erro ao atualizar entrada, contate o suporte: ", e.message);
  }

  setModalEntradaVisible(false);
  limparFormularioEntrada();
 }

 const handleSalvarCusto = async (custo: CriarCusto) => {
  try {
    custo = {
      ...custo,
      id_data: Number(id)
    }
   await DataActions.addCost(db, custo)
   handleBuscaInfo()
  } catch (e: any) {
   console.log("Erro ao salvar custo: ",e);
   Alert.alert("Houve um erro ao salvar custo, contate o suporte: ", e.message);
   return;
  }

  setModalCustoVisible(false);
  limparFormularioCusto();
 };

 const handleAtualizarCusto = async (custo: AtualizarCusto) => {
  try {
    await DataActions.updateCost(db, custo)
    handleBuscaInfo()

  } catch (e: any) {
    console.log("Erro ao atualizar custo: ",e);
    Alert.alert("Houve um erro ao atualizar custo, contate o suporte: ", e.message);
    return;
  }

  setModalCustoVisible(false);
  limparFormularioCusto();
 }

 const handleVisualizarEdicaoEntrada = (entrada: Entrada) => {
  setSelectedEntrada(entrada); 
  setTituloEntrada(entrada.titulo);
  setFonteEntrada(entrada.fonte);
  setValorEntrada(entrada.valor.toString());
  setModalEntradaVisible(true);
 };

 const handleVisualizarEdicaoCusto = (custo: Custo) => {
  setSelectedCusto(prev => custo);
  setFonteCusto((prev) => custo.fonte);
  setDescricaoCusto((prev) => custo.descricao);
  setValorCusto((prev) => custo.valor.toString());
  setCategoriaCusto((prev) => custo.categoria?.toString() ?? '');
  setDataCusto((prev) => custo.data ? new Date(custo.data) : new Date());
  setModalCustoVisible(true);
 }

 const limparFormularioEntrada = () => {
  setTituloEntrada('');
  setFonteEntrada('');
  setValorEntrada('');
  setSelectedEntrada(prev => null);
 };

 const limparFormularioCusto = () => {
  setFonteCusto('');
  setDescricaoCusto('');
  setValorCusto('');
  setCategoriaCusto('');
  setDataCusto(new Date());
  setSelectedCusto(prev => null);
 };

 const handleExcluirEntrada = (id: number) => {
  Alert.alert(
   "Confirmar exclusão",
   "Tem certeza que deseja excluir esta entrada?",
   [
    { text: "Cancelar", style: "cancel" },
    {
     text: "Excluir",
     style: "destructive",
     onPress: async () => {
      try {
       await DataActions.deleteEntry(db, id)
       handleBuscaInfo()
      } catch (e: any) {
       console.log("Erro ao excluir entrada: ",e);
       Alert.alert("Houve um erro ao excluir entrada, contate o suporte: ", e.message);
      }
     }
    }
   ]
  );
 };

 const handleExcluirCusto = (id: number) => {
  Alert.alert(
   "Confirmar exclusão",
   "Tem certeza que deseja excluir este custo?",
   [
    { text: "Cancelar", style: "cancel" },
    {
     text: "Excluir",
     style: "destructive",
     onPress: async () => {
      try {
       await DataActions.deleteCost(db, id)
       handleBuscaInfo()
      } catch (e: any) {
       console.log("Erro ao excluir custo: ",e);
       Alert.alert("Houve um erro ao excluir custo, contate o suporte: ", e.message);
      }
     }
    }
   ]
  );
 };

 const handleSaveEntrada = async (entrada: CriarEntrada | AtualizarEntrada) => {
  if ('id' in entrada) {
    await handleAtualizarEntrada(entrada);
  } else {
    await handleSalvarEntrada(entrada);
  }

  limparFormularioEntrada();
  setModalEntradaVisible(false);
 };

 const handleSaveCusto = async (custo: CriarCusto | AtualizarCusto) => {
  if ('id' in custo) {
    await handleAtualizarCusto(custo);
  } else {
    await handleSalvarCusto(custo);
  }
 }

 const handleVoltar = () => {
  router.replace("/home");
 }

 const handleVisualizarEntrada = (idEntrada: number) => {
  router.push({ pathname: "/entrada/[id]", params: { id: idEntrada.toString(), idMes: id } });
 }

 const handleVisualizarCusto = (idCusto: number) => {
  router.push({ pathname: "/custo/[id]", params: { id: idCusto.toString(), idMes: id } });
 }

 const handleExportarCsv = async () => {
  if (!infoMes) return;

  try {

   const success = await exportMonthCsv(infoMes, categorias);

   if (!success) {
    Alert.alert("Erro ao exportar CSV", "Não foi possível exportar o CSV. Contate o suporte");
   }
  } catch (e: any) {
    console.log("Erro ao exportar CSV: ", e);
    Alert.alert("Houve um erro ao exportar CSV, contate o suporte: ", e.message);
  }

 }

 const screenWidth = Dimensions.get('window').width;

 const chartData = useMemo(() => {
  if (!infoMes) return [];

  if (infoMes.custos.length === 0) return [];

  const totalCustos = infoMes.custos.reduce((acc, custo) => acc + custo.valor, 0);

  const custosPorCategoria = infoMes.custos.reduce((acc, custo) => {
    const categoria = categorias.find(cat => cat.id === custo.categoria) || "Nao definido";

    if (!acc[typeof categoria === 'string' ? categoria : categoria.id]) {
      acc[typeof categoria === 'string' ? categoria : categoria.id] = 0;
    }
    acc[typeof categoria === 'string' ? categoria : categoria.id] += custo.valor;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(custosPorCategoria).map(([categoria, valor]) => {
    const categoriaObj = categorias.find(cat => cat.id === Number(categoria)) || "Nao definido";
    
    return {
      name: typeof categoriaObj === 'string' ? categoriaObj : categoriaObj.nome,
      population: valor / totalCustos,
      color: typeof categoriaObj === 'string' ? '#FFC107' : categoriaObj.cor,
      legendFontColor: '#333',
      legendFontSize: 14,
    }
  });

  return data;
 }, [infoMes])

  const chartConfig = {
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

 return (
  <PaperProvider theme={theme}>
   <KeyboardAvoidingView style={styles.container}>
    <Appbar.Header style={styles.header}>
     <Appbar.BackAction onPress={handleVoltar} />
     <Appbar.Content title={`${infoMes?.mes ?? 'Mês'} - ${infoMes?.ano ?? 'Ano'}`} style={{ alignItems: 'center' }} />
    </Appbar.Header>


    <ScrollView style={{ flex: 1 }}>
      <View style={{ alignItems: 'flex-end', marginTop: 5 }}>
        <Button mode="outlined" style={styles.addButton} onPress={handleExportarCsv}>Exportar</Button>
      </View>

      <View style={styles.totaisRow}>
      <View style={styles.totalBox}>
        <Text style={styles.totalTitle}>Total Recebido</Text>
        <Text style={[styles.totalValue, { color: '#2E8B57' }]}>R$ {calcularTotalEntradas().toFixed(2)}</Text>
      </View>
      <View style={styles.totalBox}>
        <Text style={styles.totalTitle}>Total Gasto</Text>
        <Text style={[styles.totalValue, { color: '#DC143C' }]}>R$ {calcularTotalCustos().toFixed(2)}</Text>
      </View>
      </View>
      <View style={styles.totalRestanteBox}>
        <Text style={styles.totalTitle}>Total Restante</Text>
        <Text style={[styles.totalValue, { color: (calcularTotalEntradas() - calcularTotalCustos()) >= 0 ? '#2E8B57' : '#DC143C' }]}>
          R$ {(calcularTotalEntradas() - calcularTotalCustos()).toFixed(2)}
        </Text>
      </View>

      <View style={styles.content}>
      {/* Entradas */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Entradas</Text>
        <Button mode="outlined" style={styles.addButton} onPress={() => { setSelectedEntrada(null); setModalEntradaVisible(true); }}>+Nova</Button>
      </View>
      <View style={styles.dashedCard}>
        <ScrollView style={styles.scrollContent}>
        {infoMes?.entradas.length ? infoMes.entradas.map((entrada) => (
          <TouchableRipple key={entrada.id} onPress={() => handleVisualizarEntrada(entrada.id)} rippleColor="rgba(5, 60, 222, 0.37)">
            <View key={entrada.id} style={styles.itemRow}>
            <Text style={styles.itemText}>{entrada.titulo} - R${entrada.valor.toFixed(2)}</Text>
            <View style={styles.itemActionsRow}>
              <IconButton icon="pencil" size={22} style={styles.editButton} onPress={() => handleVisualizarEdicaoEntrada(entrada)} />
              <IconButton icon="delete" size={22} style={styles.deleteButton} onPress={() => handleExcluirEntrada(entrada.id)} />
            </View>
            </View>
          </TouchableRipple>
        )) : <Text style={styles.emptyText}>Nenhuma entrada cadastrada.</Text>}
        </ScrollView>
      </View>

      {/* Categorias dos custos */}
      {categorias.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasRow}>
        <Button
          key="todos"
          mode={selectedCategoria === 'todos' ? 'contained' : 'outlined'}
          style={styles.categoriaButton}
          onPress={() => setSelectedCategoria('todos')}
          >
          Todos
          </Button>
        {categorias.map(cat => (
          <Button
          key={cat.id}
          mode={selectedCategoria === cat.id.toString() ? 'contained' : 'outlined'}
          style={styles.categoriaButton}
          onPress={() => setSelectedCategoria(cat.id.toString())}
          >
          {cat.nome}
          </Button>
        ))}
        </ScrollView>
      )}

      {/* Custos */}
      <View style={styles.sectionHeaderRow}>
        <Text style={styles.sectionTitle}>Custos</Text>
        <Button mode="outlined" style={styles.addButton} onPress={() => { setSelectedCusto(null); setModalCustoVisible(true); }}>+Novo</Button>
      </View>
      <View style={styles.dashedCard}>
        <ScrollView style={styles.scrollContent}>
        {infoMes?.custos.filter(c => selectedCategoria === 'todos' || c.categoria?.toString() === selectedCategoria).length ?
          infoMes?.custos.filter(c => selectedCategoria === 'todos' || c.categoria?.toString() === selectedCategoria).map((custo) => (
          <TouchableRipple key={custo.id} onPress={() => handleVisualizarCusto(custo.id)} rippleColor="rgba(5, 60, 222, 0.37)">
            <View style={styles.itemRow}>
              <Text style={styles.itemText}>{custo.fonte} R$ {custo.valor.toFixed(2)}</Text>
                <View style={styles.itemActionsRow}>
                  <IconButton icon="pencil" size={22} style={styles.editButton} onPress={() => handleVisualizarEdicaoCusto(custo)} />
                  <IconButton icon="delete" size={22} style={styles.deleteButton} onPress={() => handleExcluirCusto(custo.id)} />
                </View>
            </View>
          </TouchableRipple>
          )) : <Text style={styles.emptyText}>Nenhum custo cadastrado.</Text>}
        </ScrollView>
      </View>
      </View>

      <Portal>
      <EntradaModal
        visible={modalEntradaVisible}
        onDismiss={() => {
        setModalEntradaVisible(false);
        limparFormularioEntrada();
        }}
        onSave={handleSaveEntrada}
        entrada={selectedEntrada ?? undefined}
      />

      <CustoModal
        visible={modalCustoVisible}
        onDismiss={() => {
          setModalCustoVisible(false);
          limparFormularioCusto();
        }}
        onSave={handleSaveCusto}
        categorias={categorias}
        custo={selectedCusto ?? undefined}
      />
      </Portal>

      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', fontFamily: 'monospace', marginBottom: 16 }}>Gráfico de Despesas por categoria</Text>
        <PieChart 
          data={chartData}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor='transparent'
          paddingLeft="15"
        />
      </View>
    </ScrollView>


    
   </KeyboardAvoidingView>
  </PaperProvider>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 16,
  margin: 8,
  overflow: 'hidden',
 },
 header: {
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  backgroundColor: '#fff',
  elevation: 0,
  shadowOpacity: 0,
 },
 totaisRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 24,
  marginBottom: 16,
  paddingHorizontal: 24,
 },
 totalBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#bbb',
  borderRadius: 12,
  marginHorizontal: 8,
  alignItems: 'center',
  paddingVertical: 16,
  backgroundColor: '#fff',
 },
 totalRestanteBox: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#bbb',
  borderRadius: 12,
  marginHorizontal: 8,
  alignItems: 'center',
  paddingVertical: 16,
  backgroundColor: '#fff',
  maxHeight: 100,
  width: 200,
  alignSelf: "center"
 },
 totalTitle: {
  fontSize: 16,
  color: '#222',
  marginBottom: 4,
  fontFamily: 'monospace',
 },
 totalValue: {
  fontSize: 20,
  fontWeight: 'bold',
  fontFamily: 'monospace',
 },
 content: {
  flex: 1,
  paddingHorizontal: 16,
 },
 sectionHeaderRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginTop: 24,
  marginBottom: 4,
 },
 sectionTitle: {
  fontSize: 18,
  fontWeight: 'bold',
  fontFamily: 'monospace',
 },
 addButton: {
  borderRadius: 6,
  paddingHorizontal: 16,
  paddingVertical: 2,
  fontFamily: 'monospace',
 },
 scrollContent: {
  maxHeight: 200,
 },
 dashedCard: {
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: '#bbb',
  borderRadius: 10,
  padding: 10,
  marginBottom: 16,
  backgroundColor: '#fff',
 },
 itemRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
 },
 itemText: {
  fontSize: 15,
  fontFamily: 'monospace',
  flex: 1,
 },
 itemActionsRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginLeft: 8,
 },
 editButton: {
  backgroundColor: '#eee',
  borderRadius: 6,
  marginRight: 2,
 },
 deleteButton: {
  backgroundColor: '#ffeaea',
  borderRadius: 6,
  marginLeft: 2,
 },
 emptyText: {
  color: '#bbb',
  fontStyle: 'italic',
  fontFamily: 'monospace',
  textAlign: 'center',
  marginVertical: 8,
 },
 categoriasRow: {
  flexDirection: 'row',
  marginBottom: 8,
  marginTop: 0,
  minHeight: 40,
  maxHeight: 45,
 },
 categoriaButton: {
  marginRight: 8,
  borderRadius: 8,
  fontFamily: 'monospace',
 },
 modalContainer: {
  backgroundColor: 'white',
  padding: 20,
  margin: 20,
  borderRadius: 8,
 },
 modalTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  textAlign: 'center',
 },
 input: {
  marginBottom: 16,
 },
 pickerContainer: {
  marginBottom: 16,
 },
 pickerLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 4,
 },
 picker: {
  backgroundColor: '#f5f5f5',
  borderRadius: 4,
 },
 modalButtons: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
 },
 modalButton: {
  flex: 1,
  marginHorizontal: 8,
 },
 fab: {
  position: 'absolute',
  margin: 16,
  right: 0,
  bottom: 0,
  backgroundColor: '#1E90FF',
 },
});