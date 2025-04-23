
from flask import Flask, jsonify, request
from flask_cors import CORS
import uuid
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # Allow frontend access during development

# In-memory store for now
INTEGRATIONS = []

@app.route("/api/integrations/oauth", methods=["POST"])
def submit_oauth():
    data = request.json
    new_entry = {
        "id": str(uuid.uuid4()),
        "type": "OAuth",
        "app_name": data["appName"],
        "user_email": data["userEmail"],
        "status": "Pending",
        "jira_ticket": data["jiraTicket"],
        "apm_id": data["apmID"],
        "client_id": data["clientId"],
        "needs_ad_groups": data["needsADGroups"],
        "created_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),
    }
    INTEGRATIONS.append(new_entry)
    return jsonify({"message": "OAuth integration submitted.", "id": new_entry["id"]}), 201

@app.route("/api/integrations/saml", methods=["POST"])
def submit_saml():
    data = request.json
    new_entry = {
        "id": str(uuid.uuid4()),
        "type": "SAML",
        "app_name": data["appName"],
        "user_email": data["userEmail"],
        "status": "Pending",
        "jira_ticket": data["jiraTicket"],
        "apm_id": data["apmID"],
        "entity_id": data["entityId"],
        "acs_url": data["acsUrl"],
        "attributes": data["attributes"],
        "created_at": datetime.utcnow().isoformat(),
        "expires_at": (datetime.utcnow() + timedelta(days=30)).isoformat(),
    }
    INTEGRATIONS.append(new_entry)
    return jsonify({"message": "SAML integration submitted.", "id": new_entry["id"]}), 201

@app.route("/api/my-integrations", methods=["GET"])
def my_integrations():
    email = request.args.get("email")
    my_items = [
        {
            **item,
            "expiresIn": (datetime.fromisoformat(item["expires_at"]) - datetime.utcnow()).days
        }
        for item in INTEGRATIONS if item["user_email"] == email
    ]
    return jsonify(my_items)

@app.route("/api/admin/integrations", methods=["GET"])
def admin_get_all():
    return jsonify(INTEGRATIONS)

@app.route("/api/admin/integration/<id>", methods=["PATCH"])
def admin_update(id):
    data = request.json
    for item in INTEGRATIONS:
        if item["id"] == id:
            item.update(data)
            return jsonify({"message": "Integration updated."})
    return jsonify({"error": "Integration not found"}), 404

@app.route("/api/admin/approve/<id>", methods=["POST"])
def approve_integration(id):
    for item in INTEGRATIONS:
        if item["id"] == id:
            item["status"] = "Approved"
            return jsonify({"message": "Integration approved."})
    return jsonify({"error": "Integration not found"}), 404

@app.route("/api/admin/reject/<id>", methods=["POST"])
def reject_integration(id):
    for item in INTEGRATIONS:
        if item["id"] == id:
            item["status"] = "Rejected"
            return jsonify({"message": "Integration rejected."})
    return jsonify({"error": "Integration not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
