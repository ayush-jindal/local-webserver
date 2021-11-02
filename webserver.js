const http = require('http')
const fs = require('fs')
const { URL } = require('url')
const { spawn } = require('child_process');
const { url } = require('inspector');

const PORT = process.env.PORT || 3000;
const DEVIP = '192.168.1.6';
const PYTHONPATH = '/home/jindal/Py39/bin/python';
const CONTENTPATH = '/home/jindal/Downloads/nobackup/';

const MIMETypes = {
    'js': 'text/javascript',
    'pdf': 'application/pdf',
    'epub': 'application/epub+zip',
    'zip': 'application/zip',
    'ts': 'video/mp2t',
    'mp3': 'audio/mpeg',
    'png': 'image/png',
};

const getContentType = name => {
    return MIMETypes[name.split('.').at(-1)];
}

const getURLObj = function (req) {
    return new URL(req.url, `http://${req.headers.host}/`);
}

const readFromFile = (res, path, headers, absPath) => {
    console.log((absPath ? '' : __dirname) + path);
    fs.readFile((absPath ? '' : __dirname) + path, (err, data) => {
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
    // console.log(urlObj);
    const path = urlObj.pathname
    if (req.method == 'POST') {
        console.log(req.file);
        let body = ''
        req.on('data', data => {
            body += data
        })
        req.on('end', function () {
            // console.log(req);
            console.log('Body: ' + body)
            res.writeHead(200, { 'Content-Type': 'text/html' })
            res.end('post received')
        })
    } else if (path === '/') {
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
        switch (filename) {
            case 'script':
                readFromFile(res, '/public/script.js', headers);
                break;
            default:
                readFromFile(res, '/public/pages' + path, headers);
                break;
        }
    } else if (path.split('.').at(-1) === 'css') {
        readFromFile(res, '/public/style.css', {
            'Content-Type': 'text/css'
        });
    } else if (path === '/list') {
        let body = '';
        const params = ['getFileList.py', urlObj.searchParams.get('list')]
        if (urlObj.searchParams.get('path'))
            params.push(urlObj.searchParams.get('path'));
        const proc = spawn(PYTHONPATH, params);
        proc.stdout.on('data', data => { body += data.toString(); })
        proc.stderr.on('data', data => {
            console.log(data.toString());
            res.writeHead(404, {
                'Content-Type': 'text/html'
            })
            return res.end('File not found');
        })
        proc.on('exit', () => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(body);
        })
    } else if (path === '/download') {
        if (urlObj.searchParams.get('type') === 'file') {
            const fileName = urlObj.searchParams.get('file');
            readFromFile(res, CONTENTPATH + `${urlObj.searchParams.get('category')}${urlObj.searchParams.get('path')}${fileName}`, {
                'Content-type': getContentType(fileName)
            }, true);
        }
    } else if (path === '/images') {
        const fileName = urlObj.searchParams.get('img');
        readFromFile(res, `/public/images/${fileName}`, {
            'Content-Type': getContentType(fileName)
        });
    } else if (path === '/upload') {
    } else {
        res.statusCode = 404;
        res.end(`${path} not found`)
    }
})
//server.listen(port)
server.listen(PORT, DEVIP);
//
