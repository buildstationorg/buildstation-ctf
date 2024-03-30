'use client'

import { useReadContract } from "wagmi";
import { vaultAbi } from "./vaultAbi";
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"


export default function ManagerInfo() {
  const {
    data: managerAddress,
    isPending,
    refetch
  } = useReadContract({
    abi: vaultAbi,
    address: "0x43cd9FdD8594Af5299B96b5e46C5706159f902Ad",
    functionName: "manager",
  });

  return (
    <div className="flex flex-col gap-2 rounded-lg p-4 shadow-xl w-full lg:max-w-3xl">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-semibold">Manager address</h1>
        <Button variant="outline" size="icon" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4" />
        </Button>
      </div>
      <p className="italic text-sm">Current known manager of the vault</p>
      {isPending ? <Skeleton className="w-[50px] h-[20px]" /> : <a target="_blank" href={`https://sepolia.etherscan.io/address/${managerAddress}`} className="text-sm lg:text-lg font-mono text-blue-500 underline">{managerAddress}</a>}
    </div>
  );
}