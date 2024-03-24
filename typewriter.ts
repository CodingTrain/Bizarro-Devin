export default (
    str: string,
    paper: (character: Partial<string>) => any
) => { 
    str.split("").forEach(paper)
}