exports.createRandomChars = (size) => {
    const bytesList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];
    let randomChars = [];

    for (let i = 0; i < size; i++) {
        randomChars.push(bytesList[Math.floor(Math.random() * (bytesList.length - 1))]);
    }

    return randomChars.join('');
};