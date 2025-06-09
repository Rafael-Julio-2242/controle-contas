import { DataActions } from '@/actions/datas';
import { Data } from '@/models/data';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';

export default function Index() {
 const [modalVisible, setModalVisible] = useState(false);
 const [modalExclusaoVisible, setModalExclusaoVisible] = useState(false);
 const [mesParaExcluir, setMesParaExcluir] = useState<Data | null>(null);
 const [novoMes, setNovoMes] = useState('');
 const [novoAno, setNovoAno] = useState('');
 const db = useSQLiteContext();
 const [meses, setMeses] = useState<Data[]>([]);

 const isFormValid = novoMes.trim() !== '' && novoAno.trim() !== '';

 const formatarValor = (valor: number) => {
  return valor.toLocaleString('pt-BR', {
   style: 'currency',
   currency: 'BRL'
  });
 };

 const handleExportar = () => {
  // Função será implementada posteriormente
  console.log('Exportar CSV');
 };

 const handleExcluir = async (index: number) => {
  try {
   await DataActions.delete(db, index);
   buscaDatas();
   setModalExclusaoVisible(false);
   setMesParaExcluir(null);
  } catch (e: any) {
   console.log("Erro ao excluir data: ", e);
  }
 };

 const handleAdicionar = async () => {
  if (!isFormValid) return;

  try {
   await DataActions.create(db, novoMes, novoAno);
   buscaDatas();
  } catch (e: any) {
   console.log("Erro ao adicionar nova data: ", e);
  }
  setModalVisible(false);
  setNovoMes('');
  setNovoAno('');
 };

 const handleCancelar = () => {
  setModalVisible(false);
  setNovoMes('');
  setNovoAno('');
 };

 const handleCancelarExclusao = () => {
  setModalExclusaoVisible(false);
  setMesParaExcluir(null);
 };

 const handleConfirmarExclusao = (mes: Data) => {
  setMesParaExcluir(mes);
  setModalExclusaoVisible(true);
 };

 const buscaDatas = async () => {
  try {
   const datas = await DataActions.getAll(db);
   setMeses(datas);
  } catch (e: any) {
   console.log("Erro ao buscar datas: ", e);
  }
 }

 useEffect(() => {
  buscaDatas();
 }, []);

 return (
  <KeyboardAvoidingView style={styles.container}>
   <Appbar.Header style={styles.header}>
    <Appbar.Content title="Controle de Contas" style={{ alignSelf: "center" }} />
   </Appbar.Header>

   <View style={styles.content}>
    <View style={styles.headerContent}>
     <Text style={styles.subtitle}>Meses</Text>
     <Button
      mode="contained"
      onPress={handleExportar}
      style={styles.exportButton}
     >
      Exportar tudo
     </Button>
    </View>
    <ScrollView style={styles.scrollView}>
     {meses.map((item) => (
      <Card key={item.id} style={styles.card}>
       <Card.Content style={styles.cardContent}>
        <View style={styles.cardLeftContent}>
         <Text style={styles.mesText}>{`${item.mes} - ${item.ano}`}</Text>
         <Text style={styles.valorText}>{formatarValor(0)}</Text>
        </View>
        <IconButton
         icon="delete"
         iconColor="#FF0000"
         size={24}
         onPress={() => handleConfirmarExclusao(item)}
         style={styles.deleteButton}
        />
       </Card.Content>
      </Card>
     ))}
    </ScrollView>
   </View>

   <Portal>
    <Modal
     visible={modalVisible}
     onDismiss={handleCancelar}
     contentContainerStyle={styles.modalContainer}
    >
     <Text style={styles.modalTitle}>Adicionar Novo Mês</Text>

     <TextInput
      label="Mês"
      value={novoMes}
      onChangeText={setNovoMes}
      style={styles.input}
      mode="outlined"
     />

     <TextInput
      label="Ano"
      value={novoAno}
      onChangeText={setNovoAno}
      style={styles.input}
      mode="outlined"
      keyboardType="numeric"
     />

     <View style={styles.modalButtons}>
      <Button
       mode="outlined"
       onPress={handleCancelar}
       style={styles.modalButton}
      >
       Cancelar
      </Button>
      <Button
       mode="contained"
       onPress={handleAdicionar}
       style={styles.modalButton}
       disabled={!isFormValid}
      >
       Confirmar
      </Button>
     </View>
    </Modal>

    <Modal
     visible={modalExclusaoVisible}
     onDismiss={handleCancelarExclusao}
     contentContainerStyle={styles.modalContainer}
    >
     <Text style={styles.modalTitle}>Confirmar Exclusão</Text>

     <Text style={styles.modalText}>
      Tem certeza que deseja excluir o mês {mesParaExcluir?.mes} - {mesParaExcluir?.ano}?
     </Text>

     <View style={styles.modalButtons}>
      <Button
       mode="outlined"
       onPress={handleCancelarExclusao}
       style={styles.modalButton}
      >
       Cancelar
      </Button>
      <Button
       mode="contained"
       onPress={() => mesParaExcluir && handleExcluir(mesParaExcluir.id)}
       style={[styles.modalButton, styles.deleteConfirmButton]}
      >
       Excluir
      </Button>
     </View>
    </Modal>
   </Portal>

   <FAB
    icon="plus"
    style={styles.fab}
    onPress={() => setModalVisible(true)}
    color="#fff"
   />



  </KeyboardAvoidingView>
 );
}

const styles = StyleSheet.create({
 container: {
  flex: 1,
  backgroundColor: '#fff',
 },
 header: {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  alignContent: "center",
  padding: 16,
 },
 content: {
  flex: 1,
  padding: 16,
 },
 headerContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
 },
 subtitle: {
  fontSize: 20,
  fontWeight: 'bold',
 },
 exportButton: {
  backgroundColor: '#2196F3',
 },
 scrollView: {
  flex: 1,
 },
 card: {
  marginBottom: 12,
  elevation: 2,
 },
 cardContent: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
 },
 cardLeftContent: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
 },
 mesText: {
  fontSize: 18,
  fontWeight: '500',
 },
 valorText: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#2196F3',
  marginRight: 16,
 },
 deleteButton: {
  margin: 0,
 },
 fab: {
  position: 'absolute',
  margin: 16,
  right: 0,
  bottom: 0,
  backgroundColor: '#2196F3',
  color: '#fff',
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
 modalText: {
  fontSize: 16,
  textAlign: 'center',
  marginBottom: 20,
 },
 input: {
  marginBottom: 16,
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
 deleteConfirmButton: {
  backgroundColor: '#FF0000',
 },
 drawer: {
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  width: 300,
  backgroundColor: 'white',
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: -2, height: 0 },
  shadowOpacity: 0.25,
  shadowRadius: 3.5,
  zIndex: 1,
 },
});
