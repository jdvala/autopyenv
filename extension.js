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
let configFolderPath = null;
let configFolder = null;


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  
  // only activate environment if user wants to
  let disposible = vscode.commands.registerCommand('extension.autopyenv', function() {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    configFolder = vscode.workspace.getConfiguration('autopyenv').get("configfolder");
    
    
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
      //check for environment inside configfolder folder
      configFolderPath = path.join(exactPath, configFolder);
      if (fs.existsSync(configFolderPath)) {
        // check if environment is present
        let existEnvPath = path.join(configFolderPath, `${folderName}`, "bin", "activate");
        if (existEnvPath) {
          // Just activate the environment
          vscode.window.showInformationMessage("Environment already exist, Do you want to activate it?", ...["Yes", "No"]).then(selection => {
            if (selection === "Yes") {
              activateEnv()
            }
            else {
              vscode.window.showInformationMessage(`Environment ${folderName} not activated`)
            }
          });

        } else {
          vscode.window.showInformationMessage(`${configFolder} folder exists but no environment, do you want to create environment in ${configFolder} folder?`, ...["Yes", "No"])
            .then(selection => {
              if (selection === "Yes") {
                // create a terminal with name as foldername+Environment
                createEnvironment()
              }
            });
        }
      } else {
        vscode.window.showInformationMessage(`No ${configFolder} folder found, creating ${configFolder} folder`);
        // create a vscode folder
        fs.mkdirSync(configFolderPath)

        // create the environment
        createEnvironment()
      }
    }
  });
  context.subscriptions.push(disposible)
}

exports.activate = activate;

// method to activate the new env if exist
const activateEnv = () => {
  //create a new terminal session
  defaultShell = vscode.window.createTerminal(`${folderName} Environment`);

  let envPath = path.join(`${configFolderPath}`, `${folderName}`, "bin", "activate")
  defaultShell.sendText(`source ${envPath}`);
}

// method to create and activate new environment
const createEnvironment = () => {
  defaultShell = vscode.window.createTerminal(
    `${folderName} Environment`
  );
  // send text to the terminal with the command to create the virtual environment
  let newEnvPath = path.join(`${configFolderPath}`, `${folderName}`)
  defaultShell.sendText(`python3 -m venv ${newEnvPath}`);
  vscode.window.showInformationMessage(`Created python3 virtual environment in ${configFolder} folder`);

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
