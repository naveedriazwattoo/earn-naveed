import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'

interface IRequestPayload {
	payload: MiniAppWalletAuthSuccessPayload
	nonce: string
}

export const POST = async (req: NextRequest) => {
	const { payload, nonce } = (await req.json()) as IRequestPayload
	const cookieStore = req.cookies
	const storedNonce = cookieStore.get('siwe')?.value

	if (nonce !== storedNonce) {
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: 'Invalid nonce',
		})
	}

	try {
		const validMessage = await verifySiweMessage(payload, nonce)
		return NextResponse.json({
			status: 'success',
			isValid: validMessage.isValid,
		})
	} catch (error: Error | unknown) {
		// Handle errors in validation or processing
		return NextResponse.json({
			status: 'error',
			isValid: false,
			message: error instanceof Error ? error.message : 'Unknown error occurred',
		})
	}
}
