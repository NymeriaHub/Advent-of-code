#![feature(portable_simd)]
use std::fs;
use std::time::Instant;
use std::array;
use std::simd::*;
use std::simd::cmp::SimdPartialEq;

const BUCKET_SIZE: usize = 16;
const TABLE_SIZE: usize = 1024;
const SIMD_WIDTH: usize = 4;

#[derive(Default)]
#[repr(C, align(64))]
struct Bucket {
    keys: [u32; BUCKET_SIZE],
    values: [u32; BUCKET_SIZE],
    count: u8,
}

#[repr(C, align(64))]
struct FastHash {
    buckets: Box<[Bucket; TABLE_SIZE]>,
}

impl FastHash {
    #[inline(always)]
    fn new() -> Self {
        Self {
            buckets: Box::new(array::from_fn(|_| Bucket::default()))
        }
    }

    #[inline(always)]
    fn add(&mut self, key: u32) {
        let idx = (key as usize) & (TABLE_SIZE - 1);
        let bucket = unsafe { self.buckets.get_unchecked_mut(idx) };
        
        let count = bucket.count as usize;
        let key_vec: Simd<u32, SIMD_WIDTH> = Simd::splat(key);
        let mut i = 0;
        while i + SIMD_WIDTH <= count {
            let keys: Simd<u32, SIMD_WIDTH> = Simd::from_slice(&bucket.keys[i..]);
            let mask = keys.simd_eq(key_vec);
            if mask.any() {
                let pos = i + mask.to_bitmask().trailing_zeros() as usize;
                bucket.values[pos] += 1;
                return;
            }
            i += SIMD_WIDTH;
        }
        
        while i < count {
            if bucket.keys[i] == key {
                bucket.values[i] += 1;
                return;
            }
            i += 1;
        }
        
        if count < BUCKET_SIZE {
            bucket.keys[count] = key;
            bucket.values[count] = 1;
            bucket.count += 1;
        }
    }

    #[inline(always)]
    fn get(&self, key: u32) -> u32 {
        let idx = (key as usize) & (TABLE_SIZE - 1);
        let bucket = unsafe { self.buckets.get_unchecked(idx) };
        
        let count = bucket.count as usize;
        let key_vec: Simd<u32, SIMD_WIDTH> = Simd::splat(key);
        let mut i = 0;
        while i + SIMD_WIDTH <= count {
            let keys: Simd<u32, SIMD_WIDTH> = Simd::from_slice(&bucket.keys[i..]);
            let mask = keys.simd_eq(key_vec);
            if mask.any() {
                let pos = i + mask.to_bitmask().trailing_zeros() as usize;
                return bucket.values[pos];
            }
            i += SIMD_WIDTH;
        }
        
        while i < count {
            if bucket.keys[i] == key {
                return bucket.values[i];
            }
            i += 1;
        }
        0
    }
}

#[inline(always)]
fn parse_numbers(bytes: &[u8], i: &mut usize) -> u32 {
    let mut num = 0;
    
    while *i < bytes.len() && unsafe { bytes.get_unchecked(*i) }.is_ascii_whitespace() {
        *i += 1;
    }
    
    while *i < bytes.len() && unsafe { bytes.get_unchecked(*i) }.is_ascii_digit() {
        num = num * 10 + (unsafe { bytes.get_unchecked(*i) } - b'0') as u32;
        *i += 1;
    }
    
    num
}

#[inline(always)]
fn parse_part1(content: &[u8]) -> (Vec<i32>, Vec<i32>) {
    let mut first_list = Vec::with_capacity(1000);
    let mut second_list = Vec::with_capacity(1000);
    let mut i = 0;
    
    while i < content.len() {
        let num1 = parse_numbers(content, &mut i) as i32;
        let num2 = parse_numbers(content, &mut i) as i32;
        
        first_list.push(num1);
        second_list.push(num2);
    }
    
    (first_list, second_list)
}

fn part1() {
    let start = Instant::now();
    let content = unsafe { fs::read("part1.txt").unwrap_unchecked() };
    
    let (mut first_list, mut second_list) = parse_part1(&content);
    
    first_list.sort_unstable();
    second_list.sort_unstable();
    
    let sum: i32 = first_list.iter()
        .zip(second_list.iter())
        .map(|(&a, &b)| (b - a).abs())
        .sum();
    
    println!("{}", sum);
    println!("Part 1: {:.3}ms", start.elapsed().as_secs_f64() * 1000.0);
}

fn part2_optimized() {
    let start = Instant::now();
    let content = unsafe { fs::read("part2.txt").unwrap_unchecked() };
    
    let mut ref_hash = FastHash::new();
    let mut acc_hash = FastHash::new();
    let mut i = 0;
    
    while i < content.len() {
        let num1 = parse_numbers(&content, &mut i);
        let num2 = parse_numbers(&content, &mut i);
        
        ref_hash.add(num1);
        acc_hash.add(num2);
    }
    
    let mut sum: u64 = 0;
    for bucket in ref_hash.buckets.iter() {
        let count = bucket.count as usize;
        for i in 0..count {
            let key = unsafe { *bucket.keys.get_unchecked(i) };
            sum += unsafe { 
                *bucket.values.get_unchecked(i) as u64 * 
                key as u64 * 
                acc_hash.get(key) as u64 
            };
        }
    }
    
    println!("{}", sum);
    println!("Part 2: {:.3}ms", start.elapsed().as_secs_f64() * 1000.0);
}

fn main() {
    part1();
    part2_optimized();
}