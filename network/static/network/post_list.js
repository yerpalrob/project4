document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.like').addEventListener('click', like);
    document.querySelector('.unlike').addEventListener('click', unlike);
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
    })
    document.querySelector('#like').style.display = 'none';
    document.querySelector('#unlike').style.display = 'block';
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
    document.querySelector('#like').style.display = 'block';
    document.querySelector('#unlike').style.display = 'none';
}