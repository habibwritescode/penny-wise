import Typography from "@/components/typography";
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
        <div className="flex justify-between items-center border-b border-grey-100 pb-3">
          <div className="flex gap-3 items-center">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: `hsl(var(--${colourVariable}))` }}
            />
            <Typography tag="span" variant="preset-4" className="text-grey-500">
              {colourName}
            </Typography>
          </div>

          <div>
            {isUsed && (
              <Typography
                tag="span"
                variant="preset-5"
                className="text-grey-500"
              >
                Already used
              </Typography>
            )}
          </div>
        </div>
      ),
      value: colourHex,
      disabled: isUsed,
    };
  });
};

export default getThemeOptions;
