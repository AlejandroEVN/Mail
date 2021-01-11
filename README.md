## AlejandroEVN

### Project Mail 

This is an email app. Users can send, receive, reply, archive or delete emails from their mailbox.

Most of the project is done as a Single Page application. Made with vanilla JavaScript. Once the user is logged in, all the data sent
and received from the backend is through API endpoints and then rendered using JavaScript.


#### Routes

`url: /`
Main page. Redirects to Login page or Inbox (whether user is authenticated or not).

`url: /login` `url: /register`
Renders corresponding HTML.

`url: /logout`

`url: /emails/send`
API endpoint to send an email

`url: /emails/<int:email_id>`
API endpoint to retrieve email info as JSON

`url: /emails/<int:email_id>/delete`
API endpoint to delete selected email

`url: /emails/<str:mailbox>`
API endpoint to load emails list from either Inbox, Sent or Archived mailbox

#### Installation

- Clone into your machine
- Open a terminal
- Cd into projects' folder
- Run `pip install requirements.txt` (ideally in a virtual environment)
- Run `py manage.py runserver`
- Open browser and navigate to `127.0.0.1:<your Django local port>`

#### Tech Stack
- Python
- Django
- JavaScript
- Bootstrap
- Sass
