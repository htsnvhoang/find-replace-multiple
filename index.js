
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
        return str.split(separator).map(_s => _s.trim()).filter(Boolean);
    }
    return ''
}
function parseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return str
    }
}
async function main() {
    try {
        const finds = getListString(core.getInput('finds'));
        const replaces = getListString(core.getInput('replaces'));
        const transform = core.getInput('transform') || "string";

        console.log("Replace list string --> ", finds);
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
            if (str) {
                let _val = replaces[i];
                if (transform == 'string') {
                    _val = parseJSON();
                    if (typeof _val == 'object') _val = JSON.stringify(_val)
                }
                newContent = newContent.replace(str, _val);
            }
        })

        fs.writeFileSync(filePathInclude, newContent);
        console.log("Find and replace success !!!")
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()