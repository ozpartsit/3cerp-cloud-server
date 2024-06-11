import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Zdefiniuj katalog docelowy z plikami do zmiany
const directoryPath = path.join(__dirname, 'dist');

// Funkcja do zmiany rozszerzeń plików i aktualizacji importów
function changeExtensions(dir) {
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.log('Unable to scan directory: ' + err);
            return;
        }
        files.forEach(file => {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                // Rekurencyjnie przeszukaj podkatalogi
                changeExtensions(fullPath);
            } else if (file.name.endsWith('.js')) {
                const newPath = fullPath.replace('.js', '.mjs');

                // Zmień rozszerzenie pliku
                fs.rename(fullPath, newPath, err => {
                    if (err) {
                        console.log('ERROR: ' + err);
                        return;
                    }
                    console.log(`Renamed: ${fullPath} -> ${newPath}`);
                    
                    // Zaktualizuj importy w pliku .mjs
                    updateImports(newPath);
                });
            }
        });
    });
}

// Funkcja do aktualizacji ścieżek importów w plikach
function updateImports(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file ${filePath}: ${err}`);
            return;
        }
        // Zaktualizuj wszystkie importy z .js na .mjs
        const result = addMjsExtension(data)
 
        fs.writeFile(filePath, result, 'utf8', err => {
            if (err) {
                console.log(`Error writing file ${filePath}: ${err}`);
            } else {
                console.log(`Updated imports in ${filePath}`);
            }
        });
    });
}

// Uruchom funkcję dla określonego katalogu
changeExtensions(directoryPath);

function addMjsExtension(sourceCode) {
    // Regex do znalezienia importów z lokalnymi ścieżkami relatywnymi (zaczynających się od '.'), bez rozszerzenia lub z rozszerzeniem .js
    const regex = /import\s+[\w\s{},*]*\s+from\s+['"](\.[^'"]+?)(\.js)?['"];/g;

    // Dodajemy rozszerzenie `.mjs` do każdego importu, który pasuje do wzorca regex
    return sourceCode.replace(regex, (match, p1, p2) => {
        // Sprawdzamy, czy ścieżka ma rozszerzenie .js lub brak rozszerzenia
        if (p2 === '.js' || !p2) {
            // Jeśli tak, to zamieniamy na .mjs
            return match.replace(`${p1}${p2 || ''}`, `${p1}.mjs`);
        }
        // W innym przypadku zwracamy oryginalny import
        return match;
    });
}
