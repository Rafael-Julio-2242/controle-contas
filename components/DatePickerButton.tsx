import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface DatePickerButtonProps {
  date: Date;
  onDateChange: (date: Date) => void;
  label?: string;
}

export function DatePickerButton({ date, onDateChange, label = 'Data' }: DatePickerButtonProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };

  return (
    <View style={styles.dateContainer}>
      <Text style={styles.dateLabel}>{label}</Text>
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {date.toLocaleDateString('pt-BR')}
      </Button>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          onChange={onChange}
          display="default"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
}); 