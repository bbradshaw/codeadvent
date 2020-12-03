from flask import Flask, render_template, send_from_directory, abort
app = Flask("AOC server", template_folder=".")

@app.route("/day/<int:day>")
def day(day):
    inp_path = f"day{day:02}/input.txt"
    try:
        f = open(inp_path)
        inp = f.read()
        f.close()
    except:
        print(f"error could not find {inp_path}")
        abort(404)
    return render_template("template.html", day=f"{day:02}", input=inp)

@app.route("/script/<int:day>/<name>")
def script(day, name):
    return send_from_directory(f"day{day:02}", name, cache_timeout=1)
