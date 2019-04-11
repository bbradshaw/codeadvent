use std::str::FromStr;
use std::fs::File;
use std::io::Read;

enum DanceMove {
  Spin(usize),
  Exchange(usize, usize),
  Partner(char, char)
}

#[derive(Debug)]
struct DanceParseError {
  desc : String
  }

impl FromStr for DanceMove {
    type Err = DanceParseError;
    
    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s.chars().nth(0).expect("empty dance string") {
          's' => {
            let pos_str = s.get(1..).expect("0 length DanceMove::Spin direction");
            let pos = pos_str.parse().expect("could not parse DanceMove::Spin digit");
            
            Ok(DanceMove::Spin(pos))},
            
          'x' => {
             let positions: Vec<&str> = s.get(1..).unwrap().split("/").collect();
             let pos1 : usize = positions[0].parse().expect("could not parse DanceMove::Exchange digit");
             let pos2 : usize = positions[1].parse().expect("could not parse DanceMove::Exchange digit");   
    
             Ok(DanceMove::Exchange(pos1, pos2))},
             
          'p' => {
             let b = s.as_bytes();
             
             Ok(DanceMove::Partner(b[1] as char, b[3]as char))}
             
          _  =>  Err(DanceParseError{desc : String::from("could not parse!")})
        }
    }
}

fn solve_day_16(input : &str)  -> Vec<char> {
	let mut line : Vec<char> = vec!['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p'];
	for fragment in input.split(","){
		if fragment.contains("\n"){
			panic!("Newline in fragment!");
		}
	   let dm : DanceMove = fragment.parse().unwrap();
	   match dm {
	      DanceMove::Spin(pos) => {
	      	let line_copy = line.clone();
	      	let (left, right) = line_copy.split_at(line.len() - pos);
	      	line.clear();
	      	line.extend(right);
	      	line.extend(left);
	      	//println!("spin with pos {}!", pos);

	      }
	      DanceMove::Exchange(p1,p2) => {
	      	//println!("exchange with pos ({}, {})", p1, p2);
	      	line.swap(p1, p2);
	      },
	      DanceMove::Partner(c1,c2) => {
	      	//println!("partner with pos ({}, {})", c1, c2);
	      	let p1 = line.iter().position(|cr| cr==&c1).expect("could not find letter 1");
	      	let p2 = line.iter().position(|cr| cr==&c2).expect("could not find letter 2");
	      	line.swap(p1, p2);
	      }
	    };
	}
	line
}


fn main() {
    //let input = "s1,x3/4,pe/b";
	let mut file = File::open("C:\\Users\\Ben\\Documents\\adventcode\\day16_input.txt").expect("could not find file");
	let mut contents = String::new();
	file.read_to_string(&mut contents).expect("could not read file");

    let line : String = solve_day_16(contents.trim()).iter().collect();
    println!("{:?}", line);
}