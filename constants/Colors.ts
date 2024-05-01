export const colors = {
    tintColorLight: '#2f95dc',
    tintColorDark: '#fff',
    blue_purple: '#635BFF',
    blue_purple_dark: '#5851DF',
    light_gray: '#F6F9FC',
    dark_gray: '#425466',
    slate: '#0A2540',
    black: '#000',
    white: '#fff',
    default: '#ccc',
};

export default {
    light: {
        text: colors.black,
        background: colors.white,
        tint: colors.tintColorLight,
        tabIconDefault: colors.default,
        tabIconSelected: colors.tintColorLight,
    },
    dark: {
        text: colors.white,
        background: colors.black,
        tint: colors.tintColorDark,
        tabIconDefault: colors.default,
        tabIconSelected: colors.tintColorDark,
    },
};
