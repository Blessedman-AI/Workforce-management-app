const AVATAR_COLORS = [
  '#CA8A04', // Dark yellow
  '#059669', // Dark green
  '#FDBA74', // Light orange
  '#2563EB', // Dark blue
  '#EA580C', // Dark orange
  '#65A30D', //Dark lime
  '#DB2777', //Dark pink
  '#0891B2', //Dark cyan
  '#0D9488', //Dark teal
  '#FCA5A5', // Salmon
  '#D8B4FE', // Lavender
  '#86EFAC', // Mint
];

// Generate a random color from the predefined set
export const generateUserColor = () => {
  const randomIndex = Math.floor(Math.random() * AVATAR_COLORS.length);
  return AVATAR_COLORS[randomIndex];
};
