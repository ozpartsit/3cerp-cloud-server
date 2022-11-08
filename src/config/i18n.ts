import i18n from "i18n";
import path from "path";
i18n.configure({
  locales: ["en", "pl"],
  directory: path.resolve(__dirname, "../constants/locales"),
  defaultLocale: "en",
  register: global
});
export default i18n;
