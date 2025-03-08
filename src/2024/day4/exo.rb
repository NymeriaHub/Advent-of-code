def parse_grid(filename)
  grid = []
  File.readlines(filename).each_with_index do |line, i|
    row = []
    line.chomp.chars.each_with_index do |char, j|
      row << [char, [i, j]]
    end
    grid << row
  end
  grid
end

def find_all_xmas(grid)
  directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ]
  
  height = grid.length
  width = grid[0].length
  target = "XMAS"
  target_length = target.length
  
  count = 0

  grid.each_with_index do |row, i|
    row.each_with_index do |(char, (x, y)), j|
      next unless char == 'X'
      
      directions.each do |di, dj|
        match = true
        target.chars.each_with_index do |t_char, idx|
          ni, nj = i + di * idx, j + dj * idx
          if ni < 0 || ni >= height || nj < 0 || nj >= width || grid[ni][nj][0] != t_char
            match = false
            break
          end
        end
        count += 1 if match
      end
    end
  end

  count
end
# Mesure du temps d'exécution
start_time = Time.now

# Lecture du fichier et exécution
grid = parse_grid('./prod.txt')
result = find_all_xmas(grid)

end_time = Time.now
execution_time = (end_time - start_time) * 1000 # Conversion en millisecondes

puts "Résultat: #{result}"
puts "Temps d'exécution: #{execution_time.round(2)}ms"