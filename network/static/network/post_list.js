document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.like').addEventListener('click', like);
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
}