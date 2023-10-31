const generateToken = (): string => Math.random().toString(36).substr(2, 5);

export { generateToken };
