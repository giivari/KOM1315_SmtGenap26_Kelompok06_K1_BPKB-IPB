const fs = require('fs');
const path = require('path');

const clientSrcDir = path.join(__dirname, '03_Source_Code', 'client', 'src');

function revertApiJs() {
    const apiJsPath = path.join(clientSrcDir, 'services', 'api.js');
    let content = fs.readFileSync(apiJsPath, 'utf8');
    content = content.replace(
        "const API_URL = import.meta.env.PROD ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');",
        "const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';"
    );
    fs.writeFileSync(apiJsPath, content);
}

function processDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDirectory(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes("const API_BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');")) {
                content = content.replace(
                    "const API_BASE = import.meta.env.PROD ? '' : (import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');",
                    "const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';"
                );
                fs.writeFileSync(fullPath, content);
            }
        }
    }
}

try {
    revertApiJs();
    processDirectory(path.join(clientSrcDir, 'pages'));
    console.log('Revert done');
} catch (e) {
    console.error(e);
}
