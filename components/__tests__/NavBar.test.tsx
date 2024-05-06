import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import AppLayout from '../../app/(app)/_layout'; // Adjust the import path as necessary
import { ThemeProvider } from '@react-navigation/native';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock any hooks or external components that are not being tested
jest.mock('@/components/useColorScheme', () => ({
  useColorScheme: () => 'light',
}));
jest.mock('@/components/AuthContext', () => ({
  useSession: () => ({ session: true }),
}));

describe('AppLayout Navigation', () => {
  it('should render the navigation bar and maintain image display on button click', async () => {
    const { getByText, getByTestId } = render(
      <Router>
        <ThemeProvider value={{'dark'}}>
          <AppLayout />
        </ThemeProvider>
      </Router>
    );

    // Example of simulating a click event
    const faqButton = getByText('FAQ');
    fireEvent.click(faqButton);

    // Check if after clicking FAQ, the expected element is still visible
    await waitFor(() => {
      expect(getByTestId('image-id')).toBeVisible(); // Replace 'image-id' with the actual testId of the image
    });
  });
});
