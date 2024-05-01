import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { Picker } from "@react-native-picker/picker";
import QRCode from "react-native-qrcode-svg";
import PagerView from "react-native-pager-view";
import { useSession } from "@/components/AuthContext";
import {
  useUserTickets,
  loadUserTicket,
  checkExistingTicket,
} from "@/components/userRelatedInfo";

const PUBLISHABLE_KEY =
  "pk_test_51PAdx8P3rEHNvqwVcLah9GdadbHX14xd91mwQOYDxVFYLUnZDA6gYEubrsWmrQ35SKJg38oDaY46nwRu8xdMjwMB00Ek5iyCBR";
const MERCHANT_IDENTIFIER = "merchant.com.stripe.reactnativeexample";

const TicketScreen = () => {
  const { email } = useSession();
  const usertickets = useUserTickets();
  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  const [selectedTicket, setSelectedTicket] = useState("oneTimeTicket");
  const colorScheme = useColorScheme();

  const ticketOptions = [
    { label: "One Time Night Ticket", value: "oneTimeNightTicket" },
    { label: "One Time Ticket", value: "oneTimeTicket" },
    { label: "Sau Car Ticket", value: "sauCarTicket" },
    { label: "Sau Car Night Ticket", value: "sauCarNightTicket" },
    { label: "Sau Bike Ticket", value: "sauBikeTicket" },
  ];

  useEffect(() => {
    initialisePaymentSheet();
  }, [selectedTicket]);

  const initialisePaymentSheet = async () => {
    try {
      const paymentSheetParams = await fetchPaymentSheetParams();

      if (!paymentSheetParams) {
        throw new Error("Failed to fetch payment sheet parameters.");
      }

      const { error } = await initPaymentSheet({
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            items: [{ id: selectedTicket, quantity: 1 }],
            currency: "mxn",
            payment_method_types: ["card"],
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          `HTTP error! Status: ${response.status} - ${data.error}`
        );
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

    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`${error.code}`, error.message);
      console.log(error);
    } else {
      // Generate QR Code value
      const ticketId = "TICKETGENERATORTEXT"; // replace with actual ticket id

      loadUserTicket(ticketId, selectedTicket);
      Alert.alert(
        "Success",
        "Your payment was successful and your ticket is ready!"
      );
      setReady(false);
    }
  }
  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY}
      merchantIdentifier={MERCHANT_IDENTIFIER}
    >
      <View style={styles.container}>
        {usertickets === null ? (
          // If usertickets is null, show loading message
          <View style={[styles.centeredContent]}>
            <Text>Loading tickets...</Text>
          </View>
        ) : Object.keys(usertickets).length === 0 ? (
          // If usertickets is an empty object, show no tickets message
          <View style={[styles.centeredContent]}>
            <Text style={styles.noTicketsText}>You do not have tickets</Text>
          </View>
        ) : (
          // If there are tickets, render them
          <PagerView style={styles.pagerView} initialPage={0}>
            {Object.entries(usertickets).map(
              ([ticketType, ticketIds], index) => (
                <View key={index} style={styles.page}>
                  <Text style={styles.title}>{ticketType}</Text>
                  {ticketIds.map((ticketId, subIndex) => (
                    <QRCode key={subIndex} value={ticketId} size={200} />
                  ))}
                </View>
              )
            )}
          </PagerView>
        )}

        <Picker
          selectedValue={selectedTicket}
          onValueChange={(itemValue) => setSelectedTicket(itemValue)}
          itemStyle={{
            color: colorScheme === "light" ? "black" : "white",
            width: 300,
            height: 150,
          }}
          style={{
            color: colorScheme === "light" ? "black" : "white",
            width: 300,
            height: 150,
          }}
          mode="dialog"
        >
          {ticketOptions.map((option) => (
            <Picker.Item
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </Picker>
        <View style={styles.button}>
          <Button
            title="Buy Ticket Now"
            onPress={buyTicket}
            disabled={!ready || loading}
          />
        </View>
      </View>
    </StripeProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pagerView: {
    width: "100%",
    height: 250,
    marginBottom: 20,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  purchaseSection: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
  },
  picker: {
    width: 300,
    height: 50,
  },
  button: {
    borderRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centeredContent: {
    justifyContent: "center",
    alignItems: "center",
    width: 200,
    height: 200,
  },
  noTicketsText: {
    color: "red",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TicketScreen;
