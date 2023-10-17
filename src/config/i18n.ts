import i18n from "i18n";
import path from "path";
import fs from 'fs'

i18n.configure({
  locales: ["en", "pl"],
  directory: path.resolve(__dirname, "../constants/locales"),
  defaultLocale: "en",
  register: global
});

//sort locales
function sortLocales() {
  let locales = i18n.getLocales();
  locales.forEach(locale => {
    let filePath = path.resolve(__dirname, "../constants/locales", `${locale}.json`)
    // Odczytaj plik JSON
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(`${locale}.json - Błąd odczytu pliku:`, err);
        return;
      }

      try {
        // Parsuj zawartość pliku JSON
        const translations = JSON.parse(data);

        // Posortuj klucze
        const sortedTranslations = {};
        Object.keys(translations).sort().forEach(key => {
          sortedTranslations[key] = translations[key];
        });

        // Zapisz posortowane tłumaczenia do pliku
        fs.writeFile(filePath, JSON.stringify(sortedTranslations, null, 2), 'utf8', err => {
          if (err) {
            console.error(`${locale}.json - Błąd zapisu pliku:`, err);
            return;
          }
          console.log(`${locale}.json - Tłumaczenia zostały pomyślnie posortowane.`);
        });
      } catch (parseError) {
        console.error(`${locale}.json - Błąd parsowania pliku JSON:`, parseError);
      }
    });
  })
}
sortLocales()
export default i18n;
