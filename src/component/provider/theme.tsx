import { createContext } from 'preact-context';
import { SceneTheme } from '../../interface';

export const ThemeContext = createContext<SceneTheme>({});
