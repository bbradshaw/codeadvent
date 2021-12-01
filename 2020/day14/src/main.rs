use std::convert::TryInto;

struct ThirtySixBit {
    inner: [u8;5]
}

impl ThirtySixBit {
    fn new() -> ThirtySixBit {
        ThirtySixBit{inner: [0;5]}
    }

    fn get_value(&self) -> u64{
        let mut temp = [0u8;8];
        for i in 0..5{
            temp[i+3] = self.inner[i].clone();
        }
        u64::from_be_bytes(temp)
    }

    fn flip_bit(&mut self, bit: usize){
        assert!(bit < 36);
        let arr_offset = bit / 8;
        let mut field_offset: u32 = (8-(bit % 8)).try_into().unwrap();
        if arr_offset == 4 {
            field_offset -= 5;
        }
        self.inner[arr_offset] ^= 2u8.pow(field_offset);
    }
}

fn main() {
    let mut bv = ThirtySixBit::new();
    bv.flip_bit(33);
    bv.flip_bit(35);
    println!("value is {}", bv.get_value());
}
