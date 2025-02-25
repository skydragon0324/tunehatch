import argon2 from 'argon2'
import rl from 'readline'
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
});

const generatePassword = async () => {
    readline.question('Please enter plaintext password: ', async (password) => {
        let hashedPassword = await argon2.hash(password)
        console.log(hashedPassword)
        readline.close();
    });
    return true
}

generatePassword();