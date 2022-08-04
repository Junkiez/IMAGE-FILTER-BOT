import os
from flask import Flask, redirect, url_for, render_template, request, send_from_directory
import redis
from json import loads, dumps
import redis

app = Flask(__name__, template_folder='templates')
app.secret_key = "Heil"

r = redis.from_url('redis-uri')

@app.route('/api', methods=['POST'])
def main():
    r.set(request.form.get('key'),request.form.get('dat'))
    return 'Succesful'

@app.route('/<path:path>')
def send_report(path):
    return send_from_directory('app', path)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get('PORT', 5000)), debug=bool(os.environ.get('DEBUG')))