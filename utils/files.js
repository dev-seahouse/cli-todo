const util = require('util');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const path = require('path');
const Configstore = require('configstore');
const pkgJson = require('../package.json');
const DEFAULT_FILE_NAME = "data.json";


const getCurrentDir = () => process.cwd();
const currentDir = getCurrentDir();
const DEFAULT_DATA_PATH = currentDir + path.sep + DEFAULT_FILE_NAME;
const conf = new Configstore(pkgJson.name, {dataPath: DEFAULT_DATA_PATH});


const getCurrentDirectoryBase = () => path.basename(process.cwd());

const isPathExists = filePath => fs.existsSync(filePath);

const loadJSON = async filePath => JSON.parse(await readFile(filePath));

const getDataPath = () => conf.get('dataPath');

const setDataPath = (path = DEFAULT_DATA_PATH) => conf.set('dataPath', path);

const createNewData = (path = DEFAULT_DATA_PATH) => writeFile(path, '[]');

const isDataExist = () => isPathExists(getDataPath());

const save = (data) => writeFile(getDataPath(), JSON.stringify(data));

module.exports = {
  getCurrentDir,
  getCurrentDirectoryBase,
  isPathExists,
  loadJSON,
  getDataPath,
  setDataPath,
  createNewData,
  isDataExist,
  save
};

