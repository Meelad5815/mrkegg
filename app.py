from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path
from typing import Any

from flask import Flask, jsonify, request, send_from_directory

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CONTACT_LOG = DATA_DIR / "contact_submissions.jsonl"

app = Flask(__name__, static_folder=".", static_url_path="")


@app.get("/")
def home():
    return send_from_directory(BASE_DIR, "index.html")


@app.get("/<path:page>")
def static_pages(page: str):
    if page in {"about.html", "products.html", "delivery.html", "contact.html", "styles.css", "script.js"}:
        return send_from_directory(BASE_DIR, page)
    return jsonify({"error": "Not found"}), 404


@app.post("/api/contact")
def contact_submit():
    payload: dict[str, Any] = request.get_json(silent=True) or {}
    name = str(payload.get("name", "")).strip()
    phone = str(payload.get("phone", "")).strip()
    message = str(payload.get("message", "")).strip()

    errors = {}
    if len(name) < 2:
        errors["name"] = "Name must be at least 2 characters."
    if len(phone) < 7:
        errors["phone"] = "Phone number looks too short."
    if len(message) < 5:
        errors["message"] = "Message must be at least 5 characters."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 400

    entry = {
        "created_at": datetime.now(timezone.utc).isoformat(),
        "name": name,
        "phone": phone,
        "message": message,
        "ip": request.headers.get("X-Forwarded-For", request.remote_addr),
    }

    with CONTACT_LOG.open("a", encoding="utf-8") as f:
        f.write(json.dumps(entry, ensure_ascii=False) + "\n")

    return jsonify({"ok": True, "message": "Thanks! We received your message."})


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
