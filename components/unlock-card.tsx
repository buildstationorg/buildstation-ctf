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
  password: z.string().min(30).max(100),
})

export default function UnlockCard() {
  const { toast } = useToast()
  const { data: hash, isPending, writeContract } = useWriteContract()
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    writeContract({ 
      abi: vaultAbi, 
      address: '0x43cd9FdD8594Af5299B96b5e46C5706159f902Ad', 
      functionName: 'unlock',
      args: [values.password as `0x${string}`],
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
        <CardTitle>Unlock vault</CardTitle>
        <CardDescription>Unlock the vault to access the balance</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter the password" {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormDescription>
                    You will unlock the vault with correct password.
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