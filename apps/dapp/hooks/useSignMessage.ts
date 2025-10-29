import { useState, useCallback } from 'react';
import { MiniKit, SignMessageInput } from '@worldcoin/minikit-js';
import Safe, { hashSafeMessage } from '@safe-global/protocol-kit';

interface SignMessageResult {
  signature: string;
  address: string;
  isValid: boolean;
}

export function useSignMessage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validSignature, setValidSignature] = useState<boolean>(false);

  const signMessage = useCallback(async (messageToSign: string): Promise<SignMessageResult | null> => {
    try {
      setIsLoading(true);
      setError(null);
      setValidSignature(false);

      const signMessagePayload: SignMessageInput = {
        message: messageToSign,
      };
    
      const { finalPayload } = await MiniKit.commandsAsync.signMessage(signMessagePayload);
    
      if (finalPayload.status === "success") {
        const messageHash = hashSafeMessage(messageToSign);

        const isValid = await (
          await Safe.init({
            provider:
            `${process.env.NEXT_PUBLIC_RPC_URL}`,
            safeAddress: finalPayload.address,
          })
        ).isValidSignature(messageHash, finalPayload.signature);
    
        if (isValid) {
          console.log("Signature is valid");
          setValidSignature(true);
          return {
            signature: finalPayload.signature,
            address: finalPayload.address,
            isValid: true
          };
        } else {
          throw new Error('Invalid signature');
        }
      } else {
        throw new Error('Failed to sign message');
      }
    } catch (err) {
      console.error('Error signing message:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign message');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    signMessage,
    isLoading,
    error,
    validSignature,
  };
} 