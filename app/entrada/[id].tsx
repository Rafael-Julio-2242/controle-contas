import { DataActions } from '@/actions/datas';
import { EntradaModal } from '@/components/EntradaModal';
import { Entrada } from '@/models/entrada';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Appbar, Button, DefaultTheme, PaperProvider, Text } from 'react-native-paper';

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

export default function EntradaPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const db = useSQLiteContext();

  const [entrada, setEntrada] = useState<Entrada | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const buscarEntrada = async () => {
    try {
      const entradaEncontrada = await DataActions.getEntryById(db, Number(id));
      if (!entradaEncontrada) {
        throw new Error("Entrada não encontrada");
      }
      setEntrada(entradaEncontrada);
    } catch (e: any) {
      console.log("Erro ao buscar entrada: ", e);
    }
  };

  const handleSalvarEntrada = async (entradaAtualizada: any) => {
    try {
      await DataActions.updateEntry(db, entradaAtualizada);
      await buscarEntrada();
    } catch (e: any) {
      console.log("Erro ao atualizar entrada: ", e);
    }
  };

  useEffect(() => {
    buscarEntrada();
  }, []);

  if (!entrada) {
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

  return (
    <PaperProvider theme={theme}>
      <View style={styles.container}>
        <Appbar.Header>
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content title={entrada.titulo} />
        </Appbar.Header>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.label}>Fonte</Text>
            <Text style={styles.value}>{entrada.fonte}</Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Data</Text>
            <Text style={styles.value}>
              {new Date(entrada.data).toLocaleDateString('pt-BR')}
            </Text>
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.label}>Valor</Text>
            <Text style={styles.value}>R$ {entrada.valor.toFixed(2)}</Text>
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

        <EntradaModal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          onSave={handleSalvarEntrada}
          entrada={entrada}
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
