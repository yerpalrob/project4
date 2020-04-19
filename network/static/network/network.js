document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new').addEventListener('click', new_post);
    document.querySelector('#cancel_new').addEventListener('click', cancel_new_post);
    document.querySelector('#send').addEventListener('click', post);
    document.querySelector('#new-view').style.display = 'none';
})

function new_post() {
    // Show new post textbox
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#new').style.display = 'none';
    document.querySelector('#cancel_new').style.display = 'block';
    
    // Clear out composition fields
    document.querySelector('#new_post').value = '';
}

function cancel_new_post() {
    // Hide the new post textbox
    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#new').style.display = 'block';
    document.querySelector('#cancel_new').style.display = 'none';
}

function post() {
    // Creates new post
    console.log('in send post');
	event.preventDefault();
		const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        
        const data = {
            content: document.getElementById('new_post').value
        };
        console.log(data);
        // Fetches the compose view and logs the post content via POST
		fetch('/compose', {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(result => {
			console.log('result', result);
		})
		.then(show_post);
}

// Originally intended to be the post list, this is the new post button view
function show_post() {
    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#new').style.display = 'block';
    document.querySelector('#cancel_new').style.display = 'none';
}

