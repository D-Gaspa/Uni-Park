import React, { useState, useEffect } from "react";
import { View, Button, Text, Alert, StyleSheet } from "react-native";
import { StripeProvider, usePaymentSheet } from "@stripe/stripe-react-native";
import { Picker } from "@react-native-picker/picker";
import QRCode from "react-native-qrcode-svg";
import PagerView from "react-native-pager-view";
import { useSession } from "@/components/AuthContext";

const PUBLISHABLE_KEY =
  "pk_test_51PAdx8P3rEHNvqwVcLah9GdadbHX14xd91mwQOYDxVFYLUnZDA6gYEubrsWmrQ35SKJg38oDaY46nwRu8xdMjwMB00Ek5iyCBR";
const MERCHANT_IDENTIFIER = "merchant.com.stripe.reactnativeexample";

const TicketScreen = () => {
  interface Session {
    tickets?: String[];
  }

  const { tickets } = useSession().tickets as Session;

  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();
  const [selectedTicket, setSelectedTicket] = useState("oneTimeTicket");
  const [user, setUser] = useState(null);
  //const userEmail = useContext(AuthContext).role;

  const ticketOptions = [
    { label: "One Time Ticket", value: "oneTimeTicket" },
    { label: "One Time Night Ticket", value: "oneTimeNightTicket" },
    { label: "Sau Car Ticket", value: "sauCarTicket" },
    { label: "Sau Car Night Ticket", value: "sauCarNightTicket" },
    { label: "Sau Bike Ticket", value: "sauBikeTicket" },
  ];

  useEffect(() => {
    initialisePaymentSheet();
  }, [selectedTicket]);

  useEffect(() => {
    const fetchUser = async () => {
      //const db = firebase.firestore();
      //const doc = await db.collection('users').doc('user_id').get(); // replace 'user_id' with the actual user id
      //if (doc.exists) {
      //setUser(doc.data());
      //} else {
      //console.log('No such document!');
      //}
    };

    fetchUser();
  }, []);

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
            email: "student@gmail.com",
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
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`${error.code}`, error.message);
      console.log(error);
    } else {
      // Generate QR Code value
      const ticketId = "1234567890"; // replace with actual ticket id

      //setQRValue(`uniPark:${ticketId}`);
      Alert.alert(
        "Success",
        "Your payment was successful and your ticket is ready!"
      );
      //setReady(false);
    }
  }

  return (
    <StripeProvider
      publishableKey={PUBLISHABLE_KEY}
      merchantIdentifier={MERCHANT_IDENTIFIER}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Available Tickets</Text>
        {tickets ? (
          <PagerView style={styles.pagerView} initialPage={0}>
            {tickets.map((ticketId, index) => (
              <View key={index} style={styles.page}>
                <Text>Ticket ID: {ticketId}</Text>
                <QRCode value="hfudsfdif" size={200} />
              </View>
            ))}
          </PagerView>
        ) : (
          <Text>You do not have any available tickets</Text>
        )}

        <View style={styles.purchaseSection}>
          <Text style={styles.title}>Buy Ticket Now</Text>
          <Picker
            selectedValue={selectedTicket}
            onValueChange={(itemValue, itemIndex) =>
              setSelectedTicket(itemValue)
            }
            style={styles.picker}
          >
            <Picker.Item label="One Time Ticket" value="oneTimeTicket" />
            <Picker.Item
              label="One Time Night Ticket"
              value="oneTimeNightTicket"
            />
            <Picker.Item label="Sau Car Ticket" value="sauCarTicket" />
            <Picker.Item
              label="Sau Car Night Ticket"
              value="sauCarNightTicket"
            />
            <Picker.Item label="Sau Bike Ticket" value="sauBikeTicket" />
          </Picker>
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
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
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
  },
  picker: {
    width: 300,
    height: 50,
    marginBottom: 20,
  },
});

export default TicketScreen;
