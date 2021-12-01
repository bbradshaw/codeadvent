from flask import Flask, render_template, send_from_directory, send_file, abort, render_template_string
import datetime, os
app = Flask("AOC server", template_folder=".")

@app.route("/")
def index():
    html = """
<!DOCTYPE html>
<html lang="en">
<head>
    <title>AOC 2021</title>
    </head><body><h1>AOC 2021</h1><ul>
    {% for i in range(1, day) %}
    <li><a href='/day/{{i}}'>Day {{i}}</a></li>
    {% endfor %}</ul>
    </body></html>"""
    return render_template_string(html, day=datetime.datetime.now().day)

@app.route("/day/<int:day>")
def day(day):
    inp_path = os.path.join(app.root_path, f"day{day:02}/input.txt")
    try:
        f = open(inp_path)
        inp = f.read()
        linetotal = sum(1 for _ in inp.splitlines())
        f.close()
    except:
        print(f"error could not find {inp_path}")
        abort(404)
    return render_template("template.html", day=f"{day:02}", input=inp, linetotal=linetotal)

@app.route("/script/utils.js")
def utils():
    return send_file(os.path.join(app.root_path, 'utils.js'), cache_timeout=1)

@app.route("/script/<int:day>/<name>")
def script(day, name):
    return send_from_directory(os.path.join(app.root_path, f"day{day:02}"), name, cache_timeout=1)
