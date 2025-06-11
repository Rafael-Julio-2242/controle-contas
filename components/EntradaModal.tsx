import { AtualizarEntrada, CriarEntrada, Entrada } from '@/models/entrada';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';

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
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDataEntrada(selectedDate);
    }
  };

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
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
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

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Data</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.dateButton}
          >
            {dataEntrada.toLocaleDateString('pt-BR')}
          </Button>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={dataEntrada}
            mode="date"
            onChange={onChange}
            display="default"
          />
        )}

        <View style={styles.modalButtons}>
          <Button
            mode="outlined"
            onPress={onDismiss}
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
  dateContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dateButton: {
    borderColor: '#666',
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