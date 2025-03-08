
export const init = (maxX: number, maxY: number): string[][] => {
    let map: string[][] = Array(maxX)
  
    for (let i = 0; i < maxX; i++) {
      map[i] = Array(maxY).fill('.')
    }
    return map
  }