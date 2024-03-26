/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createFiles: () => (/* binding */ createFiles),
/* harmony export */   runAIAgent: () => (/* binding */ runAIAgent),
/* harmony export */   setupLayout: () => (/* binding */ setupLayout)
/* harmony export */ });
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _util_createFiles_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _util_realisticTyping_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4);
/* harmony import */ var _util_speak_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(6);
/* harmony import */ var _util_sleep_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(5);
/* harmony import */ var _script_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7);









async function setupLayout() {
  // TODO: CREATE index.html and sketch.js
  // Run live server
  // Also, set up the window panes properly

  // get active text editor
  let editor = vscode__WEBPACK_IMPORTED_MODULE_0__.window.activeTextEditor;
  if (!editor) {
      vscode__WEBPACK_IMPORTED_MODULE_0__.window.showInformationMessage('Create a text file first!');
      return; // No open text editor
  }

  // Open live preview
  await vscode__WEBPACK_IMPORTED_MODULE_0__.commands.executeCommand('livePreview.start');

  // Wait a second for the window to at least open
  while (vscode__WEBPACK_IMPORTED_MODULE_0__.window.tabGroups.all.length < 2) {
      await (0,_util_sleep_js__WEBPACK_IMPORTED_MODULE_4__.sleep)(50);
  }

  // Toggle row layout
  await vscode__WEBPACK_IMPORTED_MODULE_0__.commands.executeCommand(
      'workbench.action.toggleEditorGroupLayout'
  );

  // Set this tab as our active tab again (weird workaround to make sure the next command works)
  await vscode__WEBPACK_IMPORTED_MODULE_0__.commands.executeCommand('vscode.open', editor.document.uri);

  // Move code editor to the bottom
  await vscode__WEBPACK_IMPORTED_MODULE_0__.commands.executeCommand(
      'workbench.action.moveActiveEditorGroupDown'
  );
}

// TODO: Receive a prompt to get started
async function runAIAgent() {
  let editor = vscode__WEBPACK_IMPORTED_MODULE_0__.window.activeTextEditor;
  if (!editor) {
      vscode__WEBPACK_IMPORTED_MODULE_0__.window.showInformationMessage('Create a text file first!');
      return; // No open text editor
  }

  // Iterate through each step
  for (const step of _script_js__WEBPACK_IMPORTED_MODULE_5__.script) {
      await processStep(step, editor);
  }
}


async function createFiles() {
  await (0,_util_createFiles_js__WEBPACK_IMPORTED_MODULE_1__.createIndexHtml)();
  await (0,_util_createFiles_js__WEBPACK_IMPORTED_MODULE_1__.createSketchJs)();
}


async function processStep(step, editor) {
  if (step.type === 'code') {
      await (0,_util_realisticTyping_js__WEBPACK_IMPORTED_MODULE_2__.typeRealistically)(editor, step.content.join('\n')); // Join the array of strings into a single string separated by newlines, more clear in terms of formatting than the template literal
  } else if (step.type === 'narrate') {
      await (0,_util_speak_js__WEBPACK_IMPORTED_MODULE_3__.speak)(step.content);
  }
}

/***/ }),
/* 3 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createIndexHtml: () => (/* binding */ createIndexHtml),
/* harmony export */   createSketchJs: () => (/* binding */ createSketchJs)
/* harmony export */ });
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);

async function createIndexHtml() {
  const activeFolder = vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.workspaceFolders?.[0];
  if (!activeFolder) {
    vscode__WEBPACK_IMPORTED_MODULE_0__.window.showInformationMessage('Open a folder first!');
    return;
  }

  const indexHtmlPath = vscode__WEBPACK_IMPORTED_MODULE_0__.Uri.joinPath(activeFolder.uri, 'index.html');
  const indexHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
</body>
</html>`;

  await vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.fs.writeFile(indexHtmlPath, new TextEncoder().encode(indexHtmlContent));
}

async function createSketchJs() {
  const scetchJsPath = vscode__WEBPACK_IMPORTED_MODULE_0__.Uri.joinPath(activeFolder.uri, 'sketch.js');
  const sketchJsContent = '';
  await vscode__WEBPACK_IMPORTED_MODULE_0__.workspace.fs.writeFile(scetchJsPath, new TextEncoder().encode(sketchJsContent));
}

/***/ }),
/* 4 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   typeRealistically: () => (/* binding */ typeRealistically)
/* harmony export */ });
/* harmony import */ var _sleep_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



const typeRealistically = async (editor, code, delay = 100) => {
    for (let i = 0; i < code.length; i++) {
        const char = code.charAt(i);
        await editor.edit((editBuilder) => {
            editBuilder.insert(editor.selection.active, char);
        });
        if (char !== ' ') { await (0,_sleep_js__WEBPACK_IMPORTED_MODULE_0__.sleep)(delay); }
    }
    // Insert newline
    await editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.active, '\n');
    });

    // Format document
    await vscode__WEBPACK_IMPORTED_MODULE_1__.commands.executeCommand('vscode.open', editor.document.uri);
    await vscode__WEBPACK_IMPORTED_MODULE_1__.commands.executeCommand('editor.action.formatDocument');
};

/***/ }),
/* 5 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   sleep: () => (/* binding */ sleep)
/* harmony export */ });
const sleep = async (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   speak: () => (/* binding */ speak)
/* harmony export */ });
//import { speak as _speak } from 'say';

const speak = async (text) => {

    return;

    /**i dont know why this is needed but it does work fine without it
     *     return new Promise((resolve) => {
     *         _speak(text, null, 1, (err) => {
     *             if (err) {
     *                 console.error(err);
     *                 resolve();
     *             }
     *             resolve();
     *         });
     *     });
     */
};


/***/ }),
/* 7 */
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   script: () => (/* binding */ script)
/* harmony export */ });
const script = [
  {
      type: 'narrate',
      content:
          "First I'm creating the canvas with a size of 640 by 360 pixels.",
  },
  {
      type: 'code',
      content: ['function setup() {', '    createCanvas(640, 360);', '}'],
  },
  {
      type: 'narrate',
      content:
          "Now I'm creating the draw loop which will run continuously. It will call the branch method to start drawing the tree.",
  },
  {
      type: 'code',
      content: [
          'function draw() {',
          '    background(0);',
          '    stroke(255);',
          '    strokeWeight(2);',
          '    translate(width * 0.5, height);',
          '    branch(100);',
          '}',
      ],
  },
  {
      type: 'narrate',
      content:
          'The branch method is a recursive function that draws the tree. It takes a length parameter and draws a line of that length.',
  },
  {
      type: 'code',
      content: [
          'function branch(len) {',
          '    line(0, 0, 0, -len);',
          '    translate(0, -len);',
          '    if (len > 4) {',
          '        push();',
          '        rotate(PI/4);',
          '        branch(len * 0.67);',
          '        pop();',
          '        push();',
          '        rotate(-PI/4);',
          '        branch(len * 0.67);',
          '        pop();',
          '    }',
          '}',
      ],
  },
];

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   activate: () => (/* binding */ activate),
/* harmony export */   deactivate: () => (/* binding */ deactivate)
/* harmony export */ });
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var vscode__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vscode__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _bizzaro_commands_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "bizarro-devin" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    for (const [key, value] of Object.entries(_bizzaro_commands_js__WEBPACK_IMPORTED_MODULE_1__)) { //key is the name of the exported function, value is the function
        context.subscriptions.push(vscode__WEBPACK_IMPORTED_MODULE_0__.commands.registerCommand("bizarro-devin." + key, value));
    }
}
// This method is called when your extension is deactivated
function deactivate() { }

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map