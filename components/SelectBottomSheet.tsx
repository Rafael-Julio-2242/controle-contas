import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Modal, Portal, Text } from 'react-native-paper';

export interface SelectOption {
  label: string;
  value: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: SelectOption;
  onChange: (option: SelectOption) => void;
  placeholder?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  color?: string;
}

export function SelectBottomSheet({
  options,
  value,
  onChange,
  placeholder = 'Selecione uma opção',
  icon,
  color,
}: SelectProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpen = () => {
    setModalVisible(true);
  };

  const handleSelect = (option: SelectOption) => {
    onChange(option);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity 
        style={styles.selectorButton} 
        onPress={handleOpen}
      >
        {icon ? (
          <MaterialCommunityIcons name={icon} size={24} color="#000" />
        ) : value.icon ? (
          <MaterialCommunityIcons name={value.icon} size={24} color="#000" />
        ) : color ? (
          <View style={[styles.colorPreview, { backgroundColor: color }]} />
        ) : value.color ? (
          <View style={[styles.colorPreview, { backgroundColor: value.color }]} />
        ) : null}
        <Text style={styles.selectorText}>
          {value.label || placeholder}
        </Text>
        <MaterialCommunityIcons name="chevron-down" size={24} color="#666" />
      </TouchableOpacity>

      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
          </View>
          <View style={styles.optionsContainer}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  value.value === option.value && styles.optionSelected
                ]}
                onPress={() => handleSelect(option)}
              >
                {option.icon ? (
                  <MaterialCommunityIcons name={option.icon} size={24} color="#000" />
                ) : option.color ? (
                  <View style={[styles.colorPreview, { backgroundColor: option.color }]} />
                ) : null}
                <Text style={styles.optionText}>{option.label}</Text>
                {value.value === option.value && (
                  <MaterialCommunityIcons name="check" size={24} color="#1E90FF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  selectorText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionSelected: {
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  colorPreview: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
}); 