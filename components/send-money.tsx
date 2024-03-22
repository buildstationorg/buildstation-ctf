'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { vaultAbi } from './vaultAbi'
import { Badge } from "@/components/ui/badge"
import { Loader2, Check } from "lucide-react"


const formSchema = z.object({
  address: z.string().min(30).max(50),
})

export default function SendAllMoneyCard() {
  const { toast } = useToast()
  const { data: hash, isPending, error, isError, writeContract } = useWriteContract()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract({ 
      abi: vaultAbi, 
      address: '0x6cb7C63762d17630B5F46FD16a29bD7c0503a90a', 
      functionName: 'sendAllMoney',
      args: [values.address as `0x${string}`],
    });
    isError && JSON.stringify(error?.cause)?.match("VaultIsLocked()") 
    ? toast({
      variant: "destructive",
      title: "Transaction failed!",
      description: "You cannot send all money while the vault is locked",
    }) 
    : isError && JSON.stringify(error?.cause)?.match("NotManager()")
    ? toast({
      variant: "destructive",
      title: "Transaction failed!",
      description: "You cannot send all money if you are not the manager",
    }) 
    : toast ({
      title: "Transaction submitted!",
      description: "You can check the status of your transaction soon",
    }) 
  }

  function truncateAddress(address: string) {
    return `${address.slice(0, 6)}...${address.slice(-6)}`
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash, 
    }) 

  return (
    <Card className="w-full border-0 shadow-lg lg:max-w-3xl">
      <CardHeader>
        <CardTitle>Send all money</CardTitle>
        <CardDescription>You can send all money if you are the manager</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manager address</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter the address of manager" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    You can send all money away if all checks are cleared.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
              )
              : (
                <Button type="submit">
                  Submit
                </Button>
              )
            }
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 items-start h-fit">
        <h3 className="scroll-m-20 text-lg font-semibold tracking-tight">Transaction status</h3>
        {hash ? 
          <div className="flex flex-row gap-2">
            Hash: 
            <a target="_blank" className="text-blue-500 underline" href={`https://sepolia.etherscan.io/tx/${hash}`}>{truncateAddress(hash)}</a>
          </div>
          :
          <>
            <div className="flex flex-row gap-2">
              Hash: no transaction hash until after submission
            </div>
            <Badge variant="outline">
              No transaction yet
            </Badge>
          </> 
        }
        {isConfirming && 
          <Badge variant="secondary">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Waiting for confirmation...
          </Badge>
        } 
        {isConfirmed && 
          <Badge className="flex flex-row items-center bg-green-500 cursor-pointer">
            <Check className="mr-2 h-4 w-4" />
            Transaction confirmed!
          </Badge>
        } 
      </CardFooter>
    </Card>
  )
}