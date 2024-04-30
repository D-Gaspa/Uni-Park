import React, { useState, useEffect } from "react";
import { View, Button, Text, Alert } from "react-native";
import { Link } from "expo-router";
import {
  StripeProvider,
  usePaymentSheet,
} from "@stripe/stripe-react-native";

const PUBLISHABLE_KEY = "pk_test_51PAdx8P3rEHNvqwVcLah9GdadbHX14xd91mwQOYDxVFYLUnZDA6gYEubrsWmrQ35SKJg38oDaY46nwRu8xdMjwMB00Ek5iyCBR"
const MERCHANT_IDENTIFIER = "merchant.com.stripe.reactnativeexample"
const SECRET_KEY = "sk_test_51PAdx8P3rEHNvqwVHurQAs7zDxkwfipRCrBW3ftSX36ahNBLY0M9vKyBrrHRCHczTpXfr1hctWU3yeXvZNicnbqM00tTVo7eS5"

const TicketScreen = () => {
  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();

  useEffect(() => {
    initialisePaymentSheet();
  }, []);

  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } =
      await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: "Your Merchant Name",
      allowsDelayedPaymentMethods: true,
      returnURL: "your-app://payment-complete",
    });
    if (error) {
      Alert.alert(`Error ${error.code}:`, error.message);
      console.log(error);
    } else {
      setReady(true);
    }
  };

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      "https://expo-stripe-server-example.glitch.me/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ id: "ticket" }],
        }),
      }
    );
    const { paymentIntent, ephemeralKey, customer } = await response.json();

    return { paymentIntent, ephemeralKey, customer };
  };

  async function buyTicket() {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error ${error.code}:`, error.message);
    } else {
      Alert.alert("Success", "Your payment was successful!");
      setReady(false);
    }
  }

    return (
      <StripeProvider
        publishableKey={PUBLISHABLE_KEY}
        merchantIdentifier={MERCHANT_IDENTIFIER}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Ticket Information</Text>
          <Link href="/payment" asChild>
            <Button
              title="Pay Now"
              accessibilityLabel="Pay Now"
              onPress={buyTicket}
              disabled={!ready || loading}
            />
          </Link>
        </View>
      </StripeProvider>
    );
};

export default TicketScreen;
