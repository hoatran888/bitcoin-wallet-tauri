mod wallet;

use wallet::Wallet;

#[tauri::command]
fn generate_wallet(words: usize) -> Result<Wallet, String> {
    wallet::generate(words).map_err(|e| e.to_string())
}

#[tauri::command]
fn restore_wallet(mnemonic: String) -> Result<Wallet, String> {
    wallet::derive(&mnemonic, wallet::DEFAULT_PATH).map_err(|e| e.to_string())
}

#[tauri::command]
fn verify_mnemonic(mnemonic: String) -> bool {
    wallet::validate_mnemonic(&mnemonic)
}

#[tauri::command]
fn verify_address(address: String) -> bool {
    wallet::validate_address(&address)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            generate_wallet,
            restore_wallet,
            verify_mnemonic,
            verify_address,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
