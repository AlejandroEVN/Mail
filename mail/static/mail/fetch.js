/* 
  Three functions:
    get_emails(input) - if the input is a mailbox, returns a list of emails
      If the input is an id, returns the email with said id

    mark_as_read(email_id) - Sets the email's "read" field to true

    make_archived(email_id, archive) - Toggles the email's "archived" field
      @param 'archive': If true, sets "archive" field to true. Same for false.
*/ 
async function get_emails(input) {
    const response = await fetch(`/emails/${input}`);
    const result = await response.json();
  
    return result;
  }
  
function mark_as_read(email_id) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify ({
      read: true
    })
  })
}

function make_archived(email_id, archive) {
  fetch(`/emails/${email_id}`, {
    method: 'PUT',
    body: JSON.stringify ({
      archived: archive
    })
  })
  .then(response => {
    console.log(`Email moved. Status code: ${response.status}`);
    load_mailbox('inbox');
  })
}


function delete_email(email_id) {
  fetch(`/emails/${email_id}/delete`, {
    method: 'DELETE'
  })
  .then(response => {
    console.log(`Status code: 
      ${response.status} ${response.status === 204 ? 'Email Deleted' : 'Forbidden'}`);
    load_mailbox('inbox');
  })
}