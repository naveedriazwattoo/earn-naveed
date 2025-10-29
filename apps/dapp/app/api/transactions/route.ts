import { NextResponse } from "next/server";
import axios from "axios";

const WORLDSCAN_API_KEY = process.env.WORLDSCAN_API_KEY;
const WORLDSCAN_BASE_URL = "https://api.worldscan.org/api";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const address = searchParams.get("address");
  const lastClaimedBlock = searchParams.get("lastClaimedBlock");

  if (!address) {
    return NextResponse.json({ error: "Wallet address is required" }, { status: 400 });
  }

  try {
    const [nativeTransfers, erc20Transfers] = await Promise.all([
      // Native token transfers
      axios.get(WORLDSCAN_BASE_URL, {
        params: {
          module: "account",
          action: "txlist",
          address,
          startblock: lastClaimedBlock || 0,
          endblock: 999999999,
          sort: "desc",
          apikey: WORLDSCAN_API_KEY,
        },
      }),
      // ERC20 token transfers
      axios.get(WORLDSCAN_BASE_URL, {
        params: {
          module: "account",
          action: "tokentx",
          address,
          startblock: lastClaimedBlock || 0,
          endblock: 999999999,
          sort: "desc",
          apikey: WORLDSCAN_API_KEY,
        },
      }),
      // NFT transfers
      // axios.get(WORLDSCAN_BASE_URL, {
      //   params: {
      //     module: "account",
      //     action: "tokennfttx",
      //     address,
      //     startblock: lastClaimedBlock || 0,
      //     endblock: 999999999,
      //     sort: "desc",
      //     apikey: WORLDSCAN_API_KEY,
      //   },
      // }),
    ]);

    return NextResponse.json({
      nativeTransfers: nativeTransfers.data.result,
      erc20Transfers: erc20Transfers.data.result,
      // nftTransfers: nftTransfers.data.result,
    });
  } catch (error) {
    console.error("WorldScan API Error:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}
