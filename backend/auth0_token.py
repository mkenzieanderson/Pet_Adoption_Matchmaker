import time
import requests

class Auth0Token:
    def __init__(self, domain, client_id, client_secret):
        self.domain = domain
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None
        self.expires_at = 0

    def get_access_token(self):
        current_time = time.time()
        if not self.token or current_time >= self.expires_at:
            self.fetch_new_token()
        return self.token

    def fetch_new_token(self):
        AUDIENCE = f"https://{self.domain}/api/v2/"
        token_url = f"https://{self.domain}/oauth/token"

        payload = {
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "audience": AUDIENCE,
            "grant_type": "client_credentials",
        }
        headers = {"Content-Type": "application/json"}

        # Request new access token
        response = requests.post(token_url, json=payload, headers=headers)
        response.raise_for_status()  # Raise error for bad responses
        token_data = response.json()

        self.token = token_data["access_token"]
        expires_in = token_data["expires_in"]  # Token expiration time in seconds
        self.expires_at = time.time() + expires_in  # Set expiration timestamp
