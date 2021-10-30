window.addEventListener('load', e => {
    console.log('here');
    const headers = {};
    const request = new Request('/list?list=books', { method: 'GET', headers });
    fetch(request)
        .then(resp => {
            console.log(resp.body);
            return resp.json()})
        .then(body => console.log(body))
})