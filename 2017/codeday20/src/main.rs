use std::cmp::min;
use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::fs::File;
use std::io::Read;
use std::num::ParseIntError;
use std::str;

extern crate regex;
#[macro_use]
extern crate lazy_static;
use regex::Regex;

#[derive(Debug)]
struct Vector3DParseError {
	description: String,
}

impl Vector3DParseError {
	fn new(description: &str) -> Vector3DParseError {
		Vector3DParseError {
			description: String::from(description),
		}
	}
}

impl From<ParseIntError> for Vector3DParseError {
	fn from(err: ParseIntError) -> Self {
		Vector3DParseError::new(err.description())
	}
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
struct Vector3D {
	x: i64,
	y: i64,
	z: i64,
}

impl Vector3D {
	pub fn new(x: i64, y: i64, z: i64) -> Vector3D {
		Vector3D { x, y, z }
	}

	pub fn manhattan(&self) -> i64 {
		self.x.abs() + self.y.abs() + self.z.abs()
	}
	pub fn from_array(array: &[i64; 3]) -> Vector3D {
		Vector3D {
			x: array[0],
			y: array[1],
			z: array[2],
		}
	}
	pub fn as_array(&self) -> [i64; 3] {
		[self.x, self.y, self.z]
	}
}

impl str::FromStr for Vector3D {
	type Err = Vector3DParseError;
	fn from_str(s: &str) -> Result<Self, Self::Err> {
		let mut coords: Vec<i64> = Vec::new();
		for coord in s.split(",") {
			let coord: i64 = coord.parse()?;
			coords.push(coord);
		}
		if coords.len() < 3 {
			return Err(Vector3DParseError::new(
				"Insufficient number of coordinates.",
			));
		}
		let (x, y, z) = (coords[0], coords[1], coords[2]);
		Ok(Vector3D::new(x, y, z))
	}
}

#[derive(Debug)]
struct Particle {
	position: Vector3D,
	velocity: Vector3D,
	acceleration: Vector3D,
}

impl Particle {
	pub fn position_at(&self, time: i64) -> Vector3D {
		let mut result: [i64; 3] = [0, 0, 0];
		for dimension in 0..3 {
			let accel = self.acceleration.as_array()[dimension];
			let vel = self.velocity.as_array()[dimension];
			let pos = self.position.as_array()[dimension];
			result[dimension] = accel * ((time.pow(2) + time) / 2) + vel * time + pos;
		}
		Vector3D::from_array(&result)
	}
}

impl str::FromStr for Particle {
	type Err = Vector3DParseError;
	fn from_str(s: &str) -> Result<Self, Self::Err> {
		lazy_static! {
			static ref REGEX: Regex = Regex::new(
				"p=<(?P<position>[^>]+)>, v=<(?P<velocity>[^>]+)>, a=<(?P<acceleration>[^>]+)>"
			).unwrap();
		}
		let find = REGEX
			.captures(s)
			.ok_or(Vector3DParseError::new("cannot match on line"))?;
		Ok(Particle {
			position: find["position"].parse()?,
			velocity: find["velocity"].parse()?,
			acceleration: find["acceleration"].parse()?,
		})
	}
}

fn solve_day_20_1(raw_input: &str) {
	let particles: Vec<(usize, Particle)> = raw_input
		.lines()
		.map(|p| p.parse::<Particle>().unwrap())
		.enumerate()
		.collect();
	if let Some(min) = particles
		.iter()
		.min_by_key(|p| p.1.acceleration.manhattan())
	{
		println!("min accel: {:?}", min);
	}
}

fn solve_day_20_2(raw_input: &str) {
	let mut particles: Vec<(usize, Particle)> = raw_input
		.lines()
		.map(|p| p.parse::<Particle>().unwrap())
		.enumerate()
		.collect();
	for time in 0i64..10_000 {
		let mut existing_positions = HashMap::new();
		let mut collided_particles = HashSet::new();
		let mut collision_counter = 0;
		let mut min_distance = 100_000;
		for (num, part) in particles.iter() {
			let position = part.position_at(time);
			min_distance = min(min_distance, position.manhattan());
			if let Some(already_there) = existing_positions.insert(position, *num) {
				collided_particles.insert(already_there);
				collided_particles.insert(*num);
				collision_counter += 1;
			}

		}
		if collision_counter > 0 {
			println!(
				"Collided {:?} particles at time {:?}",
				collision_counter, time
			);
			particles.retain(|(s, _)| !collided_particles.contains(s));
			println!("{:?} particles remaining...", particles.len());
		}
		if min_distance >= 100_000 {
			println!("100,000 away at time {:?}", time);
			println!(
				"Collided {:?} particles at time {:?}",
				collision_counter, time
			);
			break;
		}
		if time % 500 == 0 {
			println!("Simulating time {:?} min_distance {:?}", time, min_distance);
		}
	}
}

fn main() {
	let mut file = File::open("C:\\Users\\Ben\\Documents\\adventcode\\day20_input.txt")
		.expect("could not find file");
	let mut contents = String::new();
	file.read_to_string(&mut contents)
		.expect("could not read file");
	solve_day_20_1(&contents);
	solve_day_20_2(&contents);
}
