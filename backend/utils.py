from google.cloud import secretmanager
from dotenv import load_dotenv

load_dotenv()

PROJECT_ID = 'animal-adopt-453400'  # Replace with your actual project ID


def access_secret_version(secret_id, version_id="latest"):
    """Get the secret stored in Google Secret Manager."""
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{PROJECT_ID}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(name=name)

    return response.payload.data.decode('UTF-8')
