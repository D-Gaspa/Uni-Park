import React from 'react';
import { View, Button, Text } from 'react-native';
import { Link } from 'expo-router';

const TicketScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ticket Information</Text>
      <Link href="/payment" asChild>
        <Button
          title='Pay Now'
          accessibilityLabel='Pay Now'

        >
        </Button>
      </Link>
    </View>
  );
};

export default TicketScreen;
