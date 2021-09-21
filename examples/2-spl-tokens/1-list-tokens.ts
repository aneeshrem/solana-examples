import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AccountLayout, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';

// use your wallet pubkey
const pubKey = new PublicKey("4DQpzL1SCiutXjhCzGDCwcgShYxFKVxw13RZSvWKBqaa");

// Returns SPL Token accounts associated with a wallet account.
async function fetchSPLTokens(connection: Connection, pubKey: PublicKey) {
    return connection.getParsedProgramAccounts(TOKEN_PROGRAM_ID, {
        commitment: connection.commitment,
        filters: [
            { dataSize: 165 }, // compares the program account data length with the provided data size
            {
                memcmp: { // filter memory comparison
                    offset: 32, // owner metadata is 32 bytes offset
                    bytes: pubKey.toBase58(),
                }
            },
        ]
    });
}

async function main() {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const tokens = await fetchSPLTokens(connection, pubKey);

    tokens.forEach(token => {
        console.log(token);
    });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });