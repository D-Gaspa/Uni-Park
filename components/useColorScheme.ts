import {useSession} from '@/components/AuthContext';

export function useColorSchemeWithSession() {
    const {theme} = useSession();
    return theme;
}

export {useColorScheme} from 'react-native';