import React, {useState} from "react";
import {
    Alert,
    Button,
    Image,
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useColorScheme,
} from "react-native";
import Checkbox from "expo-checkbox";
import {Picker} from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import {sendReport} from "@/components/reportInteraction";
import {useSession} from "@/components/AuthContext";

const reportTypes = [
    "Violation Reports",
    "Maintenance Issues",
    "Safety Issues",
    "Suggestions for Improvement",
    "Feedback on Parking Enforcement",
] as const;
type ReportType = (typeof reportTypes)[number];
export type FormState = {
    title: string | null;
    typesOfReports: ReportType;
    description: string | null;
    image: string | null;
    email: string | null;
    involvesYou?: boolean;
    date: string | null;
};

export default function ReportScreen() {
    const {email} = useSession();
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);
    const typesOfReports: ReportType[] = [...reportTypes];

    const [form, setForm] = useState<FormState>({
        title: null,
        typesOfReports: "Violation Reports",
        description: null,
        image: null,
        email: null,
        involvesYou: false,
        date: null,
    });

    const handleInputChange = (name: string, value: string) => {
        setForm({...form, [name]: value});
    };

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert("Error", "Please log in to send a report.");
            return;
        }
        try {
            await sendReport(form, email);
            setForm({
                title: null,
                typesOfReports: "Violation Reports",
                description: null,
                image: null,
                email: null,
                involvesYou: false,
                date: null,
            });
            Alert.alert("Success", "Report sent successfully.");
        } catch (error) {
            console.error("Failed to send report:", error);
            Alert.alert("Error", "Failed to send report: " + error);
        }
    };

    const handleImageOption = () => {
        Alert.alert(
            "Upload Photo",
            "Choose the method",
            [
                {text: "Camera", onPress: () => takePhoto()},
                {text: "Library", onPress: () => pickImage()},
                {text: "Cancel", style: "cancel"},
            ],
            {cancelable: true}
        );
    };

    const pickImage = async () => {
        const {status} = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            const {status} =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need media library permissions to make this work!");
                return;
            }
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({...form, image: result.assets[0].uri});
        }
    };

    const handleCheckBoxChange = (value: boolean) => {
        setForm({...form, involvesYou: value});
    };

    const takePhoto = async () => {
        const {status} = await ImagePicker.getCameraPermissionsAsync();
        if (status !== "granted") {
            const {status} = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                alert("Sorry, we need camera permissions to make this work!");
                return;
            }
        }

        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({...form, image: result.assets[0].uri});
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView contentContainerStyle={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Title"
                    placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
                    value={form.title ?? ""}
                    onChangeText={(text) => handleInputChange("title", text)}
                />
                <Picker
                    selectedValue={form.typesOfReports}
                    style={[styles.input, {borderColor: '#fff', borderWidth: 1}]} // TODO: This line doesn't work
                    onValueChange={(itemValue) =>
                        handleInputChange("typesOfReports", itemValue)
                    }
                >
                    {typesOfReports.map((reportType) => (
                        <Picker.Item
                            key={reportType}
                            label={reportType}
                            value={reportType}
                        />
                    ))}
                </Picker>
                <TextInput
                    style={[styles.input, styles.description]}
                    placeholder="Description"
                    placeholderTextColor={colorScheme === "dark" ? "#fff" : "#000"}
                    value={form.description ?? ""}
                    onChangeText={(text) => handleInputChange("description", text)}
                    multiline={true}
                />
                <Checkbox
                    value={form.involvesYou}
                    onValueChange={handleCheckBoxChange}
                />
                <Text
                    style={{color: colorScheme === "dark" ? "#fff" : "#000"}}>
                    Does this report involve you?
                </Text>
                <TouchableOpacity onPress={handleImageOption} style={styles.button}>
                    <Text style={styles.buttonText}>Add an image</Text>
                </TouchableOpacity>
                {form.image && (
                    <Image source={{uri: form.image}} style={styles.image}/>
                )}
                <Button title="Submit Report" onPress={handleSubmit}/>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const Styles = (colorScheme: string | null | undefined) =>
    StyleSheet.create({
        container: {
            marginTop: 120,
            marginBottom: 20,
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
        },
        title: {
            fontSize: 20,
            fontWeight: "bold",
            color: colorScheme === "dark" ? "#fff" : "#000",
            // Change placeholder color
        },
        input: {
            width: "80%",
            padding: 10,
            marginVertical: 10,
            borderWidth: 1,
            borderColor: colorScheme === "dark" ? "#fff" : "#000",
            backgroundColor: colorScheme === "dark" ? "#555" : "#eee",
            color: colorScheme === "dark" ? "#fff" : "#000",
        },
        description: {
            height: 100,
            color: colorScheme === "dark" ? "#fff" : "#000",
        },
        button: {
            backgroundColor: "#007BFF",
            padding: 10,
            margin: 10,
        },
        buttonText: {
            color: "#fff",
        },
        image: {
            width: 100,
            height: 100,
            margin: 10,
        },
    });
