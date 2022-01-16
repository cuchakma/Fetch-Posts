const listElement = document.querySelector('.posts');
const postTemplate = document.getElementById('single-post');
const form  = document.querySelector('#new-post form');
const fetchButton = document.querySelector('#available-posts button');
const postList = document.querySelector('ul');

function sendHttpRequest(method, url, data) {
    return fetch(url, {
        method:method,
        body: data,
    }).then((response) => {
        if( response.status >= 200 && response.status < 300) {
            return response.json();
        } else {
            return response.json().then(errData => {
                console.log(errData);
                throw new Error('Something Went Wrong -Server -Side!');
            });
        }
    }).catch(error => {
        throw new Error('Something Went Wrong!');
    });
}

async function fetchPosts() {
    try {
        const responseData = await sendHttpRequest('GET', 'https://jsonplaceholder.typicode.com/posts');
        const listOfPosts = responseData;
        for(const post of listOfPosts) {
            const postEl = document.importNode(postTemplate.content, true);
            postEl.querySelector('h2').textContent = post.title.Uppercase;
            postEl.querySelector('p').textContent = post.body;
            postEl.querySelector('li').id = post.id;
            listElement.append(postEl);
        }
    } catch(error) {
        alert(error.message);
    }
}

async function cretePost(title, content){
    const userID = Math.random();
    const post = {
        title : title,
        body : content,
        userId : userID
    };
    const formData = new FormData(form);
    formData.append('userId', userID);
    sendHttpRequest('POST', 'https://jsonplaceholder.typicode.com/posts', formData);
}

fetchButton.addEventListener('click', fetchPosts);
form.addEventListener('submit', function(event){
    event.preventDefault();
    const formTitle = event.currentTarget.querySelector('#title').value;
    const formContent = event.currentTarget.querySelector('#content').value;
    cretePost(formTitle, formContent);
});

postList.addEventListener('click', function(event){
   if(event.target.tagName === 'BUTTON'){
       event.target.closest('li').remove();
       const postID = event.target.closest('li').id;
       sendHttpRequest('DELETE', `https://jsonplaceholder.typicode.com/posts/${postID}`);
   }
});
