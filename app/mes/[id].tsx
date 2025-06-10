import { CategoriesActions } from '@/actions/categories';
import { DataActions } from '@/actions/datas';
import { InfoMes } from '@/interfaces/infoMes';
import { Categoria } from '@/models/categoria';
import { Custo } from '@/models/custo';
import { CriarEntrada, Entrada } from '@/models/entrada';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, DefaultTheme, IconButton, Modal, PaperProvider, Portal, Text, TextInput } from "react-native-paper";

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

 const handleSalvarEntrada = async () => {
  const entrada: CriarEntrada = {
   titulo: tituloEntrada,
   fonte: fonteEntrada,
   valor: Number(valorEntrada),
   data: new Date(),
   id_data: Number(id),
  }

  try {
   await DataActions.addEntry(db, entrada)
   handleBuscaInfo()
  } catch (e: any) {
   console.log("Erro ao salvar entrada: ",e);
  }

  setModalEntradaVisible(false);
  limparFormularioEntrada();
 };

 const handleSalvarCusto = () => {
  // Implementar lógica de salvar custo


  setModalCustoVisible(false);
  limparFormularioCusto();
 };

 const handleVisualizarEdicaoEntrada = (entrada: Entrada) => {
  
 }

 const limparFormularioEntrada = () => {
  setTituloEntrada('');
  setFonteEntrada('');
  setValorEntrada('');
  setSelectedEntrada(null);
 };

 const limparFormularioCusto = () => {
  setFonteCusto('');
  setDescricaoCusto('');
  setValorCusto('');
  setCategoriaCusto('');
  setSelectedCusto(null);
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
     onPress: () => {
      // Implementar lógica de exclusão
     }
    }
   ]
  );
 };

 return (
  <PaperProvider theme={theme}>
   <KeyboardAvoidingView style={styles.container}>
    <Appbar.Header style={styles.header}>
     <Appbar.BackAction onPress={() => router.back()} />
     <Appbar.Content title={`${infoMes?.mes ?? 'Mês'} - ${infoMes?.ano ?? 'Ano'}`} style={{ alignItems: 'center' }} />
    </Appbar.Header>

    <View style={styles.totaisRow}>
     <View style={styles.totalBox}>
      <Text style={styles.totalTitle}>Total Recebido</Text>
      <Text style={styles.totalValue}>R$ {calcularTotalEntradas().toFixed(2)}</Text>
     </View>
     <View style={styles.totalBox}>
      <Text style={styles.totalTitle}>Total Gasto</Text>
      <Text style={styles.totalValue}>R$ {calcularTotalCustos().toFixed(2)}</Text>
     </View>
    </View>

    <ScrollView style={styles.content}>
     {/* Entradas */}
     <View style={styles.sectionHeaderRow}>
      <Text style={styles.sectionTitle}>Entradas</Text>
      <Button mode="outlined" style={styles.addButton} onPress={() => { setSelectedEntrada(null); setModalEntradaVisible(true); }}>+Nova</Button>
     </View>
     <View style={styles.dashedCard}>
      {infoMes?.entradas.length ? infoMes.entradas.map((entrada) => (
       <View key={entrada.id} style={styles.itemRow}>
        <Text style={styles.itemText}>{entrada.titulo} - R${entrada.valor.toFixed(2)}</Text>
        <View style={styles.itemActionsRow}>
         <IconButton icon="pencil" size={22} style={styles.editButton} onPress={() => { setSelectedEntrada(entrada); setModalEntradaVisible(true); }} />
         <IconButton icon="delete" size={22} style={styles.deleteButton} onPress={() => handleExcluirEntrada(entrada.id)} />
        </View>
       </View>
      )) : <Text style={styles.emptyText}>Nenhuma entrada cadastrada.</Text>}
     </View>

     {/* Categorias dos custos */}
     {categorias.length > 0 && (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriasRow}>
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
      {infoMes?.custos.filter(c => selectedCategoria === 'todos' || c.categoria.toString() === selectedCategoria).length ?
       infoMes?.custos.filter(c => selectedCategoria === 'todos' || c.categoria.toString() === selectedCategoria).map((custo) => (
        <View key={custo.id} style={styles.itemRow}>
         <Text style={styles.itemText}>{custo.fonte} R$ {custo.valor.toFixed(2)}</Text>
         <View style={styles.itemActionsRow}>
          <IconButton icon="pencil" size={22} style={styles.editButton} onPress={() => { setSelectedCusto(custo); setModalCustoVisible(true); }} />
          <IconButton icon="delete" size={22} style={styles.deleteButton} onPress={() => handleExcluirCusto(custo.id)} />
         </View>
        </View>
       )) : <Text style={styles.emptyText}>Nenhum custo cadastrado.</Text>}
     </View>
    </ScrollView>

    <Portal>
     <Modal
      visible={modalEntradaVisible}
      onDismiss={() => {
       setModalEntradaVisible(false);
       limparFormularioEntrada();
      }}
      contentContainerStyle={styles.modalContainer}
     >
      <Text style={styles.modalTitle}>
       {selectedEntrada ? 'Editar Entrada' : 'Nova Entrada'}
      </Text>

      <TextInput
       label="Título"
       value={tituloEntrada}
       onChangeText={setTituloEntrada}
       style={styles.input}
       mode="outlined"
      />

      <TextInput
       label="Fonte"
       value={fonteEntrada}
       onChangeText={setFonteEntrada}
       style={styles.input}
       mode="outlined"
      />

      <TextInput
       label="Valor"
       value={valorEntrada}
       onChangeText={setValorEntrada}
       keyboardType="numeric"
       style={styles.input}
       mode="outlined"
      />

      <View style={styles.modalButtons}>
       <Button
        mode="outlined"
        onPress={() => {
         setModalEntradaVisible(false);
         limparFormularioEntrada();
        }}
        style={styles.modalButton}
       >
        Cancelar
       </Button>
       <Button
        mode="contained"
        onPress={handleSalvarEntrada}
        style={styles.modalButton}
       >
        Salvar
       </Button>
      </View>
     </Modal>

     <Modal
      visible={modalCustoVisible}
      onDismiss={() => {
       setModalCustoVisible(false);
       limparFormularioCusto();
      }}
      contentContainerStyle={styles.modalContainer}
     >
      <Text style={styles.modalTitle}>
       {selectedCusto ? 'Editar Custo' : 'Novo Custo'}
      </Text>

      <TextInput
       label="Fonte"
       value={fonteCusto}
       onChangeText={setFonteCusto}
       style={styles.input}
       mode="outlined"
      />

      <TextInput
       label="Descrição"
       value={descricaoCusto}
       onChangeText={setDescricaoCusto}
       style={styles.input}
       mode="outlined"
      />

      <TextInput
       label="Valor"
       value={valorCusto}
       onChangeText={setValorCusto}
       keyboardType="numeric"
       style={styles.input}
       mode="outlined"
      />

      <View style={styles.pickerContainer}>
       <Text style={styles.pickerLabel}>Categoria</Text>
       <Picker
        selectedValue={categoriaCusto}
        onValueChange={setCategoriaCusto}
        style={styles.picker}
       >
        <Picker.Item label="Selecione uma categoria" value="" />
        {categorias.map((categoria) => (
         <Picker.Item
          key={categoria.id}
          label={categoria.nome}
          value={categoria.id.toString()}
         />
        ))}
       </Picker>
      </View>

      <View style={styles.modalButtons}>
       <Button
        mode="outlined"
        onPress={() => {
         setModalCustoVisible(false);
         limparFormularioCusto();
        }}
        style={styles.modalButton}
       >
        Cancelar
       </Button>
       <Button
        mode="contained"
        onPress={handleSalvarCusto}
        style={styles.modalButton}
       >
        Salvar
       </Button>
      </View>
     </Modal>
    </Portal>
    
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
 dashedCard: {
  borderWidth: 1,
  borderStyle: 'dashed',
  borderColor: '#bbb',
  borderRadius: 10,
  padding: 10,
  marginBottom: 16,
  minHeight: 60,
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