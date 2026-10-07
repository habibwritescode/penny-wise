import { COLOURS } from "@/utils/constants";

type ColourName = keyof typeof COLOURS;

// `currentTheme` is the edited item's own colour, which stays selectable.
const getThemeOptions = (list: { theme: string }[], currentTheme?: string) => {
  const colourNames = Object.keys(COLOURS) as ColourName[];
  const usedColours = list
    .map((item) => item.theme)
    .filter((theme) => theme !== currentTheme);

  return colourNames.map((colourName) => {
    const colourVariable = colourName.toLowerCase().replace(" ", "-");
    const colourHex = COLOURS[colourName];
    const isUsed = usedColours.includes(colourHex);

    return {
      name: (
        <span className="flex gap-3 items-center">
          <span
            className="h-4 w-4 shrink-0 rounded-full"
            style={{ backgroundColor: `hsl(var(--${colourVariable}))` }}
          />
          {colourName}
        </span>
      ),
      value: colourHex,
      disabled: isUsed,
      hint: isUsed ? "Already used" : undefined,
    };
  });
};

export default getThemeOptions;
