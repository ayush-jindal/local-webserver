document.addEventListener('loadstart', e => {
    const headers = {};
    const request = new Request('192.168.1.6:3000/list/books', {method: 'GET', headers});
    fetch(request).then(resp => {console.log(resp);})
})