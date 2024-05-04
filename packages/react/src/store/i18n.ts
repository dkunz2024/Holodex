import dayjs from "dayjs";
import { atom, useSetAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { i18n } from "i18next";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { CLIPPER_LANGS } from "@/lib/consts";

export const localeAtom = atom({
  lang: window.localStorage.getItem("i18nextLng") ?? navigator.language,
  dayjs: (...args: Parameters<typeof dayjs>) => dayjs(...args),
});

export const clipLangAtom = atomWithStorage<(typeof CLIPPER_LANGS)[number]>(
  "lang",
  {
    text: "English",
    value: "en",
  },
);

export const tFunctionAtom = atom<i18n["t"] | undefined>(undefined);

/** Sync the Store tFunction with the application `t` */
/** should be called only once in the whole application stack. */
export function useSyncTFunction() {
  const setTFunction = useSetAtom(tFunctionAtom);
  const { t } = useTranslation();
  useEffect(() => {
    setTFunction(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);
}