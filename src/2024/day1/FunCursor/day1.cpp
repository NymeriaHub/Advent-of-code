#include <iostream>
#include <chrono>
#include <vector>
#include <algorithm>
#include <cstring>
#include <fcntl.h>
#include <unistd.h>

// Lecture ultra-rapide avec mmap
#include <sys/mman.h>
#include <sys/stat.h>

class FastParser {
private:
    char* data;
    size_t size;
    int fd;

public:
    FastParser(const char* filename) {
        fd = open(filename, O_RDONLY);
        struct stat sb;
        fstat(fd, &sb);
        size = sb.st_size;
        data = (char*)mmap(nullptr, size, PROT_READ, MAP_PRIVATE, fd, 0);
    }

    ~FastParser() {
        munmap(data, size);
        close(fd);
    }

    // Parse rapide d'un nombre
    inline int parseInt(char*& ptr) {
        int val = 0;
        while (*ptr >= '0' && *ptr <= '9') {
            val = val * 10 + (*ptr++ - '0');
        }
        return val;
    }

    char* getData() { return data; }
    char* getEnd() { return data + size; }
};

void part1() {
    auto start = std::chrono::high_resolution_clock::now();
    
    FastParser parser("../part1.txt");
    char* ptr = parser.getData();
    char* end = parser.getEnd();
    
    // Préallocation des vecteurs
    std::vector<int> first, second;
    first.reserve(1000);
    second.reserve(1000);

    // Parsing ultra-rapide
    while (ptr < end) {
        first.push_back(parser.parseInt(ptr));
        while (*ptr == ' ') ptr++;
        second.push_back(parser.parseInt(ptr));
        while (ptr < end && *ptr != '\n') ptr++;
        if (ptr < end) ptr++;
    }

    // Tri parallèle si possible
    #pragma omp parallel sections
    {
        #pragma omp section
        std::sort(first.begin(), first.end());
        #pragma omp section
        std::sort(second.begin(), second.end());
    }

    // Calcul vectorisé
    uint64_t sum = 0;
    #pragma omp simd reduction(+:sum)
    for (size_t i = 0; i < first.size(); ++i) {
        sum += std::abs(second[i] - first[i]);
    }

    printf("%lu\n", sum);
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(
        std::chrono::high_resolution_clock::now() - start
    );
    printf("Part 1: %.3fms\n", duration.count() / 1000.0);
}

void part2() {
    auto start = std::chrono::high_resolution_clock::now();
    
    FastParser parser("../part2.txt");
    char* ptr = parser.getData();
    char* end = parser.getEnd();
    
    // Utiliser un tableau plus petit et sparse
    constexpr size_t HASH_SIZE = 16384;  // Puissance de 2 pour optimiser le modulo
    uint32_t ref[HASH_SIZE] = {0};
    uint32_t acc[HASH_SIZE] = {0};
    uint32_t keys[HASH_SIZE] = {0};  // Pour stocker les vraies clés
    uint32_t key_count = 0;
    
    // Fonction de hachage simple et rapide
    auto hash = [](int x) { return x & (HASH_SIZE - 1); };
    
    while (ptr < end) {
        int first = parser.parseInt(ptr);
        while (*ptr == ' ') ptr++;
        int second = parser.parseInt(ptr);
        
        // Gestion du premier nombre
        size_t h = hash(first);
        if (ref[h] == 0) {
            keys[key_count++] = first;
        }
        ref[h]++;
        
        // Gestion du deuxième nombre
        h = hash(second);
        acc[h]++;
        
        while (ptr < end && *ptr != '\n') ptr++;
        if (ptr < end) ptr++;
    }

    // Calcul optimisé
    uint64_t sum = 0;
    for (size_t i = 0; i < key_count; i++) {
        uint32_t key = keys[i];
        sum += static_cast<uint64_t>(ref[hash(key)]) * key * acc[hash(key)];
    }

    printf("%lu\n", sum);
    
    auto duration = std::chrono::duration_cast<std::chrono::microseconds>(
        std::chrono::high_resolution_clock::now() - start
    );
    printf("Part 2: %.3fms\n", duration.count() / 1000.0);
}

int main() {
    part1();
    part2();
    return 0;
}