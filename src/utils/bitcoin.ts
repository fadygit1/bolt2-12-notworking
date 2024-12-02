import { Buffer } from 'buffer';
import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as secp256k1 from 'tiny-secp256k1';
import { hexToBuffer } from './crypto';

const ECPair = ECPairFactory(secp256k1);

export function isValidPrivateKey(privateKey: string): boolean {
  try {
    const buffer = hexToBuffer(privateKey);
    return buffer.length === 32 && secp256k1.privateKeyVerify(buffer);
  } catch {
    return false;
  }
}

export function privateKeyToAddress(privateKey: string): string {
  try {
    const keyPair = ECPair.fromPrivateKey(hexToBuffer(privateKey));
    const { address } = bitcoin.payments.p2pkh({ 
      pubkey: keyPair.publicKey,
      network: bitcoin.networks.bitcoin 
    });
    return address || '';
  } catch (error) {
    console.error('Error generating address:', error);
    return '';
  }
}

export function isInRange(privateKey: string, start: string, end: string): boolean {
  try {
    const pkNum = BigInt(`0x${privateKey}`);
    const startNum = BigInt(`0x${start}`);
    const endNum = BigInt(`0x${end}`);
    return pkNum >= startNum && pkNum <= endNum;
  } catch {
    return false;
  }
}