import React, {useEffect, useState} from "react";
import {Alert, Button, Platform, StyleSheet, Text, View,} from "react-native";
import {StripeProvider, usePaymentSheet} from "@stripe/stripe-react-native";
import {Picker} from "@react-native-picker/picker";
import QRCode from "react-native-qrcode-svg";
import PagerView from "react-native-pager-view";
import {useSession} from "@/components/AuthContext";
import {checkExistingTicket, loadUserTicket, useUserTickets,} from "@/components/userRelatedInfo";
import {useColorScheme} from "@/components/useColorScheme";

const PUBLISHABLE_KEY =
    "pk_test_51PAdx8P3rEHNvqwVcLah9GdadbHX14xd91mwQOYDxVFYLUnZDA6gYEubrsWmrQ35SKJg38oDaY46nwRu8xdMjwMB00Ek5iyCBR";
const MERCHANT_IDENTIFIER = "merchant.com.stripe.reactnativeexample";

export default function TicketScreen() {
    const {email} = useSession();
    const userTickets = useUserTickets();
    const [ready, setReady] = useState(false);
    const {initPaymentSheet, presentPaymentSheet, loading} = usePaymentSheet();
    const [selectedTicket, setSelectedTicket] = useState("oneTimeTicket");
    const colorScheme = useColorScheme();
    const styles = Styles(colorScheme);

    const ticketOptions = [
        {label: "One Time Night Ticket", value: "oneTimeNightTicket"},
        {label: "One Time Ticket", value: "oneTimeTicket"},
        {label: "Sau Car Ticket", value: "sauCarTicket"},
        {label: "Sau Car Night Ticket", value: "sauCarNightTicket"},
        {label: "Sau Bike Ticket", value: "sauBikeTicket"},
    ];

    useEffect(() => {
        initialisePaymentSheet().then(r => r);
    }, [selectedTicket]);

    const initialisePaymentSheet = async () => {
        try {
            const paymentSheetParams = await fetchPaymentSheetParams();

            if (!paymentSheetParams) {
                console.error("Failed to fetch payment sheet parameters.");
                Alert.alert("Error", "Failed to fetch payment sheet parameters.");
                return;
            }

            const {error} = await initPaymentSheet({
                customerId: paymentSheetParams.customerId,
                customerEphemeralKeySecret: paymentSheetParams.ephemeralKey,
                paymentIntentClientSecret: paymentSheetParams.paymentIntentClientSecret,
                setupIntentClientSecret: paymentSheetParams.setupIntentClientSecret,
                merchantDisplayName: "UniPark",
                returnURL: "stripesample://stripe-redirect",
            });

            if (error) {
                Alert.alert("Error", error.message);
                console.log(error);
            } else {
                setReady(true);
            }
        } catch (error) {
            console.error("Failed to initialize payment sheet:", error);
            Alert.alert("Error", "Failed to initialize payment sheet: " + error);
        }
    };

    const fetchPaymentSheetParams = async () => {
        try {
            const response = await fetch(
                "https://chemical-olive-floor.glitch.me/create-payment-intent",
                {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email: email,
                        items: [{id: selectedTicket, quantity: 1}],
                        currency: "mxn",
                        payment_method_types: ["card"],
                    }),
                }
            );
            const data = await response.json();

            if (!response.ok) {
                console.error(`HTTP error! Status: ${response.status} - ${data.error}`);
                Alert.alert("Error", `HTTP error! Status: ${response.status} - ${data.error}`);
                return null;
            }
            return data;
        } catch (error) {
            console.error("Failed to fetch payment sheet params:", error);
            Alert.alert("Error", "Failed to fetch payment parameters: " + error);
            return null;
        }
    };

    async function buyTicket() {
        // Check if ticket is already bought
        if (await checkExistingTicket(selectedTicket)) {
            Alert.alert("Ticket Purchase", "You already have a ticket of this type.");
            return; // Exit the function early if the ticket already exists
        }

        const {error} = await presentPaymentSheet();
        if (error) {
            Alert.alert(`${error.code}`, error.message);
            console.log(error);
        } else {
            // Generate QR Code value
            const ticketId = "TICKETGENERATORTEXT"; // replace with actual ticket id

            await loadUserTicket(ticketId, selectedTicket);
            Alert.alert(
                "Success",
                "Your payment was successful and your ticket is ready!"
            );
            setReady(false);
        }
    }

    function formatTicketType(ticketType: string): string {
        // Replace uppercase letters with a space and the letter
        let result = ticketType.replace(/([A-Z])/g, ' $1');
        // Capitalize the first letter
        result = result.charAt(0).toUpperCase() + result.slice(1);
        return result;
    }

    return (
        <StripeProvider publishableKey={PUBLISHABLE_KEY} merchantIdentifier={MERCHANT_IDENTIFIER}>
            <View style={styles.container}>
                {/* Show a loading message if userTickets is null */}
                {userTickets === null && <View style={styles.centeredContent}><Text>Loading tickets...</Text></View>}

                {/* Show no tickets message if userTickets is an empty object */}
                {userTickets && Object.keys(userTickets).length === 0 &&
                    <View style={styles.centeredContent}><Text style={styles.noTicketsText}>You do not have
                        tickets</Text></View>}

                {/* Show "Swipe to view all your tickets" only when there are multiple tickets */}
                {userTickets && Object.keys(userTickets).length > 1 &&
                    <Text style={styles.header}>Swipe to view all your tickets</Text>}

                {/* Render tickets if there are any */}
                {userTickets && Object.keys(userTickets).length > 0 && (
                    // Display tickets in a pager view
                    <PagerView style={styles.pagerView} initialPage={0}>
                        {Object.entries(userTickets).map(([ticketType, ticketIds], index) => (
                            <View key={index} style={styles.page}>
                                {/* Format and display the ticket type */}
                                <Text
                                    style={{color: colorScheme === "light" ? "black" : "white"}}>{formatTicketType(ticketType)}</Text>

                                {/* Generate and display QR codes for each ticket */}
                                {ticketIds.map((ticketId, subIndex) => <QRCode key={subIndex} value={ticketId}
                                                                               size={200}/>)}
                            </View>
                        ))}
                    </PagerView>
                )}

                {/* Separator between tickets and purchase section */}
                <View style={styles.separator}/>

                {/* Purchase section */}
                <View style={styles.purchaseSection}>
                    <Text style={styles.header}>Purchase a ticket</Text>
                    <Text style={{color: colorScheme === "light" ? "black" : "white"}}>
                        Choose a ticket type to purchase
                    </Text>
                </View>

                {/* Ticket selection dropdown */}
                <Picker
                    selectedValue={selectedTicket}
                    onValueChange={setSelectedTicket}
                    dropdownIconColor={colorScheme === "light" ? "black" : "white"}
                    style={styles.picker}
                    mode="dialog"
                >
                    {/* Generate dropdown options for each ticket type */}
                    {ticketOptions.map((option) => <Picker.Item key={option.value} label={option.label}
                                                                value={option.value}/>)}
                </Picker>

                {/* Buy Ticket button */}
                <View style={styles.button}>
                    <Button title="Buy Ticket Now" onPress={buyTicket} disabled={!ready || loading}/>
                </View>
            </View>
        </StripeProvider>
    );
};

const Styles = (colorScheme: string | null | undefined) => StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold"
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: colorScheme === "light" ? "#f9f9f9" : "#222"
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        marginBottom: 5,
        color: colorScheme === "light" ? "black" : "white"
    },
    pagerView: {
        width: "100%",
        height: 250,
        marginBottom: 20
    },
    page: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    separator: {
        width: "100%",
        height: 1,
        backgroundColor: colorScheme === "light" ? "#ccc" : "#666",
    },
    purchaseSection: {
        width: "100%",
        alignItems: "center",
        marginTop: 20
    },
    picker: {
        color: colorScheme === "light" ? "black" : "white",
        backgroundColor: Platform.OS === "ios" ? "default" : colorScheme === "light" ? "#d1d1d1" : "#333",
        width: 300,
        height: Platform.OS === "ios" ? 150 : 40,
        marginTop: Platform.OS === "ios" ? 5 : 10,
        marginBottom: Platform.OS === "ios" ? 40 : 10
    },
    button: {
        borderRadius: 10,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    centeredContent: {
        alignItems: "center",
        color: colorScheme === "light" ? "black" : "white",
        justifyContent: "center",
        width: 200,
        height: 200
    },
    noTicketsText: {
        color: "red",
        fontSize: 16,
        fontWeight: "bold"
    },
});