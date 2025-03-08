export type Pos = {
  x: number,
  y: number,
}
export type Dir = 'up' | 'down' | 'left' | 'right'
export type PositionDirection = {pos: Pos, dir: Dir}