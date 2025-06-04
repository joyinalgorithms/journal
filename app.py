import os
from datetime import datetime
from flask import Flask, render_template, request, redirect, session, flash, url_for, jsonify
from flask_session import Session
from functools import wraps
from cs50 import SQL
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

app = Flask(__name__)

app.config["SESSION PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)
UPLOAD_FOLDER = 'static/uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

db = SQL("sqlite:///journal.db")


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            return redirect(url_for("login"))
        return f(*args, **kwargs)
    return decorated_function


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/dashboard")
@login_required
def dashboard():
    if "user_id" not in session:
        return redirect("/signup")
    username = session['username']
    result = db.execute(
        "SELECT profile_image FROM users WHERE username = :username", username=username)

    userid = session.get("user_id")

    entries = db.execute(
        "SELECT entryid, title, content, createdat, image_path FROM entries WHERE userid = :userid ORDER BY createdat DESC",
        userid=userid
    )
    if result:
        profile_image = result[0]['profile_image']
    else:
        profile_image = "🌙"
    image_path = None
    if entries and entries[0].get("image_path"):
        image_path = url_for('static', filename='uploads/' + entries[0]["image_path"])
    else:
        image_path = url_for('static', filename='images/placeholder.jpg')

    for entry in entries:
        entry["createdat"] = datetime.strptime(
            entry["createdat"], "%Y-%m-%d %H:%M:%S").strftime("%B %d, %Y")

    return render_template("dashboard.html", username=username, profile_image=profile_image, entries=entries, image_path=image_path)


@app.route("/add_entry", methods=["POST"])
def add_entry():
    title = request.form.get("title")
    content = request.form.get("content")
    image_file = request.files.get("image")

    image_path = None

    if image_file and allowed_file(image_file.filename):
        filename = secure_filename(image_file.filename)
        save_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(save_path)
        image_path = filename

    userid = session.get("user_id")

    db.execute("""
        INSERT INTO entries (userid, title, content, image_path)
        VALUES (:userid, :title, :content, :image_path)
    """, userid=userid, title=title, content=content, image_path=image_path)
    return redirect(url_for('dashboard'))


@app.route("/delete_entry/<int:entry_id>", methods=["POST"])
def delete_entry(entry_id):
    user_id = session.get("user_id")
    if not user_id:
        return redirect("/login")

    db.execute("DELETE FROM entries WHERE entryid = :entryid AND userid = :userid",
               entryid=entry_id, userid=user_id)

    return jsonify({"success": True})


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/terms")
def terms():
    return render_template("terms.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")

        user = db.execute("SELECT * FROM users WHERE username = :username", username=username)

        if len(user) != 1 or not check_password_hash(user[0]["password_hash"], password):
            error_message = "Invalid username or password."
            return render_template("login.html", error_message=error_message)

        session["user_id"] = user[0]["userid"]
        session["username"] = user[0]["username"]
        return redirect(url_for("dashboard"))

    return render_template("login.html")


@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        username = request.form.get("username")
        email = request.form.get("email")
        password = request.form.get("password")
        confirm_password = request.form.get("confirm-password")
        profile_image = request.form.get("profile_image")

        if password != confirm_password:
            error_message = "Passwords do not match!"
            return render_template("signup.html", error_message=error_message)

        password_hash = generate_password_hash(password)

        try:
            db.execute("""
                INSERT INTO users (username, email, password_hash, profile_image)
                VALUES (:username, :email, :password_hash, :profile_image)
            """, username=username, email=email,
                       password_hash=password_hash, profile_image=profile_image)
            return redirect(url_for('login'))
        except Exception as e:
            error_message = "Username or email already exists!"
            return render_template("signup.html", error_message=error_message)
    return render_template("signup.html")


@app.route("/logout")
def logout():
    session.pop("user_id", None)
    session.pop("username", None)
    return redirect(url_for("login"))
