export const colors = {
    tintColorLight: '#2f95dc',
    tintColorDark: '#fff',
    black: '#222',
    white: '#f9f9f9',
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
    dim: {
        text: colors.white,
        background: colors.black,
        tint: colors.tintColorDark,
        tabIconDefault: colors.default,
        tabIconSelected: colors.tintColorDark,
    }
};
