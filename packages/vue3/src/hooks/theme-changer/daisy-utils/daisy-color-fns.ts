/* eslint-disable no-prototype-builtins */

import Color from "color";
import { DaisyColorConfig, DaisyColorShorthand } from "./daisy-types";

const colorNames: Record<string, string> = {
  primary: "--p",
  "primary-focus": "--pf",
  "primary-content": "--pc",

  secondary: "--s",
  "secondary-focus": "--sf",
  "secondary-content": "--sc",

  accent: "--a",
  "accent-focus": "--af",
  "accent-content": "--ac",

  neutral: "--n",
  "neutral-focus": "--nf",
  "neutral-content": "--nc",

  "base-100": "--b1",
  "base-200": "--b2",
  "base-300": "--b3",
  "base-content": "--bc",

  info: "--in",
  "info-content": "--inc",

  success: "--su",
  "success-content": "--suc",

  warning: "--wa",
  "warning-content": "--wac",

  error: "--er",
  "error-content": "--erc",
};
function approx(n: number, precision = 5): string {
  return n.toPrecision(precision).replace(/\.?0+$/, "");
}
export function generateForegroundColorFrom(input: string, percentage = 0.8) {
  if (Color(input).isDark()) {
    const arr = Color(input)
      .mix(Color("white"), percentage)
      .saturate(10)
      .hsl()
      .array();
    return (
      approx(arr[0]) + " " + approx(arr[1]) + "%" + " " + approx(arr[2]) + "%"
    );
  } else {
    const arr = Color(input)
      .mix(Color("black"), percentage)
      .saturate(10)
      .hsl()
      .array();
    return (
      approx(arr[0]) + " " + approx(arr[1]) + "%" + " " + approx(arr[2]) + "%"
    );
  }
}
// Feel free to change these values, idk what I'm doing
const darken_variants: any = {
  // first value is lightness change from default (400), second value is saturation change from default.
  "-950": [-0.8, -0.02], // darker
  "-900": [-0.75, -0.06],
  "-800": [-0.6, -0.12],
  "-700": [-0.45, -0.18],
  "-600": [-0.3, -0.24],
  "-500": [-0.15, -0.3],
  "-400": [0, 0],
  "-300": [0.15, -0.06],
  "-200": [0.3, -0.12],
  "-100": [0.45, -0.18],
  "-50": [0.6, -0.24], // brighter
};
const lighten_variants: any = {
  "-950": [0.8, -0.02], // brighter
  "-900": [0.75, -0.06],
  "-800": [0.6, -0.12],
  "-700": [0.45, -0.18],
  "-600": [0.3, -0.24],
  "-500": [0.15, -0.3],
  "-400": [0, 0],
  "-300": [-0.15, -0.06],
  "-200": [-0.3, -0.12],
  "-100": [-0.45, -0.18],
  "-50": [-0.6, -0.24], // darker
};

const generateVariants = function (
  prefix: string,
  color: Color,
  darkMode = true,
  primaryColor?: Color
): Record<string, string> {
  const toCol = (color2: Color, r1: number, s1: number) => {
    const c = color2[r1 > 0 ? "lighten" : "darken"](Math.abs(r1))
      .saturate(s1)
      .hsl()
      .round(2)
      .array();
    return approx(c[0]) + " " + approx(c[1]) + "%" + " " + approx(c[2]) + "%";
  };

  const out: Record<string, string> = {};
  const variants = darkMode ? darken_variants : lighten_variants;
  for (const i in variants) {
    // standard variation
    out[prefix + i] = toCol(color, variants[i][0], variants[i][1]);
    // if(prefix == '--b1') {
    //   out[prefix + i] =
    // }
  }
  return out;
};

// https://github.com/saadeghi/daisyui/blob/66ee475b0297fe56c5cef5867e1c83ef9dc6d5cb/src/colors/functions.js#L19
export const convertToDaisyHSLAndColor = (
  input: DaisyColorConfig,
  darkMode = true
): [
  Record<DaisyColorShorthand, string>, // the first result is the compiled daisy colors.
  Record<DaisyColorShorthand, Color> // the second result is a semi-processed color so we don't convert colors around all the time. it'll get consumed by vuetify color generators.
] => {
  const resultObj: Record<string, string> = {};
  const colorObj: Record<string, Color> = {};
  if (typeof input === "object" && input !== null) {
    Object.entries(input).forEach(([rule, value]) => {
      if (colorNames.hasOwnProperty(rule)) {
        const color = Color(value);
        const hslArray = color.hsl().round(2).array();
        colorObj[colorNames[rule]] = color;
        resultObj[colorNames[rule]] =
          hslArray[0] + " " + hslArray[1] + "%" + " " + hslArray[2] + "%";
      } else {
        resultObj[rule] = value;
      }
    });

    // auto generate focus colors
    if (!input.hasOwnProperty("primary-focus")) {
      const darkerHslArray = colorObj[colorNames["primary"]]
        .darken(0.2)
        .hsl()
        .round(2)
        .array();
      resultObj["--pf"] =
        darkerHslArray[0] +
        " " +
        darkerHslArray[1] +
        "%" +
        " " +
        darkerHslArray[2] +
        "%";
    }

    if (!input.hasOwnProperty("secondary-focus")) {
      const darkerHslArray = colorObj[colorNames["secondary"]]
        .darken(0.2)
        .hsl()
        .round(2)
        .array();
      resultObj["--sf"] =
        darkerHslArray[0] +
        " " +
        darkerHslArray[1] +
        "%" +
        " " +
        darkerHslArray[2] +
        "%";
    }

    if (!input.hasOwnProperty("accent-focus")) {
      const darkerHslArray = colorObj[colorNames["accent"]]
        .darken(0.2)
        .hsl()
        .round(2)
        .array();
      resultObj["--af"] =
        darkerHslArray[0] +
        " " +
        darkerHslArray[1] +
        "%" +
        " " +
        darkerHslArray[2] +
        "%";
    }

    if (!input.hasOwnProperty("neutral-focus")) {
      const darkerHslArray = colorObj[colorNames["neutral"]]
        .darken(0.2)
        .hsl()
        .round(2)
        .array();
      resultObj["--nf"] =
        darkerHslArray[0] +
        " " +
        darkerHslArray[1] +
        "%" +
        " " +
        darkerHslArray[2] +
        "%";
    }

    // auto generate base colors
    if (!input.hasOwnProperty("base-100")) {
      resultObj["--b1"] = 0 + " " + 0 + "%" + " " + 100 + "%";
    }

    if (!input.hasOwnProperty("base-200")) {
      const darkerHslArray = colorObj[colorNames["base-100"]]
        .darken(0.1)
        .hsl()
        .round(2)
        .array();
      resultObj["--b2"] =
        darkerHslArray[0] +
        " " +
        darkerHslArray[1] +
        "%" +
        " " +
        darkerHslArray[2] +
        "%";
    }

    Object.assign(
      resultObj,
      generateVariants("--p", colorObj["--p"], darkMode)
    );
    Object.assign(
      resultObj,
      generateVariants("--s", colorObj["--s"], darkMode)
    );
    Object.assign(
      resultObj,
      generateVariants("--a", colorObj["--a"], darkMode)
    );
    Object.assign(
      resultObj,
      generateVariants("--b1", colorObj["--b1"], darkMode)
    );
    Object.assign(
      resultObj,
      generateVariants(
        "--b2",
        colorObj["--b2"] || Color(`hsl(${resultObj["--b2"]})`),
        darkMode
      )
    );

    if (!input.hasOwnProperty("base-300")) {
      if (input.hasOwnProperty("base-200")) {
        const darkerHslArray = colorObj[colorNames["base-200"]]
          .darken(0.15)
          .hsl()
          .round(2)
          .array();
        resultObj["--b3"] =
          darkerHslArray[0] +
          " " +
          darkerHslArray[1] +
          "%" +
          " " +
          darkerHslArray[2] +
          "%";
      } else {
        const darkerHslArray = colorObj[colorNames["base-100"]]
          .darken(0.15)
          .darken(0.15)
          .hsl()
          .round(2)
          .array();
        resultObj["--b3"] =
          darkerHslArray[0] +
          " " +
          darkerHslArray[1] +
          "%" +
          " " +
          darkerHslArray[2] +
          "%";
      }
    }

    // auto generate state colors
    if (!input.hasOwnProperty("info")) {
      resultObj["--in"] = 198 + " " + 93 + "%" + " " + 60 + "%";
    }
    if (!input.hasOwnProperty("success")) {
      resultObj["--su"] = 158 + " " + 64 + "%" + " " + 52 + "%";
    }
    if (!input.hasOwnProperty("warning")) {
      resultObj["--wa"] = 43 + " " + 96 + "%" + " " + 56 + "%";
    }
    if (!input.hasOwnProperty("error")) {
      resultObj["--er"] = 0 + " " + 91 + "%" + " " + 71 + "%";
    }

    // auto generate content colors
    if (!input.hasOwnProperty("base-content")) {
      resultObj["--bc"] = generateForegroundColorFrom(input["base-100"]);
    }
    if (!input.hasOwnProperty("primary-content")) {
      resultObj["--pc"] = generateForegroundColorFrom(input["primary"]);
    }

    if (!input.hasOwnProperty("secondary-content")) {
      resultObj["--sc"] = generateForegroundColorFrom(input["secondary"]);
    }

    if (!input.hasOwnProperty("accent-content")) {
      resultObj["--ac"] = generateForegroundColorFrom(input["accent"]);
    }

    if (!input.hasOwnProperty("neutral-content")) {
      resultObj["--nc"] = generateForegroundColorFrom(input["neutral"]);
    }

    if (!input.hasOwnProperty("info-content")) {
      if (input.hasOwnProperty("info") && input["info"]) {
        resultObj["--inc"] = generateForegroundColorFrom(input["info"]);
      } else {
        resultObj["--inc"] = 198 + " " + 100 + "%" + " " + 12 + "%";
      }
    }

    if (!input.hasOwnProperty("success-content")) {
      if (input.hasOwnProperty("success") && input["success"]) {
        resultObj["--suc"] = generateForegroundColorFrom(input["success"]);
      } else {
        resultObj["--suc"] = 158 + " " + 100 + "%" + " " + 10 + "%";
      }
    }

    if (!input.hasOwnProperty("warning-content")) {
      if (input.hasOwnProperty("warning") && input["warning"]) {
        resultObj["--wac"] = generateForegroundColorFrom(input["warning"]);
      } else {
        resultObj["--wac"] = 43 + " " + 100 + "%" + " " + 11 + "%";
      }
    }

    if (!input.hasOwnProperty("error-content")) {
      if (input.hasOwnProperty("error") && input["error"]) {
        resultObj["--erc"] = generateForegroundColorFrom(input["error"]);
      } else {
        resultObj["--erc"] = 0 + " " + 100 + "%" + " " + 14 + "%";
      }
    }

    // auto generate css variables
    if (!input.hasOwnProperty("--rounded-box")) {
      resultObj["--rounded-box"] = "1rem";
    }
    if (!input.hasOwnProperty("--rounded-btn")) {
      resultObj["--rounded-btn"] = "0.5rem";
    }
    if (!input.hasOwnProperty("--rounded-badge")) {
      resultObj["--rounded-badge"] = "1.9rem";
    }
    if (!input.hasOwnProperty("--animation-btn")) {
      resultObj["--animation-btn"] = "0.25s";
    }
    if (!input.hasOwnProperty("--animation-input")) {
      resultObj["--animation-input"] = ".2s";
    }
    if (!input.hasOwnProperty("--btn-text-case")) {
      resultObj["--btn-text-case"] = "uppercase";
    }
    if (!input.hasOwnProperty("--btn-focus-scale")) {
      resultObj["--btn-focus-scale"] = "0.95";
    }
    if (!input.hasOwnProperty("--border-btn")) {
      resultObj["--border-btn"] = "1px";
    }
    if (!input.hasOwnProperty("--tab-border")) {
      resultObj["--tab-border"] = "1px";
    }
    if (!input.hasOwnProperty("--tab-radius")) {
      resultObj["--tab-radius"] = "0.5rem";
    }

    return [resultObj, colorObj];
  }
  return [resultObj, colorObj];
};