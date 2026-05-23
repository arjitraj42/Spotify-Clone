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
    
    content = content.replace(/'https:\/\/spotify-clone-mz14\.onrender\.com\/api\//g, "'/api/");
    content = content.replace(/`https:\/\/spotify-clone-mz14\.onrender\.com\/api\//g, "`/api/");
    content = content.replace(/"https:\/\/spotify-clone-mz14\.onrender\.com\/api\//g, "\"/api/");

    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});
console.log('Done.');
