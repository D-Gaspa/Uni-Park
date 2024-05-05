import React, { useState } from 'react';
import { StatusBar, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FaqScreen() {
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [comment, setComment] = useState('');

  const toggleQuestion = (questionIndex) => {
    setExpandedQuestion((prevIndex) => (prevIndex === questionIndex ? null : questionIndex));
  };

  const submitComment = () => {
    console.log('Comment submitted:', comment);
    setComment(''); // Clear comment after submission
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
    // Add more questions and answers here
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <TextInput 
        style={styles.input}
        placeholder="Filter search..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.separator} />
      <ScrollView style={styles.content}>
        {faqData.map((faq, index) => (
          <View key={index}>
            <TouchableOpacity onPress={() => toggleQuestion(index)} style={styles.faqItem}>
              <Text style={styles.question}>{faq.question}</Text>
              <Ionicons 
                name={expandedQuestion === index ? "chevron-up-outline" : "chevron-down-outline"} 
                size={24} 
                color="#888" 
                style={styles.icon}
              />
            </TouchableOpacity>
            {expandedQuestion === index && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </View>
        ))}
      </ScrollView>
      <Text style={styles.commentPrompt}>Didn't find what you wanted? Leave a comment.</Text>
      <TextInput 
        style={styles.commentInput}
        placeholder="Write your comment here..."
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button 
        title="Send comment"
        onPress={submitComment}
      />
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10, // Reduced marginBottom for better layout
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1, // Flex to push the icon to the right
  },
  answer: {
    fontSize: 16,
    padding: 10, // Added padding for better text display
    paddingLeft: 20, // Indent the answer to align under the question text
  },
  icon: {
    padding: 10,
  },
  commentPrompt: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  commentInput: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
