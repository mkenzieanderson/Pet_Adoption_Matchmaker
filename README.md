# Fetch!
Fetch! is a website that is inspired by modern dating apps to facilitate connections between local animal shelters and those wanting to adopt. Our website differentiates between logged-out users, admin users (shelter managers), and non-admin users (those with an account looking to adopt). Shelters can add animals in their shelter to the website, and can modify and/or delete animal listings as desired. Other users can favorite available pets, and revisit and modify their list of favorited pets from a My Favorites page.  We use encryption and JWT authentication for secure sign-in services. 

## Credentials
If you are interested in exploring the website with admin and/or non-admin access, please reach out to me at mackenzieanderson@outlook.com to receive working credentials. 


# Run on your local machine

Navigate to frontend folder from the terminal:
`cd frontend`

While in frontend folder run the following command to install necessary dependencies: `npm i`

While in frontend folder run the following command to launch the application locally: `npm run dev`

## Run backend
Navigate to backend folder from the terminal: `cd backend`

In backend run the following to create a virtual environment: `python -m venv venv`

Activate the environment (linux/macOS): `source {path-to-venv-dir}/Scripts/activate`

Install requirements: `pip install -r requirements.txt`

Run the server: `python3 main.py`
