/**bizarro-devin/src/bizzaro-commands.d.ts
 * This file
 * makes it so that all exports in bizzaro-commands.js are functions that return a promise for void or just void
 */
type exportedType =  {
  [key: string]: (() => Promise<void>) | (() => void);
}

export declare const COMMANDS: exportedType
