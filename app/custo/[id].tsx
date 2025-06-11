import { CategoriesActions } from '@/actions/categories';
import { DataActions } from '@/actions/datas';
import { CustoModal } from '@/components/CustoModal';
import { Categoria } from '@/models/categoria';
import { Custo } from '@/models/custo';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Appbar, Button, DefaultTheme, PaperProvider, Text } from 'react-native-paper';

export default function CustoPage() {

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
  

  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();

  const [custo, setCusto] = useState<Custo | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const buscarCusto = async () => {
    try {

      try {
        const custo = await DataActions.getCostById(db, Number(id));  
        if (!custo) {
          throw new Error("Custo não encontrado");
        }
        setCusto(custo);
      } catch (e: any) {
        console.log("Erro ao buscar custo: ", e);
      }

      // setCusto(custoEncontrado);
    } catch (e: any) {
      console.log("Erro ao buscar custo: ", e);
    }
  };

  const buscarCategorias = async () => {
    try {
      const categoriasEncontradas = await CategoriesActions.getAll(db);
      setCategorias(categoriasEncontradas);
    } catch (e: any) {
      console.log("Erro ao buscar categorias: ", e);
    }
  };

  const handleSalvarCusto = async (custoAtualizado: Custo) => {
    try {

      await DataActions.updateCost(db, custoAtualizado);
      await buscarCusto();
    } catch (e: any) {
      console.log("Erro ao atualizar custo: ", e);
    }
  };

  useEffect(() => {
    buscarCusto();
    buscarCategorias();
  }, []);

  if (!custo) {
    return (
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Appbar.Header style={{ backgroundColor: "#fff" }}>
            <Appbar.BackAction color="#000" onPress={() => router.back()} />
            <Appbar.Content title="Carregando..." color="#000" />
          </Appbar.Header>
          
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        </View>
      </PaperProvider>
    );
  }

  const categoria = categorias.find(cat => cat.id === custo.categoria);

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={custo.fonte} />
        </Appbar.Header>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Descrição</Text>
            <Text style={styles.value}>{custo.descricao}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Categoria</Text>
            <Text style={styles.value}>{categoria?.nome ?? 'Sem categoria'}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>
              {new Date(custo.data).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Valor</Text>
            <Text style={styles.value}>R$ {custo.valor.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.button}
            textColor='#1E90FF'
          >
            Voltar
          </Button>
          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={{ ...styles.button, backgroundColor: "#1E90FF" }}
          >
            Editar
          </Button>
        </View>

        <CustoModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSalvarCusto}
          categorias={categorias}
          custo={custo}
        />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    color: "#000"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  infoSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    color: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 16,
  },
  button: {
    flex: 1,
  },
});
