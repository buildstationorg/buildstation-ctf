'use client'

import { useReadContract } from "wagmi";
import { vaultAbi } from "./vaultAbi";
import { Skeleton } from "@/components/ui/skeleton"
import { formatEther } from 'viem'
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"


export default function VaultStatusCard() {
  const {
    data: vaultStatus,
    isPending,
    refetch
  } = useReadContract({
    abi: vaultAbi,
    address: "0x43cd9FdD8594Af5299B96b5e46C5706159f902Ad",
    functionName: "locked",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4 shadow-xl w-full lg:max-w-3xl">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-semibold">Vault Status</h1>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <p className="italic text-sm">Current locked status of the vault</p>
      {isPending ? <Skeleton className="w-[50px] h-[20px]" /> : <p className="text-sm lg:text-lg font-mono flex flex-row items-center">{vaultStatus ? "Vault is currently locked" : "Vault is currently unlocked"}</p>}
    </div>
  );
}