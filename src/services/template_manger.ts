import { createContext } from 'preact';

interface TemplateManagerContextValue {
  coords: Coords;
}

export const TemplateManagerContext = createContext<TemplateManagerContextValue | null>(null);
