import { createContext } from 'react';

export const SelectContext = createContext<{selected?: string | null, selectFn?: any}>(null);