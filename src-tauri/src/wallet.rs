//! BIP39 / BIP84 Bitcoin wallet — Rust backend for the Tauri app.

use anyhow::{anyhow, Result};
use bip39::{Language, Mnemonic};
use bitcoin::{
    bip32::{DerivationPath, Xpriv},
    secp256k1::Secp256k1,
    Address, CompressedPublicKey, Network,
};
use rand::RngCore;
use serde::Serialize;
use std::str::FromStr;

pub const DEFAULT_PATH: &str = "m/84'/0'/0'/0/0";

#[derive(Debug, Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Wallet {
    pub mnemonic:        String,
    pub address:         String,
    pub private_key_wif: String,
    pub public_key_hex:  String,
    pub derivation_path: String,
}

pub fn generate(words: usize) -> Result<Wallet> {
    let entropy_bytes = match words {
        12 => 16,
        24 => 32,
        n  => return Err(anyhow!("word count must be 12 or 24, got {n}")),
    };
    let mut entropy = vec![0u8; entropy_bytes];
    rand::thread_rng().fill_bytes(&mut entropy);

    let mnemonic = Mnemonic::from_entropy_in(Language::English, &entropy)?;
    derive(&mnemonic.to_string(), DEFAULT_PATH)
}

pub fn derive(mnemonic_str: &str, path: &str) -> Result<Wallet> {
    let mnemonic = Mnemonic::parse_in_normalized(Language::English, mnemonic_str.trim())?;
    let seed     = mnemonic.to_seed("");
    let secp     = Secp256k1::new();
    let master   = Xpriv::new_master(Network::Bitcoin, &seed)?;
    let dpath    = DerivationPath::from_str(path)?;
    let child    = master.derive_priv(&secp, &dpath)?;
    let priv_key = child.to_priv();
    let pub_key  = CompressedPublicKey::from_private_key(&secp, &priv_key)?;
    let address  = Address::p2wpkh(&pub_key, Network::Bitcoin);

    Ok(Wallet {
        mnemonic:        mnemonic.to_string(),
        address:         address.to_string(),
        private_key_wif: priv_key.to_wif(),
        public_key_hex:  pub_key.to_string(),
        derivation_path: path.to_string(),
    })
}

pub fn validate_mnemonic(s: &str) -> bool {
    Mnemonic::parse_in_normalized(Language::English, s.trim()).is_ok()
}

pub fn validate_address(s: &str) -> bool {
    use bitcoin::address::NetworkUnchecked;
    s.trim()
        .parse::<Address<NetworkUnchecked>>()
        .ok()
        .and_then(|a| a.require_network(Network::Bitcoin).ok())
        .is_some()
}
