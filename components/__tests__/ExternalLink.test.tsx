import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ExternalLink from '../ExternalLink';
import '@testing-library/jest-native/extend-expect';

describe('ExternalLink', () => {
    it('Renders the link with the correct href', () => {
        const href = 'https://aplicaciones.udlap.mx/accesos/Login.aspx';
        render(<ExternalLink href={href} />);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveProp('href', href);
    });
});