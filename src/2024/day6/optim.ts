import fs from 'fs'

type Pos = {
  x: number,
  y: number
}
type Dir = 'up' | 'down' | 'right' | 'left'
const forward: Record<Dir, Pos> = {
  'up': {x: -1, y: 0},
  'down': {x: 1, y: 0},
  'left': {x: 0, y: -1},
  'right': {x: 0, y: 1}
}
const nextDir: Record<Dir, Dir> = {
  'up': 'right',
  'right': 'down',
  'down': 'left',
  'left': 'up'
}

const leftTurn: Record<Dir, Dir> = {
  'up': 'left',
  'right': 'up',
  'down': 'right',
  'left': 'down'
}

const rightTurn: Record<Dir, Dir> = {
  'up': 'right',
  'right': 'down',
  'down': 'left',
  'left': 'up'
}

function parse(file: string) {
  let guardPosition: Pos = {x: 0, y: 0}
  const split = file.split('\n')
  const walls: Array<Array<Pos>> = new Array(split.length)
  const x_dict: Record<number, number[]> = {}
  const y_dict: Record<number, number[]> = {}

  split.forEach((line, x) => {
    walls[x] = []
    line.split('').forEach((char, y) => {
      if (char === '^') guardPosition = {x, y}
      if (char === '#') {
        walls[x].push({x, y})
        
        // Remplir x_dict
        if (!x_dict[x]) x_dict[x] = []
        x_dict[x].push(y)
        
        // Remplir y_dict
        if (!y_dict[y]) y_dict[y] = []
        y_dict[y].push(x)
      }
    })
  })

  return {guardPosition, lines: split, x_dict, y_dict}
}

async function part2() {
  const startTime = performance.now()
  const file = fs.readFileSync('./src/2024/day6/test.txt', 'utf8')
  const {guardPosition, lines, x_dict, y_dict} = parse(file)
  
  const guardPath = new Set<string>()
  let currentDir: Dir = 'up'
  let currentPos = guardPosition
  
  const hasWall = (pos: Pos): boolean => {
    return x_dict[pos.x]?.includes(pos.y) || false
  }

  const isInBounds = (pos: Pos): boolean => {
    return pos.x >= 0 && pos.y >= 0 && 
           pos.x < lines.length && pos.y < lines[0].length
  }

  const posToString = (pos: Pos) => `${pos.x},${pos.y}`
  const visited = new Set<string>()
  const posKey = (pos: Pos, dir: Dir) => `${pos.x},${pos.y},${dir}`
  
  // Étape 1: Tracer le chemin du garde
  const pathPositions: Pos[] = []
  guardPath.add(posToString(currentPos))
  pathPositions.push({...currentPos})
  
  while (true) {
    const currentKey = posKey(currentPos, currentDir)
    if (visited.has(currentKey)) {
      break
    }
    visited.add(currentKey)
    
    // Calculer la prochaine position
    const nextPos = {
      x: currentPos.x + forward[currentDir].x,
      y: currentPos.y + forward[currentDir].y
    }
    
    if (!isInBounds(nextPos) || hasWall(nextPos)) {
      currentDir = nextDir[currentDir]
    } else {
      currentPos = nextPos
      guardPath.add(posToString(currentPos))
      pathPositions.push({...currentPos})
    }
  }

  // Étape 2: Pour chaque position du chemin, tester où on peut mettre un bloc
  const candidates = new Set<string>()
  
  pathPositions.forEach(pos => {
    // Tester les 4 directions autour de chaque position du chemin
    ['up', 'down', 'left', 'right'].forEach((dir) => {
      const testPos = {
        x: pos.x + forward[dir as Dir].x,
        y: pos.y + forward[dir as Dir].y
      }
      
      const posStr = posToString(testPos)
      if (isInBounds(testPos) && !hasWall(testPos) && !guardPath.has(posStr)) {
        candidates.add(posStr)
      }
    })
  })
  
  const result = candidates.size

  const endTime = performance.now()
  console.log(`Part 2: ${result}`)
  console.log(`Time: ${endTime - startTime}ms`)
}

void part2()