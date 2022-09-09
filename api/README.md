### Setting Up Virtual Environment
---

`python3 -m venv /path/to/new/virtual/environment`

#### On Windows

Run this powershell script:

`/path/to/new/virtual/environment/Scripts/Activate.ps1`

#### Linux & OSX

Run this command:

`source /path/to/new/virtual/environment/bin/activate`

#### Turning It Off

Run this command:

`deactivate`


### Installing Project Dependencies
---
Navigate into the `api` directory and run this command:

`pip install -r requirements.txt`

### Running `dev` environment of API
---

Inside `api` directory run:
`flask --app app --debug run`
