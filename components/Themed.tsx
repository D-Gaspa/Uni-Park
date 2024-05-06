import {Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView} from 'react-native';
import {Picker as DefaultPicker, PickerItemProps} from "@react-native-picker/picker";
import Colors from '@/constants/Colors';
import {useColorSchemeWithSession} from "@/components/useColorScheme";
import React from "react";

type ThemeProps = {
    lightColor?: string;
    darkColor?: string;
    blueColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props'];
export type PickerProps = ThemeProps & DefaultPicker<string>['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
    props: { light?: string; dark?: string; blue?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark & keyof typeof Colors.blue
) {
    const theme = useColorSchemeWithSession() as 'light' | 'dark' | 'blue';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}

export function Text(props: TextProps) {
    const {style, lightColor, darkColor, blueColor, ...otherProps} = props;
    const color = useThemeColor({light: lightColor, dark: darkColor, blue: darkColor}, 'text');

    return <DefaultText style={[{color}, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps) {
    const {style, lightColor, darkColor, blueColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'pickerBackground');
    const color = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'text');
    const placeholderColor = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'placeholder');

    return <DefaultTextInput style={[{backgroundColor, color}, style]} placeholderTextColor={placeholderColor} {...otherProps} />;
}

export function View(props: ViewProps) {
    const {style, lightColor, darkColor, blueColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'background');

    return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}

export function Picker(props: PickerProps) {
    const {style, lightColor, darkColor, blueColor, ...otherProps} = props;
    const backgroundColor = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'pickerBackground');
    const color = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'text');
    const dropdownIconColor = useThemeColor({light: lightColor, dark: darkColor, blue: blueColor}, 'text');

    return <DefaultPicker style={[{backgroundColor, color}, style]} dropdownIconColor={dropdownIconColor} {...otherProps} />;
}

Picker.Item = DefaultPicker.Item as React.ComponentType<PickerItemProps<string>>;
