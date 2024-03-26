/*
To simulate response from AI
*/
export const Devin_Response = async (prompt:string,texteditor_text:string) => {
    if(!prompt) return new Message("the prompt is empty!!");
    await delay(200);
    return new Message(`function setup() {\ncreateCanvas(400, 400);\nbackground(255); }\nfunction draw() { fill(0);\ncircle(mouseX, mouseY, 100); }`,
    {
        fun:true,
        expect_response:"maybe"
    })
}

function delay (time:number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

class Message {

    msg:string
    [key:string]:any

    constructor(msg:string,rest?:{}) {
        this.msg = msg;
        for (const [key, value] of Object.entries(rest)) 
            this[key] = value;
    }
}