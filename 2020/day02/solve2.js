async function solve2(input) {
  let valid_cnt = 0;
  for (line of input.split("\n")) {
    let [constraint, letter, password] = line.split(" ");
    letter = letter[0];
    let [first, second] = constraint.split("-");
    first = parseInt(first);
    second = parseInt(second);
    let matches = 0;
    if (password[first - 1] == letter) matches++;
    if (password[second - 1] == letter) matches++;

    if (matches === 1) {
      valid_cnt += 1;
      password = `<span style='color:green'>${password}</span>`;
    }
    else
      password = `<span style='color:red'>${password}</span>`;
    gauge(`first = ${first}, second=${second} letter=${letter}, password=${password}`);

    try {
      await step();
    }
    catch {
      log("User cancelled");
      return;
    }
  }
  showAnswer(valid_cnt);
}