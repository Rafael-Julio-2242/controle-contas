import { Categoria } from '@/models/categoria';
import { Custo } from '@/models/custo';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Modal, Portal, Text, TextInput } from 'react-native-paper';

interface CustoModalProps {
  visible: boolean;
  onDismiss: () => void;
  onSave: (custo: Custo) => Promise<void>;
  categorias: Categoria[];
  custo?: Custo;
}

export function CustoModal({ visible, onDismiss, onSave, categorias, custo }: CustoModalProps) {
  const [fonteCusto, setFonteCusto] = useState(custo?.fonte ?? '');
  const [descricaoCusto, setDescricaoCusto] = useState(custo?.descricao ?? '');
  const [valorCusto, setValorCusto] = useState(custo?.valor.toString() ?? '');
  const [categoriaCusto, setCategoriaCusto] = useState(custo?.categoria?.toString() ?? '');

  const handleSave = async () => {

    let custoData = custo? (custo.data as any) : new Date();

    const custoAtualizado: Custo = {
      id: custo?.id ?? 0,
      categoria: categorias.length > 0 ? Number(categoriaCusto) : null,
      descricao: descricaoCusto,
      fonte: fonteCusto,
      valor: Number(valorCusto),
      data: typeof custoData === 'string' ? new Date(custoData) : custoData,
      id_data: custo?.id_data ?? 0,
    };

    await onSave(custoAtualizado);
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
            {custo ? 'Editar Custo' : 'Novo Custo'}
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
              Salvar
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
}); 