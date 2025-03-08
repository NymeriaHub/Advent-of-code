require 'benchmark'

def check_sequence(numbers)
  return true if numbers.length <= 1
  
  direction = numbers[1] - numbers[0] > 0 ? :up : :down
  
  numbers.each_cons(2) do |a, b|
    diff = b - a
    return false if direction == :up && diff <= 0
    return false if direction == :down && diff >= 0
    return false if diff.abs > 3 || diff.abs < 1
  end
  
  true
end

def check_sequence_with_dampener(numbers)
  return true if check_sequence(numbers)
  
  # Essayer de retirer chaque nombre et vérifier si la séquence devient valide
  numbers.length.times do |i|
    new_sequence = numbers.dup
    new_sequence.delete_at(i)
    return true if check_sequence(new_sequence)
  end
  
  false
end

# Partie 1
time1 = Benchmark.measure do
  numbers = File.readlines('src/2024/day2/part1.txt').map do |line|
    line.strip.split(' ').map(&:to_i)
  end

  result1 = numbers.count { |seq| check_sequence(seq) }
  puts "Partie 1: #{result1}"
end

puts "Temps partie 1: #{(time1.real * 1000).round(2)}ms"

# Partie 2
time2 = Benchmark.measure do
  numbers = File.readlines('src/2024/day2/part2.txt').map do |line|
    line.strip.split(' ').map(&:to_i)
  end

  result2 = numbers.count { |seq| check_sequence_with_dampener(seq) }
  puts "Partie 2: #{result2}"
end

puts "Temps partie 2: #{(time2.real * 1000).round(2)}ms" 