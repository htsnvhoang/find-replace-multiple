
const core = require('@actions/core');
const glob = require('@actions/glob');
const fs = require("fs");

async function getFilePath(fileInput) {
    const globber = await glob.create(fileInput);
    const files = await globber.glob();
    if (!files || !files.length) return null;
    return files[0]
}
function getListString(str) {
    const separator = core.getInput('separator') || ",";
    if (typeof str == 'string') {
        return str.split(separator).map(_s => _s.trim());
    }
    return ''
}
async function main() {
    try {
        const finds = getListString(core.getInput('finds'));
        const replaces = getListString(core.getInput('replaces'));

        console.log("Replace list string ", finds);
        if (!finds || !replaces) {
            core.setFailed("Invalid input");
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
            newContent = newContent.replace(str, replaces[i]);
        })

        fs.writeFileSync(filePathInclude, newContent);
        console.log("Find and replace success !!!")
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()