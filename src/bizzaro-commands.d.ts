/**bizarro-devin/src/bizzaro-commands.d.ts
 * Makes it so that all exports in bizzaro-commands.js are declared as functions that return a promise for void or just void
 */
type CommandFunc = (...args: any[]) => (Promise<void> | void);

export const setupLayout: CommandFunc;
export const runAIAgent: CommandFunc;
export const createFiles: CommandFunc;

//pls if anybody knows any dynamic way to do this, let me know 