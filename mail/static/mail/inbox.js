document.addEventListener('DOMContentLoaded', () => {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  document.querySelector('#inbox').className = "btn btn-sm btn-outline-secondary shadow";
  document.querySelector('#sent').className = "btn btn-sm btn-outline-secondary";
  document.querySelector('#archived').className = "btn btn-sm btn-outline-secondary";
  document.querySelector('#compose').className = "btn btn-sm btn-success";  

  // Erases the div with the error message, if there was any
  document.querySelector('#error').innerHTML = "";

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  document.querySelector('#compose').className = "btn btn-sm btn-outline-secondary";    
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Change styles of buttons depending on the menu that is currently been shown
  if (mailbox === 'inbox') {
    document.querySelector('#inbox').className = "btn btn-sm btn-info shadow";
    document.querySelector('#sent').className = "btn btn-sm btn-outline-secondary";
    document.querySelector('#archived').className = "btn btn-sm btn-outline-secondary";
  } else if (mailbox === 'sent') {
    document.querySelector('#inbox').className = "btn btn-sm btn-outline-secondary";
    document.querySelector('#sent').className = "btn btn-sm btn-info shadow";
    document.querySelector('#archived').className = "btn btn-sm btn-outline-secondary";
  } else {
    document.querySelector('#inbox').className = "btn btn-sm btn-outline-secondary";
    document.querySelector('#sent').className = "btn btn-sm btn-outline-secondary";
    document.querySelector('#archived').className = "btn btn-sm btn-info shadow";
  }
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3 class="border-bottom">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  // Creates emails list by calling function
  create_emails_elements(mailbox);   
}

// Get the emails from the backend
function create_emails_elements(mailbox) {

  // Checks for 'sent' mailbox requested. If so, btn is sent as false
  // to not display the buttons "Reply" and "Archive" in the email
  let btn = true;
  if (mailbox === 'sent') {
    btn = false;
  }

  // Fetches the emails and iterates through them to create a div for each of them
  get_emails(mailbox).then(emails => {
    emails.forEach(email => {
      const email_container = document.createElement('div');

      // Email container styling
      email_container.className = "card card-thumbnail d-flex flex-row py-2 px-4 m-1";
      email_container.style.fontWeight = 'bolder';

      // Icon for unread emails
      let read_icon = '<span class="material-icons me-2">mark_email_unread</span>';

      // Font is bolder and background color is white by default.
      // If the email has been read, change style and icon.
      if (email.read) {
        email_container.style.fontWeight = 'normal';
        email_container.style.backgroundColor = '#f2f2f2';
        read_icon = '<span class="material-icons me-2">mark_email_read</span>';
      }
      
      // Populates the container with the email's data
      email_container.innerHTML = `
        ${read_icon}
        <span class="me-5 w-25 text-truncate">${email.sender}</span>
        <span class="me-4 w-50 text-truncate">${email.subject}</span>
        <span class=" text-muted ms-auto">${email.timestamp}</span>`;
 
      // Adds "onClick" event to every div. Calls the function to open
      // the email requested
      email_container.addEventListener('click', () => open_email(email.id, btn));
  
      // Appends the email element in the #emails-view div
      document.querySelector('#emails-view').append(email_container); 
    });
  })
}

// Creates HTML element to show the email's details
function open_email(email_id, btn) {

  // Fetches the email by its' id
  get_emails(email_id).then(email_data => {

    // Marks the email as "read"
    mark_as_read(email_id);

    // Variables to set the "Archive"/"Unarchive" buttons styles
    let btn_archive_color, btn_archive_text;

    // Asigns the styles to the "Archive"/"Unarchive" buttons
    // whether the email is archived or not
    if (email_data.archived) {
      btn_archive_color = 'btn-outline-danger';
      btn_archive_text = 'Unarchive';
      btn_archive_icon = '<span class="material-icons" style="font-size: small">unarchive</span>';
    } else {
      btn_archive_color = 'btn-outline-warning';
      btn_archive_text = 'Archive';
      btn_archive_icon = '<span class="material-icons" style="font-size: small">archive</span>';
    }

    // By default, show the "Reply" and "Archive" (or "Unarchived") buttons
    let buttons = `
    <button id="reply" class="btn btn-outline-info btn-sm">
    <span class="material-icons" style="font-size: small">reply</span>
    <span>Reply</span>
    </button>
    <button id="archive" class="btn ${btn_archive_color} btn-sm">
      ${btn_archive_icon}
      <span>${btn_archive_text}</span>
    </button>
    <button id="delete" class="btn btn-outline-danger btn-sm">
    <span class="material-icons" style="font-size: small">delete_forever</span>
    <span>Delete</span>
    </button>
    `;

    // If "sent" mailbox was requested, change variable "buttons" to empty string, i.e. buttons will not show up
    if (!btn) {
      buttons = "";
    }

    // Creates a div element that will contain the email
    const email = document.createElement('div');
    email.className = "card card-thumbnail shadow p-4";
    email.style.height = "65vh";

    // Sets the email container inner elements
    email.innerHTML = `
    <div class="container mb-2">
      <p><strong>From:</strong> ${email_data.sender}</p>
      <p><strong>To</strong>: ${email_data.recipients}</p>
      <p><strong>Subject</strong>: ${email_data.subject}</p>
      <p><strong>On</strong>: ${email_data.timestamp}</p>
      ${buttons}    
    </div>
    <hr>
    <div class="container">
      ${email_data.body}
    </div>`;

    // Empties the #emails-view container before appending the new "email" element
    document.querySelector('#emails-view').innerHTML = "";  
    document.querySelector('#emails-view').append(email);

    // Checks whether buttons are present or not. If they are, adds
    // "onClick" functionality
    if (btn) {

      // Click event for "Reply" button
      document.querySelector('#reply').addEventListener(
        'click', () => reply_email(email_data)
        );

      // Click event for "Archive" button. Once the email's archive field
      // has been updated, returns to inbox mailbox.
      document.querySelector('#archive').addEventListener(
        'click', () => {
          if (email_data.archived) {
            make_archived(email_data.id, false);
          } else {
            make_archived(email_data.id, true);
          }
        });

      // Click event for "Delete button"
      document.querySelector('#delete').addEventListener(
        'click', () => {
          delete_email(email_data.id);
        }
      )
    }
  })
}

// Receives the email as json
function reply_email(email_data) {
  
  // Loads the compose-email view
  compose_email();
  
  // Initialize the variable subject
  let subject;

  /* 
    Checks whether the subject starts with "Re: " or not
    Adds the string "Re: " to the beginning of the subject if 
    it was not there already
  */
  if (email_data.subject.startsWith("Re: ")) {
    subject = email_data.subject;
  } else {    
    subject = `Re: ${email_data.subject}`;
  }
  
  /*
    Adds to body:
    'On <timestamp> <sender> wrote:
    <content>
    -------
  */
  let body = `On ${email_data.timestamp} <<${email_data.sender}>> wrote:\n"${email_data.body}"\n ------- \n`;

  // Populates the input boxes with the data
  document.querySelector('#compose-recipients').value = email_data.sender;
  document.querySelector('#compose-subject').value = subject;
  document.querySelector('#compose-body').value = body;
}