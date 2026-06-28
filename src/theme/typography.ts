import { sfs } from "../utils/font";
import { FontFamilies } from "./fonts";

const createTypography = () => {
  const sizes = Array.from({ length: 40 }, (_, i) => i + 1);

  const typography: Record<string, any> = {};

  Object.entries(FontFamilies).forEach(([weight, fontFamily]) => {
    sizes.forEach((size) => {
      const key = `${weight}_${size}`;
      typography[key] = {
        fontSize: sfs(size),
        lineHeight: sfs(Math.round(size * 1.4)),
        fontFamily,
      };
    });
  });

  return typography;
};

export const Typography = createTypography();
