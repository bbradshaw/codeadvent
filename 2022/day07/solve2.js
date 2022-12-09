async function solve2(input, step){
	
	let curpath = ['/'];
	let sizeMap = new Map();
	let childMap = new Map();

	let m = null;

	const curdir = () => curpath.join('/');

	for (const line of input.split('\n')){
		if (line.startsWith("$ cd")){
			applyDirectoryChange(line, curpath);
			}
		else if (line.startsWith("dir "))
			updateChildMap(curdir(), line, childMap);
		else if (m = line.match(/(\d+) (.+)/))
			updateSizeMap(curdir(), m[1], m[2], sizeMap);
		await step(1);
	}
	
	let cumSize = new Map();
	let targetSize = getDirSize('/', cumSize, childMap, sizeMap) - 40000000;
	log(`need to free ${targetSize} bytes`);
	let minheap = new Heap();
	walkDirectories(childMap, '/', function (dir) {
		let size = getDirSize(dir, cumSize, childMap, sizeMap);
		if (size > targetSize)
			minheap.push(size);
	});
	showAnswer(minheap.pop());
}

