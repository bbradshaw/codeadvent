const int = (s) => parseInt(s, 16);
const hexarr_to_binarr = (h, s) => Array.from(int(h.join("")).toString(2).padStart(s, '0'));
const binarr_to_int = ba => parseInt(ba.join(""), 2);

class Bitstream {
	constructor(hex) {
		this.char_pos = 0;
		this.raw = Array.from(hex);
		this.buffer = [];
		this.done = false;
	}

	read(nbits) {
		if (this.done) {
			if (this.buffer.length) return this.buffer.splice(0, Math.min(this.buffer.length, nbits));
			throw new Error("stream done");
		}
		let nbytes_to_read = Math.ceil((nbits - this.buffer.length) / 8);

		while (nbytes_to_read > 0) {
			let nextByte = this.raw.slice(this.char_pos, this.char_pos + 2);
			this.buffer = [...this.buffer, ...hexarr_to_binarr(nextByte, 8)];
			this.char_pos += 2;
			nbytes_to_read--;
		}

		let nextByte = this.raw.slice(this.char_pos, this.char_pos + 2);
		if (!nextByte.length) {
			this.done = true;
		}
		return this.buffer.splice(0, nbits);
	}

}

function readPacket(bs, packet_visitor) {
	let version = binarr_to_int(bs.read(3));
	let typeId = binarr_to_int(bs.read(3));
	let size = 6;
	let data = [];
	let subpackets = [];
	const measured_read = (s) => {
		r = bs.read(s);
		size += r.length;
		return r
	}
	if (typeId === 4) {
		while (true) {
			let tag = measured_read(1);
			data = [...data, ...measured_read(4)];
			if (tag[0] === '0') break;
		}
		let packet = { version, typeId, data: binarr_to_int(data), size };
		if (packet_visitor) packet_visitor(packet);
		return packet;
	}
	else {
		let lengthId = binarr_to_int(measured_read(1));
		let remaining;
		if (lengthId === 0)
			remaining = binarr_to_int(measured_read(15));
		else
			remaining = binarr_to_int(measured_read(11));
		while (remaining > 0) {
			let sp = readPacket(bs, packet_visitor);
			if (lengthId === 0)
				remaining -= sp.size;
			else
				remaining--;
			size += sp.size;
			subpackets.push(sp);
		}
	}
	let packet = { version, typeId, subpackets, size };
	if (packet_visitor) packet_visitor(packet);
	return packet;
}

async function solve1(input, step) {
	let bs = new Bitstream(input);
	version_sum = 0;
	packets = [];
	const packetVisitor = p => 
		version_sum += p.version;
	while (true) {
		try {
			packets.push(readPacket(bs, packetVisitor));
			log("read next top-level packet");
			await step(null);
		}
		catch (e){
			if (e.message !== "stream done") throw e;
			break;
		}
	}
	log(JSON.stringify(packets));

	showAnswer(version_sum);
}