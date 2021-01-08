document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        fadeErrorOut();
        removeAlert();
    }, 2000);  
})

function fadeErrorOut() {
    document.getElementById('alert-error').classList.remove('error-fade-in');
}

function removeAlert() {
    document.getElementById('alert-error').remove();
}