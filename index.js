
const core = require('@actions/core');
const glob = require('@actions/glob');
const yaml = require('js-yaml');
const fs = require("fs");

async function getFilePath(fileInput) {
    const globber = await glob.create(fileInput);
    const files = await globber.glob();
    if (!files || !files.length) return null;
    return files[0]
}

async function findAndReplace(filePath, data) {
    let objectData = {};
    if (filePath.includes('.yml') || filePath.includes('.yaml')) {
        objectData = yaml.load(fs.readFileSync(filePath, 'utf8'));
    } else if (filePath.includes('.json')) {
        objectData = require(filePath);
    }
    if (typeof objectData != 'object') {
        core.setFailed("Invalid input config object");
        return;
    }
    Object.keys(data).forEach(key => {
        objectData[key] ? console.log("Replace key --> ", key) :console.log("Add new key --> ", key);
        objectData[key] = data[key]
    })
    fs.writeFileSync(filePath, yaml.dump(objectData));
    console.log("Replace object success!!")
}
async function testWirteFile(file) {
    const content = fs.readFileSync(file, 'utf8');
    console.log("New content ", content)
}
async function main() {
    try {
        const paramInput = core.getInput('replaces', { required: true });
        const data = JSON.parse(paramInput);
        if (typeof data != 'object') {
            core.setFailed("Invalid input");
            return;
        }

        const filePathInclude = await getFilePath(core.getInput('file', { required: true }));
        if (!filePathInclude) {
            core.setFailed("Invalid file path include");
            return;
        }

        await findAndReplace(filePathInclude, data);
        await testWirteFile(filePathInclude)
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()