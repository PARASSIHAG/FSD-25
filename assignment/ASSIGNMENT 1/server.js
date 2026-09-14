
const http = require('http');
const fs = require('fs');

const PORT = 3000;
const FILE = 'students.json';

if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, '[]');
}

const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Student Record Form</title>
    <style>
        body {
            font-family: Arial;
            background: #f2f2f2;
            padding: 30px;
        }
        .container {
            background: white;
            padding: 25px;
            max-width: 400px;
            margin: auto;
            border-radius: 10px;
        }
        input, button {
            width: 100%;
            padding: 10px;
            margin: 8px 0;
            box-sizing: border-box;
        }
        button {
            background: green;
            color: white;
            border: none;
            cursor: pointer;
        }
        a {
            display: block;
            margin-top: 15px;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Student Record Form</h2>

    <form method="POST" action="/add">

        <label>Student Name</label>
        <input type="text" name="name" required>

        <label>Roll Number</label>
        <input type="text" name="roll" required>

        <label>Course</label>
        <input type="text" name="course" required>

        <label>Email</label>
        <input type="email" name="email" required>

        <button type="submit">Add Student</button>

    </form>

    <a href="/students">View Student Records</a>
</div>

</body>
</html>
`;

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.end(html);
    }

    else if (req.method === 'POST' && req.url === '/add') {

        let body = '';

        req.on('data', chunk => {
            body += chunk;
        });

        req.on('end', () => {

            const params = new URLSearchParams(body);

            const student = {
                name: params.get('name'),
                roll: params.get('roll'),
                course: params.get('course'),
                email: params.get('email')
            };

            fs.readFile(FILE, 'utf8', (err, data) => {

                let students = [];

                if (!err && data) {
                    students = JSON.parse(data);
                }

                students.push(student);

                fs.writeFile(
                    FILE,
                    JSON.stringify(students, null, 2),
                    err => {

                        if (err) {
                            res.writeHead(500);
                            res.end('Error saving student');
                            return;
                        }

                        res.writeHead(200, {
                            'Content-Type': 'text/html'
                        });

                        res.end(`
                            <h2>Student Added Successfully</h2>
                            <a href="/">Add Another Student</a>
                            <a href="/students">View Students</a>
                        `);
                    }
                );
            });
        });
    }

    else if (req.method === 'GET' && req.url === '/students') {

        fs.readFile(FILE, 'utf8', (err, data) => {

            if (err) {
                res.writeHead(500);
                res.end('Error reading file');
                return;
            }

            const students = JSON.parse(data);

            res.writeHead(200, {
                'Content-Type': 'text/html'
            });

            let output = `
                <html>
                <head>
                    <title>Student Records</title>
                </head>
                <body>
                <h1>Student Records</h1>
                <table border="1" cellpadding="10">
                <tr>
                    <th>Name</th>
                    <th>Roll Number</th>
                    <th>Course</th>
                    <th>Email</th>
                </tr>
            `;

            students.forEach(student => {

                output += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.course}</td>
                        <td>${student.email}</td>
                    </tr>
                `;

            });

            output += `
                </table>
                <br>
                <a href="/">Back to Form</a>
                </body>
                </html>
            `;

            res.end(output);
        });
    }

    else {
        res.writeHead(404, {
            'Content-Type': 'text/html'
        });

        res.end('<h1>404 Page Not Found</h1>');
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});