const say = require('say');

const speak = async (text) => {
    return new Promise((resolve) => {
        say.speak(text, null, 1, (err) => {
            if (err) {
                console.error(err);
                resolve(); // If we reject here we'd have to still capture the rejection in the caller, but it's not like we are going to actually do something with the error anyways
            }
            resolve();
        });
    });
};

module.exports = {
    speak,
};
