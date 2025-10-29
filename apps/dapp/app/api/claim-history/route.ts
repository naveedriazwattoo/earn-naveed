import { NextResponse } from 'next/server';
import axios from 'axios';

interface WorldScanTransaction {
  hash: string;
  blockNumber: string;
  timeStamp: string;
  value: string;
  from: string;
  to: string;
  status: string;
  gasUsed: string;
  gasPrice: string;
}

interface WorldScanResponse {
  status: string;
  message: string;
  result: WorldScanTransaction[];
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');

    if (!address) {
      return NextResponse.json(
        { error: 'Address is required' },
        { status: 400 }
      );
    }

    const WORLDSCAN_API_KEY = process.env.WORLDSCAN_API_KEY;
    const WORLDSCAN_BASE_URL = "https://api.worldscan.org/api";

    if (!WORLDSCAN_API_KEY) {
      return NextResponse.json(
        { error: 'WORLDSCAN_API_KEY is not configured' },
        { status: 500 }
      );
    }

    const response = await axios.get<WorldScanResponse>(WORLDSCAN_BASE_URL, {
      params: {
        module: "account",
        action: "tokentx",
        address,
        contractaddress: process.env.NEXT_PUBLIC_MINI_TOKEN_ADDRESS,
        apikey: WORLDSCAN_API_KEY,
        sort: "desc",
        page: 1,
        offset: 100
      }
    });

    if (!response.data || !response.data.result) {
      return NextResponse.json(
        { error: 'Invalid response from WorldScan API' },
        { status: 500 }
      );
    }

    // Process the transactions
    const processedEvents = response.data.result
      .filter((tx) => tx.to.toLowerCase() === address.toLowerCase())
      .map((tx) => ({
        transactionHash: tx.hash,
        blockNumber: parseInt(tx.blockNumber),
        timestamp: parseInt(tx.timeStamp),
        amount: parseInt(tx.value) / 1e18,
        from: tx.from,
        to: tx.to,
        status: tx.status,
        gasUsed: parseInt(tx.gasUsed),
        gasPrice: parseInt(tx.gasPrice)
      }));

    return NextResponse.json({ events: processedEvents });
  } catch (error) {
    console.error('Error fetching claim history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch claim history' },
      { status: 500 }
    );
  }
} 