import Typography from "@/components/typography";
import { COLOURS } from "@/utils/constants";

type ColourKey = keyof typeof COLOURS;

const getThemeOptions = (list: any[]) => {
  const colourNames = Object.keys(COLOURS) as ColourKey[];
  const inUseColors = list.map((item) => item.theme);

  const options = colourNames.map((colorName) => {
    const colorNameVariable = colorName.toLowerCase().replace(" ", "-");
    const colorHex = COLOURS[colorName];
    const isUsed = inUseColors.includes(colorHex);

    return {
      name: (
        <div className="flex justify-between items-center border-b border-grey-100 pb-3">
          <div className="flex gap-3 items-center">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: `hsl(var(--${colorNameVariable}))` }}
            />
            <Typography tag="span" variant="preset-4" className="text-grey-500">
              {colorName}
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
      // value: colorName,
      value: colorHex,
    };
  });

  return options;
};

export default getThemeOptions;
