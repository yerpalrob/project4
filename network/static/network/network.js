document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new').addEventListener('click', new_post);
    document.querySelector('#cancel_new').addEventListener('click', cancel_new_post);
    document.querySelector('#send').addEventListener('click', post);
    document.querySelector('#following').addEventListener('click', following);
    document.querySelector('#username').addEventListener('click', username);
    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#post-view').style.display = 'block';
    document.querySelector('#user-view').style.display = 'none';
    document.querySelector('#cancel_new').style.display = 'none';
});

function new_post() {

    // Show new post textbox
    document.querySelector('#new-view').style.display = 'block';
    document.querySelector('#new').style.display = 'none';
    document.querySelector('#cancel_new').style.display = 'block';
    
    // Clear out composition fields
    document.querySelector('#new_post').value = '';
}

function cancel_new_post() {

    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#new').style.display = 'block';
    document.querySelector('#cancel_new').style.display = 'none';
}

function following() {

    // Show new post textbox
    document.querySelector('#post-view').style.display = 'none';
    document.querySelector('#user-view').style.display = 'none';
    document.querySelector('#following-view').style.display = 'block';
}

function username() {

    // Show new post textbox
    document.querySelector('#following-view').style.display = 'none';
    document.querySelector('#post-view').style.display = 'none';
    document.querySelector('#user-view').style.display = 'block';
}

function post() {
    //debugger;
    console.log('in send post');
	event.preventDefault();
		const myHeaders = new Headers();
        myHeaders.append('Content-Type', 'application/json');
        
        const data = {
            content: document.getElementById('new_post').value
        };
        console.log(data);

		fetch('/compose', {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(result => {
			// Print result
			console.log('result', result);
		})
		.then(show_post);
}

function show_post() {
    document.querySelector('#new-view').style.display = 'none';
    document.querySelector('#new').style.display = 'block';
    document.querySelector('#cancel_new').style.display = 'none';
}

