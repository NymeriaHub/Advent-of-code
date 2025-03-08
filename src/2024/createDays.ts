import fs from 'fs'
import path from 'path'

const baseDir = './src/2024'

for (let day = 6; day <= 25; day++) {
  const dayDir = path.join(baseDir, `day${day}`)
  
  // Créer le dossier s'il n'existe pas
  if (!fs.existsSync(dayDir)) {
    fs.mkdirSync(dayDir)
    
    // Créer les fichiers
    fs.writeFileSync(path.join(dayDir, 'exo.txt'), '')
    fs.writeFileSync(path.join(dayDir, 'test.txt'), '')
    fs.writeFileSync(path.join(dayDir, 'prod.txt'), '')
    
    // Créer index.ts avec un template de base
    const indexContent = `import fs from 'fs'

async function part1() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day${day}/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(\`Part 1: \${result}\`)
  console.log(\`Time: \${endTime - startTime}ms\`)
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day${day}/test.txt', 'utf8')
  
  const result = 0

  const endTime = performance.now()
  console.log(\`Part 2: \${result}\`)
  console.log(\`Time: \${endTime - startTime}ms\`)
}

void part1()
// void part2()
`
    fs.writeFileSync(path.join(dayDir, 'index.ts'), indexContent)
  }
} 