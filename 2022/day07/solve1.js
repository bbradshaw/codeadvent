async function solve1(input, step){
	
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
	let total = 0;
	walkDirectories(childMap, '/', function (dir) {
		if (getDirSize(dir, cumSize, childMap, sizeMap) <= 100000)
			total += getDirSize(dir, cumSize, childMap, sizeMap);
	});
	showAnswer(total);
}

function applyDirectoryChange(line, curpath){
	const target = /\$ cd (.+)/.exec(line)[1];

	switch (target){
		case '/':
			curpath = ['/']; break;
		case '..':
			curpath.pop(); break;
		default:
			curpath.push(target);
	}
	log(`cwd now ${curpath}`);
}

function updateChildMap(curdir, line, childMap){
	const target = /dir (.+)/.exec(line)[1];

	let prev = childMap.get(curdir);
	if (prev == undefined)
		prev = [];
	prev.push(curdir + '/' + target);
	childMap.set(curdir, prev);
}

function updateSizeMap(curdir, size, _filename, sizeMap){
	let prev = sizeMap.get(curdir)
	if (prev == undefined)
		prev = 0;
	prev += parseInt(size);
	sizeMap.set(curdir, prev);
}

function walkDirectories(childMap, curpath, observer){
	let children = childMap.get(curpath) || [];

	children.forEach(child => walkDirectories(childMap, child, observer));
	children.forEach(child => observer(child));
}

function getDirSize(dir, cumSize, childMap, baseSize){
	if (cumSize.has(dir))
		return cumSize.get(dir);
	let size = baseSize.get(dir) || 0;
	let children = childMap.get(dir) || [];
	children.forEach( child => size += getDirSize(child, cumSize, childMap, baseSize));
	log(`total size of ${dir} is ${size}`);
	return size;
}
