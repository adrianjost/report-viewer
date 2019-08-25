# Report Viewer

## /backend

The firebase cloud functions, used as a backend for this project.

### /functions/api

#### /upload

Registers and uploads the reports to firebase.

### /functions/comments

Comments Report URLs to pull requests.

### /functions/proxy

Serves the uploaded reports to the webapp.

## /frontend

The webapp for this project.

## /package

The npm package that reads the config and uploads the report using the backend.
