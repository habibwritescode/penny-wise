import Typography from "@/components/typography";

import { COLORS } from "@/utils/constants";

type ColorKey = keyof typeof COLORS;

const getThemeOptions = (list: any[]) => {
  const options = Object.keys(COLORS).map((item) => {
    const colorVariable = item.toLowerCase().replace(" ", "-");
    const inUseColors = list.map((item) => item.theme);

    return {
      name: (
        <div className="flex justify-between items-center border-b border-grey-100 pb-3">
          <div className="flex gap-3 items-center">
            <span
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: `hsl(var(--${colorVariable}))` }}
            />
            <Typography tag="span" variant="preset-4" className="text-grey-500">
              {item}
            </Typography>
          </div>

          <div>
            {inUseColors.includes(COLORS[item as ColorKey]) && (
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
      value: item,
    };
  });

  return options;
};

export default getThemeOptions;
