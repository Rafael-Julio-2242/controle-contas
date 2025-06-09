import { CategoriesActions } from '@/actions/categories';
import { Categoria } from '@/models/categoria';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Card, FAB, IconButton, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { SelectBottomSheet, SelectOption } from './components/SelectBottomSheet';

const ICONES: SelectOption[] = [
  { label: 'Compras', value: 'cart', icon: 'cart' },
  { label: 'Alimentação', value: 'food', icon: 'food' },
  { label: 'Transporte', value: 'car', icon: 'car' },
  { label: 'Moradia', value: 'home', icon: 'home' },
  { label: 'Saúde', value: 'medical-bag', icon: 'medical-bag' },
  { label: 'Educação', value: 'school', icon: 'school' },
  { label: 'Lazer', value: 'movie', icon: 'movie' },
  { label: 'Vestuário', value: 'hanger', icon: 'hanger' },
  { label: 'Contas', value: 'file-document', icon: 'file-document' },
  { label: 'Outros', value: 'dots-horizontal', icon: 'dots-horizontal' },
];

const CORES: SelectOption[] = [
  { label: 'Vermelho', value: '#FF0000', color: '#FF0000' },
  { label: 'Azul', value: '#1E90FF', color: '#1E90FF' },
  { label: 'Verde', value: '#32CD32', color: '#32CD32' },
  { label: 'Amarelo', value: '#FFD700', color: '#FFD700' },
  { label: 'Roxo', value: '#9370DB', color: '#9370DB' },
  { label: 'Laranja', value: '#FFA500', color: '#FFA500' },
  { label: 'Rosa', value: '#FF69B4', color: '#FF69B4' },
  { label: 'Cinza', value: '#808080', color: '#808080' },
];

export default function Categorias() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nomeCategoria, setNomeCategoria] = useState('');
  const [iconeSelecionado, setIconeSelecionado] = useState<SelectOption>(ICONES[0]);
  const [corSelecionada, setCorSelecionada] = useState<SelectOption>(CORES[0]);

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const db = useSQLiteContext();

  const handleAdicionar = async () => {
    
    try {
      await CategoriesActions.create(db, nomeCategoria, iconeSelecionado.value, corSelecionada.value);
      handleBuscarCategorias();
    } catch (e: any) {
      console.log('[erro ao adicionar categoria]: ', e.message);
    }

    setModalVisible(false);
    setNomeCategoria('');
    setIconeSelecionado(ICONES[0]);
    setCorSelecionada(CORES[0]);
  };

  const handleBuscarCategorias = async () => {

    try {
      const categorias = await CategoriesActions.getAll(db);
      setCategorias(categorias);
    } catch (e: any) {
      console.log('[erro ao buscar categorias]: ', e.message);
    }

  }

  useEffect(() => {
    handleBuscarCategorias();
  }, [])

  const handleCancelar = () => {
    setModalVisible(false);
    setNomeCategoria('');
    setIconeSelecionado(ICONES[0]);
    setCorSelecionada(CORES[0]);
  };

  const handleExcluirCategoria = async (id: number) => {
    try {
      await CategoriesActions.delete(db, id);
      handleBuscarCategorias();
    } catch (e: any) {
      console.log('[erro ao excluir categoria]: ', e.message);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Categorias" style={{ alignSelf: "center" }} />
      </Appbar.Header>
      
      <ScrollView style={styles.content}>
        {categorias.map((categoria) => (
          <Card key={categoria.id} style={styles.card}>
            <Card.Content style={styles.cardContent}>
              <View style={styles.cardLeftContent}>
                <MaterialCommunityIcons 
                  name={categoria.icon as any} 
                  size={32} 
                  color={categoria.cor} 
                />
                <Text style={styles.cardText}>{categoria.nome}</Text>
              </View>
              <IconButton
                icon="delete"
                iconColor="#FF0000"
                size={24}
                onPress={() => handleExcluirCategoria(categoria.id)}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={handleCancelar}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Nova Categoria</Text>
          
          <TextInput
            label="Nome da Categoria"
            value={nomeCategoria}
            onChangeText={setNomeCategoria}
            style={styles.input}
            mode="outlined"
          />

          <SelectBottomSheet
            options={ICONES}
            value={iconeSelecionado}
            onChange={setIconeSelecionado}
            placeholder="Selecione um ícone"
          />

          <SelectBottomSheet
            options={CORES}
            value={corSelecionada}
            onChange={setCorSelecionada}
            placeholder="Selecione uma cor"
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
              disabled={!nomeCategoria.trim()}
            >
              Adicionar
            </Button>
          </View>
        </Modal>
      </Portal>

      <FAB
        icon="plus"
        label="Adicionar Categoria"
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
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  cardLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E90FF',
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
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
}); 