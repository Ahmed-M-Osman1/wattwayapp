import ThemeManager from '../custom-theme/ThemeManager';
import { buildCommonColor } from '../custom-theme/customCommonColor';

// Function to get the common colors for the theme
export const getCommonColor = () => {
    const themeManager = ThemeManager.getInstance();
    const themeDefinition = themeManager.getCurrentThemeDefinition();
    return buildCommonColor(themeDefinition);
};
