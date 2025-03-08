function resetScreen() {
  // Efface l'écran et replace le curseur au début
  process.stdout.write('\x1b[H');
}

function clearLine() {
  process.stdout.write('\x1b[K')
}

export function debugMap(map: string[]) {
  resetScreen()
  for(const m of map) {
    debugLine(m)
  }
  console.log('')
}

export function debugLine(line: string) {
  clearLine()
  console.log(line)
}

export async function waitInput(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    // Afficher le prompt
    process.stdout.write(prompt);

    // Écouter un seul événement 'data' sur stdin
    process.stdin.once('data', (data) => {
      // Convertir en chaîne de caractères et supprimer les espaces de fin
      const input = data.toString().trim();
      resolve(input);
    });
  });
}