import { AtualizarEntrada, CriarEntrada, Entrada } from '@/models/entrada';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';
import { DatePickerButton } from './DatePickerButton';

interface EntradaModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (entrada: CriarEntrada | AtualizarEntrada) => Promise<void>;
  entrada?: Entrada;
}

export function EntradaModal({ visible, onDismiss, onSave, entrada }: EntradaModalProps) {
  const [tituloEntrada, setTituloEntrada] = useState(entrada?.titulo ?? '');
  const [fonteEntrada, setFonteEntrada] = useState(entrada?.fonte ?? '');
  const [valorEntrada, setValorEntrada] = useState(entrada?.valor.toString() ?? '');
  const [dataEntrada, setDataEntrada] = useState(entrada?.data ? new Date(entrada.data) : new Date());

  const handleSave = async () => {
    if (entrada) {
      const entradaAtualizada: AtualizarEntrada = {
        id: entrada.id,
        titulo: tituloEntrada,
        fonte: fonteEntrada,
        valor: Number(valorEntrada),
        data: dataEntrada.toISOString()
      };
      await onSave(entradaAtualizada);
    } else {
      const novaEntrada: CriarEntrada = {
        titulo: tituloEntrada,
        fonte: fonteEntrada,
        valor: Number(valorEntrada),
        data: dataEntrada,
        id_data: 0, // Será definido pelo componente pai
      };
      await onSave(novaEntrada);
    }
    limparFormulario();
    onDismiss();
  };

  useEffect(() => {
    if (entrada) {
      setTituloEntrada(entrada.titulo);
      setFonteEntrada(entrada.fonte);
      setValorEntrada(entrada.valor.toString());
      setDataEntrada(entrada.data ? new Date(entrada.data) : new Date());
    }
  }, [entrada]);

  const limparFormulario = () => {
    setTituloEntrada('');
    setFonteEntrada('');
    setValorEntrada('');
    setDataEntrada(new Date());
  }

  const handleCancelar = () => {
    limparFormulario();
    onDismiss();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Portal>
        <Modal
          visible={visible}
          onDismiss={handleCancelar}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>
            {entrada ? 'Editar Entrada' : 'Nova Entrada'}
          </Text>

          <TextInput
            label="Título"
            value={tituloEntrada}
            onChangeText={setTituloEntrada}
            style={styles.input}
            mode="outlined"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={false}
            autoCapitalize='none'
          />

          <TextInput
            label="Fonte"
            value={fonteEntrada}
            onChangeText={setFonteEntrada}
            style={styles.input}
            mode="outlined"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={false}
            autoCapitalize='none'
          />

          <TextInput
            label="Valor"
            value={valorEntrada}
            onChangeText={setValorEntrada}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            autoComplete="off"
            autoCorrect={false}
            autoFocus={false}
            autoCapitalize='none'
          />

          <DatePickerButton
            date={dataEntrada}
            onDateChange={setDataEntrada}
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
              onPress={handleSave}
              style={styles.modalButton}
            >
              {entrada ? 'Atualizar' : 'Salvar'}
            </Button>
          </View>
        </Modal>
      </Portal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
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