const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            results.push(file);
        }
    });
    return results;
}

const files = walk(srcDir).filter(f => f.endsWith('.js') || f.endsWith('.jsx'));

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace string literals '/api/...'
    content = content.replace(/'\/api\//g, "'https://spotify-clone-mz14.onrender.com/api/");
    // Replace template literals `/api/...`
    content = content.replace(/`\/api\//g, "`https://spotify-clone-mz14.onrender.com/api/");
    // Replace double quotes "/api/..."
    content = content.replace(/"\/api\//g, "\"https://spotify-clone-mz14.onrender.com/api/");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Done.');
