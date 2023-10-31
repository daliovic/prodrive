export const setSavedState = (state: any, storageKey: string) => {
    localStorage.setItem(storageKey, JSON.stringify(state));
};

export const getSavedState = (storageKey: string): any => {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return JSON.parse(<string>localStorage.getItem(storageKey));
};

export const deleteSavedState = (storageKey: string): any => {
    localStorage.removeItem(storageKey);
};