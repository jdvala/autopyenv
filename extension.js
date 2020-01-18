// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const os = require("os");
const fs = require("fs");
var exec = require("child_process").exec,
  child;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

// Global Variables
let folderName = null;
let exactPath = null;
let defaultShell = null;
let dotVscodeFolder = null;
let configFolder = null;


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  configFolder = vscode.workspace.getConfiguration('autopyenv').get("configfolder");

  // Check if user wants to create an environment
  vscode.window
    .showInformationMessage('Do you want to create a python virtual environment in your .vscode folder?', ...['YES', 'NO'])
    .then(selection => {
      if (selection === "YES") {
        // check if we are in a workspace

        if (vscode.workspace) {
          exactPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
          folderName = exactPath.split(path.sep)[
            exactPath.split(path.sep).length - 1
          ];

          vscode.window.showInformationMessage(`Found Workspace ${folderName}`);
        } else {
          vscode.window.showErrorMessage("No Workspace found, no folder open");
        }

        // if we found foldername then start using the shell commands
        if (folderName) {
          //check for .vscode folder
          dotVscodeFolder = path.join(exactPath, ".vscode");
          if (fs.existsSync(dotVscodeFolder)) {
            // create a terminal with name as foldername+Environment
            createEnvironment()

          } else {
            vscode.window.showInformationMessage("No .vscode folder found, creating .vscode folder");
            // create a vscode folder
            fs.mkdirSync(dotVscodeFolder)

            // create the environment
            createEnvironment()
          }
        }
      }
      else {
        vscode.window.showInformationMessage("No environment created, thanks for using autopyenv")
      }
    });
}
exports.activate = activate;


const createEnvironment = () => {
  defaultShell = vscode.window.createTerminal(
    `${folderName} Environment`
  );

  // ask user if they want to create a new environment in the .vscode folder 


  // send text to the terminal with the command to create the virtual environment
  let newEnvPath = path.join(`${dotVscodeFolder}`, `${folderName}`)
  defaultShell.sendText(`python3 -m venv ${newEnvPath}`);
  vscode.window.showInformationMessage("Created python3 virtual environment in .vscode folder");

  // create the activate path
  let activationPath = path.join(`${newEnvPath}`, "bin", "activate");

  defaultShell.sendText(`source ${activationPath}`);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
  activate,
  deactivate
};
