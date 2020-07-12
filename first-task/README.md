# First Task

An application review service developed with spring boot, and integrated with JBPM. Submitted as a code challenge for BOT.

## Requirements

- Java 8 (and above)
- Maven

## Installation

Extract the zip file and go to the first-task-service folder and run

```
launch.bat clean install (for linux users run launch.sh)
```
The server is now running on http://localhost:8090/

## Usage

The service has 3 registered users by default. One developer and 2 reviewers. Login credentials:

```
username: dev1 , password: dev1 (developer)
username: rev1 , password: rev1 (reviewer)
username: rev2 , password: rev2 (reviewer)
```
The service uses REST API calls to interact with the integrated kie server.

The developer can assign a reviewer an application to review
The reviewer can either accept or reject the application
The developer can check the status of the assigned application
