export const colors = {
    americanSilver: '#d1d1d1',
    black: '#000',
    bleuDeFrance: '#2f95dc',
    chineseSilver: '#ccc',
    darkCharcoal: '#333',
    chineseBlack: '#0d1322',
    glaucous: '#5a7ac1',
    graniteGray: '#666',
    ghostWhite: '#f9f9f9',
    gray: '#bbb',
    lavenderGray: '#d6cfc0',
    metallicBlue: '#2e4577ff',
    raisinBlack: '#222',
    red: '#f00',
    spaceCadet: '#1d2c4d',
    white: '#fff',
    default: '#ccc',
};

export default {
    light: {
        background: colors.ghostWhite,
        buttonBackground: colors.bleuDeFrance,
        buttonExitBackground: colors.red,
        label: colors.graniteGray,
        logo: colors.black,
        pickerBackground: colors.americanSilver,
        placeholder: colors.graniteGray,
        separator: colors.chineseSilver,
        tabIconDefault: colors.default,
        tabIconSelected: colors.bleuDeFrance,
        text: colors.black,
        tint: colors.bleuDeFrance,
        warning: colors.red,
    },
    dark: {
        background: colors.raisinBlack,
        buttonBackground: colors.bleuDeFrance,
        buttonExitBackground: colors.red,
        label: colors.chineseSilver,
        logo: colors.white,
        pickerBackground: colors.darkCharcoal,
        placeholder: colors.graniteGray,
        separator: colors.graniteGray,
        tabIconDefault: colors.default,
        tabIconSelected: colors.white,
        text: colors.white,
        tint: colors.white,
        warning: colors.red,
    },
    blue: {
        background: colors.spaceCadet,
        buttonBackground: colors.glaucous,
        buttonExitBackground: colors.glaucous,
        label: colors.chineseSilver,
        logo: colors.white,
        pickerBackground: colors.metallicBlue,
        placeholder: colors.chineseSilver,
        separator: colors.chineseSilver,
        tabIconDefault: colors.default,
        tabIconSelected: colors.white,
        tabLayoutBackground: colors.chineseBlack,
        text: colors.white,
        tint: colors.white,
        warning: colors.americanSilver,
    }
};
