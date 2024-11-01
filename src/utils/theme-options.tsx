import Typography from "@/components/typography";

import { COLORS } from "@/utils/constants";
import data from "@/utils/data.json";

const inUseColors = data.budgets.map((item) => item.theme);

type ColorKey = keyof typeof COLORS;

const THEME_OPTIONS = Object.keys(COLORS).map((item) => {
  const colorVariable = item.toLowerCase().replace(" ", "-");

  return {
    name: (
      <div className="flex gap-20 items-center min-w-full justify-between">
        <div className="flex items-center gap-3">
          <span
            className="h-4 w-4 rounded-full"
            style={{ backgroundColor: `hsl(var(--${colorVariable}))` }}
          />
          <Typography
            tag="span"
            variant="preset-4"
            className="text-grey-500 text-nowrap"
          >
            {item}
          </Typography>
        </div>

        <div className="ml-auto w-full">
          {inUseColors.includes(COLORS[item as ColorKey]) && (
            <Typography
              tag="span"
              variant="preset-5"
              className="text-grey-500 w-full"
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

export default THEME_OPTIONS;
