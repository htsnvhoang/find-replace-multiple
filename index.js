
const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require("fs");

async function getFilePath(fileInput) {
    const globber = await glob.create(fileInput);
    const files = await globber.glob();
    if (!files || !files.length) return null;
    return files
}

async function findReplace(filePath, finds, replaces) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileContent = fileBuffer.toString();
    let newContent = fileContent;

    core.startGroup(`Start find and replace in file ${filePath}`);
    finds.forEach((str, i) => {
        let _val = replaces[i];
        if (str && _val) {
            newContent = newContent.replace(str, _val);
        }
    })

    fs.writeFileSync(filesPathInclude, newContent);
    core.info("Find and replace success !!!");
    core.endGroup();
}
async function main() {
    try {
        const paramInput = core.getInput('params', { required: true });
        const data = JSON.parse(paramInput);
        if (typeof data != 'object' || !data['finds'] || !data['replaces']) {
            core.setFailed("Invalid input");
            return;
        }
        const { finds, replaces } = data;
        if (!finds.length || !replaces.length) {
            core.setFailed("Empty input finds and replacse");
            return;
        }

        const filesPathInclude = await getFilePath(core.getInput('filePattern'));
        if (!filesPathInclude || !filesPathInclude.length) {
            core.setFailed("Invalid file path include");
            return;
        }

        await Promise.all(filesPathInclude.map(async filePath => await findReplace(filePath, finds, replaces)))
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()