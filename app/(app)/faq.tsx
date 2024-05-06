import React, {useState} from 'react';
import {
    Button,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {useColorScheme} from "@/components/useColorScheme";
import {Text, TextInput, useThemeColor, View} from "@/components/Themed";

export default function FaqScreen() {
    const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [comment, setComment] = useState('');
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);
    const buttonBackground = useThemeColor({}, 'buttonBackground');

    const toggleQuestion = (questionIndex: number | null) => {
        setExpandedQuestion((prevIndex) => (prevIndex === questionIndex ? null : questionIndex));
    };

    const submitComment = () => {
        console.log('Comment submitted:', comment);
        setComment(''); // Clear comment after submission
    };

    const faqData = [
        {
            question: 'Where can I physically purchase my parking ticket?',
            answer: 'You can purchase your physical parking ticket at any of the two Circle K locations on campus.',
        },
        {
            question: 'When can I report an accident for someone else?',
            answer: 'For security, the “Report for Someone Else” option should only be used by visual witnesses.',
        },
        {
            question: 'What are the parking regulations?',
            answer: 'You can review the parking regulations on the university site.',
        },
        {
            question: 'How do I pay for my parking ticket?',
            answer: 'You can pay for your parking ticket online or at any of the two Circle K locations on campus.',
        },
        {
            question: 'How do I appeal a parking ticket?',
            answer: 'You can appeal a parking ticket at the parking office.',
        },
        {
            question: 'How do I get a parking permit?',
            answer: 'You can get a parking permit at the parking office.',
        }
    ];

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}></Text>

            {/* Search Input */}
            <TextInput
                style={[styles.input, {marginTop: Platform.OS === "ios" ? "auto" : 20}]}
                placeholder="Filter search..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Separator */}
            <View style={styles.separator}/>

            {/* FAQ List */}
            <ScrollView style={styles.content}>
                {faqData
                    .filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((faq, index) => (
                        <View key={index}>
                            {/* FAQ Item */}
                            <TouchableOpacity onPress={() => toggleQuestion(index)} style={styles.faqItem}>
                                <Text style={styles.question}>{faq.question}</Text>
                                <Ionicons
                                    name={expandedQuestion === index ? "chevron-up-outline" : "chevron-down-outline"}
                                    size={24}
                                    color="#888"
                                    style={styles.icon}
                                />
                            </TouchableOpacity>
                            {/* FAQ Answer */}
                            {expandedQuestion === index && <Text style={styles.answer}>{faq.answer}</Text>}
                        </View>
                    ))}
            </ScrollView>

            {/* Comment Prompt */}
            <Text style={styles.commentPrompt}>Didn't find what you wanted? Leave a comment.</Text>

            {/* Comment Input */}
            <TextInput
                style={styles.commentInput}
                placeholder="Write your comment here..."
                value={comment}
                onChangeText={setComment}
                multiline
            />

            {/* Submit Comment Button */}
            <Button title="Send comment" onPress={submitComment} color={buttonBackground}/>

            {/* Status Bar */}
            <StatusBar barStyle={'default'}/>
        </View>
    );
}

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
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
        backgroundColor: colorScheme === "light" ? "#ccc" : "#666",
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
        borderColor: colorScheme === "light" ? "#ccc" : "#666",
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
        marginTop: 20,
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
