
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
        return str.split(separator).filter(Boolean).map(_s => _s.trim());
    }
    return ''
}
function transformString(str, key) {
    const _str = str.trim();
    if (_str[0] == "'" || _str[0] == '"') {
        console.log("Transform string key --> ", key);
        return _str.substring(1, _str.length - 1)
    }
    return str
}
async function main() {
    try {
        const finds = getListString(core.getInput('finds'));
        const replaces = getListString(core.getInput('replaces'));
        const isTransform = core.getBooleanInput('isTransform');

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
            let _val = replaces[i];
            if (str && _val) {
                if (isTransform) _val = transformString(_val, str);
                newContent = newContent.replace(str, _val);
                core.info("Replace key --> ", str)
            }
        })

        fs.writeFileSync(filePathInclude, newContent);
        core.info("Find and replace success !!!")
    } catch (error) {
        core.setFailed(error.message);
    }
}

main()