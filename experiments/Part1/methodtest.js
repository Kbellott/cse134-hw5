function getDate(){
    let today = new Date();
    return today;
  }

function sendHttpRequest(method){
    //gathering form data
    let articleID = document.getElementById('id_input').value;
    let articleName = document.getElementById('article_name').value;
    let articleBody = document.getElementById('article_body').value;
    let timeStamp = getDate();
    let url = `https://httpbin.org/${method.toLowerCase()}`;

    let headers = {
        'Content-Type': 'application/json'
    };

    let data = {
        articleID: articleID,
        articleName: articleName,
        articleBody: articleBody,
        timeStamp: timeStamp
    };
    if(method == 'GET' || method == 'DELETE'){
        fetch(url, {
            method: method,
            headers: headers
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response Error');
            }
            return response.json();
        })
        .then(data => {
            let formattedData = JSON.stringify(data, null, 2);
            document.getElementById('response').innerHTML = `<pre>${formattedData}</pre>`;
        })
        //catches errors
        .catch(error => {
            console.error(error);
        });

    }else{
        fetch(url, {
            method: method,
            headers: headers,
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response Error');
            }
        return response.json();
        })
        .then(data => {
            let formattedData = JSON.stringify(data, null, 2);
            document.getElementById('response').innerHTML = `<pre>${formattedData}</pre>`;
        })
        //catches errors
        .catch(error => {
            console.error(error);
        });
    }
}