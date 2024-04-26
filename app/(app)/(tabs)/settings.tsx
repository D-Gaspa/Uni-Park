import {StyleSheet, Button} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import {Text, View} from '@/components/Themed';
import {useSession} from '@/components/ctx';

export default function SettingsScreen() {
    const {signOut} = useSession();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Tab Four</Text>
            <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)"/>
            <EditScreenInfo path="app/(tabs)/settings.tsx"/>
            <Button
                title="Sign Out"
                onPress={() => {
                    signOut();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});