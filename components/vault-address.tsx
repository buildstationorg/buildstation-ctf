'use client'

export default function VaultAddressCard() {

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4 shadow-xl w-full lg:max-w-3xl">
      <h1 className="text-2xl font-semibold">Vault Address</h1>
      <p className="italic text-sm">Address of the vault on Sepolia testnet</p>
      <a target="_blank" href={`https://sepolia.etherscan.io/address/0x43cd9FdD8594Af5299B96b5e46C5706159f902Ad`} className="text-sm lg:text-lg font-mono text-blue-500 underline">0x43cd9FdD8594Af5299B96b5e46C5706159f902Ad</a>
    </div>
  );
}