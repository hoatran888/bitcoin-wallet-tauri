// Bridge between the React UI and the Rust backend.
// All crypto happens in Rust — this file just dispatches calls.
import { invoke } from '@tauri-apps/api/core';

export async function generateWallet(words = 12) {
  return await invoke('generate_wallet', { words });
}

export async function restoreWallet(mnemonic) {
  return await invoke('restore_wallet', { mnemonic });
}

export async function verifyMnemonic(mnemonic) {
  return await invoke('verify_mnemonic', { mnemonic });
}

export async function verifyAddress(address) {
  return await invoke('verify_address', { address });
}
