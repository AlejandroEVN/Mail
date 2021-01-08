document.addEventListener('DOMContentLoaded', () => {
    // Select the form
    const form = document.querySelector('form');

    // Trigger function on form submit
    form.onsubmit = send_email;

})

function send_email() {

    // Retrieve and save the content of the form
    const recipients = document.querySelector('#compose-recipients');
    const subject = document.querySelector('#compose-subject');
    const body = document.querySelector('#compose-body');

    // Send a "POST" request to the server
    fetch('/emails/send', {
        method: 'POST',
        body: JSON.stringify ({
            recipients: recipients.value,
            subject: subject.value,
            body: body.value
        })
    })
    // Convert the response from server into JSON
    .then(response => response.json())
    .then(result => {
        if (result.error) {
            document.querySelector('#error').innerHTML = `
            <div class="alert alert-danger" role="alert">
                ${result.error}
            </div>`;
        } else {
            load_mailbox('sent');
        }
    })
    .catch(error => console.log(error))

    return false;
}