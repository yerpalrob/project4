// Creates listeners for all of the like buttons on any page
function addLikeListeners() {
	document.querySelectorAll(".like").forEach(function(elem) {
		elem.addEventListener("click", like);
	});
};
// Creates listeners for all of the unlike buttons on any page
function addUnlikeListeners() {
	document.querySelectorAll(".unlike").forEach(function(elem) {
		elem.addEventListener("click", unlike);
	});
};
// When the document is loaded add the listeners
document.addEventListener('DOMContentLoaded', function() {
    addUnlikeListeners();
    addLikeListeners();
})
// Creates a like event
function like(event) {
    console.log('in like', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        post: event.target.dataset.post_id
    };
    console.log(data);
    // Fetches the like view and adds a like via POST
    fetch('/like', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('result', result);
    });
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'block';
    location.reload();
}
// Creates an unlike event
function unlike(event) {
    console.log('in unlike', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        post: event.target.dataset.post_id
    };
    console.log(data);
    // Fetches the like view and removes a like via DELETE
    fetch('/like', {
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