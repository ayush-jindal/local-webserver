const http = require('http')
const fs = require('fs')
const { URL } = require('url')
const { spawn } = require('child_process');

const PORT = process.env.PORT || 3000;
const DEVIP = '192.168.1.6';
const PYTHONPATH = '/home/jindal/Py39/bin/python';

const getURLObj = function (req) {
    return new URL(req.url, `http://${req.headers.host}/`);
}

const readFromFile = (res, path, headers) => {
    fs.readFile(__dirname + path, (err, data) => {
        if (err) {
            res.writeHead(404, {
                'Content-Type': 'text/html'
            })
            return res.end('File not found')
        }
        res.writeHead(200, headers)
        res.end(data);
    });
}

const server = http.createServer((req, res) => {
    const urlObj = getURLObj(req);
    console.log(urlObj);
    const path = urlObj.pathname
    if (path === '/') {
        readFromFile(res, '/public/index.html', {
            'Content-Type': 'text/html'
        })
    } else if (path.split('.').at(-1) === 'html') {
        readFromFile(res, '/public/pages' + path, {
            'Content-Type': 'text/html'
        })
    } else if (path === '/favicon.ico') { }
    else if (path.split('.').at(-1) === 'js') {
        const filename = path.split('/')[1].split('.')[0];
        const headers = {
            'Content-Type': 'application/javascript'
        };
        console.log(path, filename)
        switch (filename) {
            case 'script':
                readFromFile(res, '/public/script.js', headers);
                break;
            default:
                readFromFile(res, '/public/pages' + path, headers);
                break;
        }
    } else if (path === '/list') {
        let body = '';
        const proc = spawn(PYTHONPATH, ['getFileList.py', urlObj.searchParams.get('list')]);
        proc.stdout.on('data', data => { body += data.toString();})
        proc.stderr.on('data', data => { 
            console.log(data.toString());
            res.writeHead(404, {
                'Content-Type': 'text/html'
            })
            return res.end('File not found');
        })
        proc.on('exit', () => { 
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(body);
        })
    } else {
        res.statusCode = 404;
        res.end(`${path} not found`)
    }
})
//server.listen(port)
server.listen(PORT, DEVIP);
//
