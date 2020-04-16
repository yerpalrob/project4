
function addLikeListeners() {
	document.querySelectorAll(".like").forEach(function(elem) {
		elem.addEventListener("click", like);
	});
};
function addUnlikeListeners() {
	document.querySelectorAll(".unlike").forEach(function(elem) {
		elem.addEventListener("click", unlike);
	});
};
document.addEventListener('DOMContentLoaded', function() {
    addUnlikeListeners();
    addLikeListeners();
})

function like(event) {
    console.log('in like', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        post: event.target.dataset.post_id
    };
    console.log(data);

    fetch('/like', {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log('result', result);
    });
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'block';
    location.reload();
}

function unlike(event) {
    console.log('in unlike', event);
    event.preventDefault();
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    
    const data = {
        post: event.target.dataset.post_id
    };
    console.log(data);

    fetch('/like', {
        method: 'DELETE',
        headers: myHeaders,
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log('result', result);
    })
    event.target.style.display = 'none';
    event.target.previousElementSibling.style.display = 'block';
    location.reload();
}