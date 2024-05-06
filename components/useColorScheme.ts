import {useSession} from '@/components/AuthContext';

export function useColorScheme() {
    const {theme} = useSession();
    return theme;
}