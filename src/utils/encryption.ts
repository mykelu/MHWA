import { box, randomBytes } from 'tweetnacl';
import { encodeBase64, decodeBase64, encodeUTF8, decodeUTF8 } from 'tweetnacl-util';

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export function generateKeyPair(): KeyPair {
  const keyPair = box.keyPair();
  return {
    publicKey: encodeBase64(keyPair.publicKey),
    privateKey: encodeBase64(keyPair.secretKey),
  };
}

export function encryptMessage(
  message: string,
  senderPrivateKey: string,
  recipientPublicKey: string
): string {
  const ephemeralKeyPair = box.keyPair();
  const nonce = randomBytes(box.nonceLength);
  
  const encryptedMessage = box(
    decodeUTF8(message),
    nonce,
    decodeBase64(recipientPublicKey),
    decodeBase64(senderPrivateKey)
  );

  return JSON.stringify({
    encrypted: encodeBase64(encryptedMessage),
    ephemeralPublicKey: encodeBase64(ephemeralKeyPair.publicKey),
    nonce: encodeBase64(nonce),
  });
}

export function decryptMessage(
  encryptedData: string,
  recipientPrivateKey: string,
  senderPublicKey: string
): string {
  const { encrypted, nonce } = JSON.parse(encryptedData);

  const decrypted = box.open(
    decodeBase64(encrypted),
    decodeBase64(nonce),
    decodeBase64(senderPublicKey),
    decodeBase64(recipientPrivateKey)
  );

  if (!decrypted) {
    throw new Error('Failed to decrypt message');
  }

  return encodeUTF8(decrypted);
}

export function generateSharedKey(privateKey: string, publicKey: string): Uint8Array {
  return box.before(decodeBase64(publicKey), decodeBase64(privateKey));
}