'use client'

import { useReadContract } from "wagmi";
import { tokenAbi } from "./tokenAbi";
import { Skeleton } from "@/components/ui/skeleton"
import { formatEther } from 'viem'
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"


export default function VaultBalance() {
  const {
    data: tokenBalance,
    isPending,
    isFetched,
    isSuccess,
    refetch
  } = useReadContract({
    abi: tokenAbi,
    address: "0x6aF2dfBE6036790C2886360a09d5088211Caa87a",
    functionName: "balanceOf",
    args: ["0x6cb7C63762d17630B5F46FD16a29bD7c0503a90a"],
  });
  const vaultBalance = formatEther(tokenBalance ?? BigInt(0));

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4 shadow-xl w-full lg:max-w-3xl">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-semibold">Vault Balance</h1>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <p className="italic text-sm">Current amount of DAI locked inside the vault</p>
      {isPending ? <Skeleton className="w-[50px] h-[20px]" /> : <p className="text-xl font-mono flex flex-row items-center">{vaultBalance} DAI</p>}
    </div>
  );
}