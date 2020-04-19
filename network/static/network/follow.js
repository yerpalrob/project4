document.addEventListener('DOMContentLoaded', function() {
    document.querySelector("#follow_button").addEventListener("click", follow);
    document.querySelector("#unfollow_button").addEventListener("click", unfollow);
})
// Follows a user
function follow(){
    console.log('in follow', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        followee: event.target.dataset.requested_user_id
    };
    console.log(data);
    // Fetches the follow view and submits a new follow via POST
    fetch('/follow', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('result', result);
    })
    event.target.style.display = 'none';
    event.target.previousElementSibling.style.display = 'block';
    location.reload();
}
// Unfollow a user
function unfollow(event) {
    console.log('in unfollow', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        followee: event.target.dataset.requested_user_id
    };
    console.log(data);
    // Fetches the follow view and removes a follow via DELETE
    fetch('/follow', {
        method: 'DELETE',
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('result', result);
    })
    event.target.style.display = 'none';
    event.target.previousElementSibling.style.display = 'block';
    location.reload();
}