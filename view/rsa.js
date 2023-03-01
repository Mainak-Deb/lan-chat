//Creating the keys

var publicKey,privateKey;

async function createKeys() {
    const rsaKey = await KEYUTIL.generateKeypair("RSA", 2048);
    publicKey = await KEYUTIL.getPEM(rsaKey.pubKeyObj);
    privateKey = await KEYUTIL.getPEM(rsaKey.prvKeyObj, "PKCS1PRV");
    // console.log(privateKey);
    // console.log(publicKey);
}

window.onload = function() {
    createKeys();
}


function encryptRSA(publicKey, message) {
    const key = KEYUTIL.getKey(publicKey);
    const encrypted = KJUR.crypto.Cipher.encrypt(message, key);
    return btoa(encrypted);
}

// Decrypt message using private key
function decryptRSA(privateKey, encryptedMessage) {
    const key = KEYUTIL.getKey(privateKey);
    const decrypted = KJUR.crypto.Cipher.decrypt(atob(encryptedMessage), key);
    return decrypted;
}

