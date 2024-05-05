import React, { useState } from 'react';
import { StatusBar, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';

export default function FaqScreen() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion((prevIndex) => (prevIndex === questionIndex ? null : questionIndex));
  };

  const faqData = [
    {
      question: '¿Cómo puedo hacer XYZ?',
      answer: 'Puedes hacer XYZ siguiendo estos pasos...',
    },
    {
      question: '¿Cuál es el horario de atención?',
      answer: 'Nuestro horario de atención es de lunes a viernes de 9:00 am a 5:00 pm.',
    },
    // Agrega más preguntas y respuestas aquí
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <TextInput 
        style={styles.input}
        placeholder="Filtrar búsqueda..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.separator} />
      <ScrollView style={styles.content}>
        {faqData.map((faq, index) => (
          <TouchableOpacity key={index} onPress={() => toggleQuestion(index)}>
            <View style={styles.faqItem}>
              <Text style={styles.question}>{faq.question}</Text>
              {expandedQuestion === index && <Text style={styles.answer}>{faq.answer}</Text>}
              {expandedQuestion === index ? (
                <Ionicons name="chevron-up-outline" size={24} color="#888" />
              ) : (
                <Ionicons name="chevron-down-outline" size={24} color="#888" />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 18,
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginBottom: 20,
  },
  content: {
    flex: 1,
    width: '100%',
  },
  faqItem: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  answer: {
    fontSize: 16,
    marginBottom: 10,
  },
});
