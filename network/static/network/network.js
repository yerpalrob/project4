document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#new').addEventListener('click', new_post);
    document.querySelector('#cancel_new').addEventListener('click', cancel_new_post);
    document.querySelector('#send').addEventListener('submit', post);
    document.querySelector('#following').addEventListener('click', following);
    document.querySelector('#username').addEventListener('click', username);
    show_post
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
    console.log('in send post');
	event.preventDefault();
		const myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		fetch('/posts', {
			method: 'POST',
			headers: myHeaders,
			post: JSON.stringify({
				post: document.getElementById('#new_post').value
			})
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

    var parentNode = document.querySelector('#post-list');
    // clear children from the table before you add new ones
    parentNode.innerHTML = '';

    fetch('/emails/' + mailbox, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        console.log('result', result);
        for (var i = 0; i < result.length; i++) {
            var currentEmail = result[i];
            
            // Create anchor element. 
            var a = document.createElement('a');  
            var div = document.createElement (`div`);
            div.classList.add(`read_${currentEmail.read}`);
            // Create the text node for anchor element. 
            var link = document.createTextNode(`From: ${currentEmail.sender}, Subject: ${currentEmail.subject} | ${currentEmail.body} | Received: ${currentEmail.timestamp}`); 
              
            // Append the text node to anchor element. 
            a.appendChild(link);  
              
            a.setAttribute('data-email_id', currentEmail.id);
            a.addEventListener('click', read_email);
              
            // Append the anchor element to the body. 
            div.appendChild(a);
            parentNode.appendChild(div);
        }
    });
}