
const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require("fs");

async function getFilePath(fileInput) {
    const globber = await glob.create(fileInput);
    const files = await globber.glob();
    if (!files || !files.length) return null;
    return files[0]
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

        const filePathInclude = await getFilePath(core.getInput('include'));
        if (!filePathInclude) {
            core.setFailed("Invalid file path include");
            return;
        }

        const fileBuffer = fs.readFileSync(filePathInclude);
        const fileContent = fileBuffer.toString();
        let newContent = fileContent;

        finds.forEach((str, i) => {
            let _val = replaces[i];
            if (str && _val) {
                newContent = newContent.replace(str, _val);
                console.log("Replace key --> ", str)
            }
        })
        console.log("New content --> ", newContent)

        fs.writeFileSync(filePathInclude, newContent);
        core.info("Find and replace success !!!")
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()