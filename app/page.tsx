import { ConnectButton } from '@rainbow-me/rainbowkit';
import VaultBalance from '@/components/vault-balance';
import ManagerInfo from '@/components/manager-info';
import UnlockCard from '@/components/unlock-card';
import SendAllMoneyCard from '@/components/send-money';
import VaultStatusCard from '@/components/vault-status';
import VaultAddressCard from '@/components/vault-address';

export default function Home() {
  return (
    <main className="flex flex-col gap-8 items-center justify-center py-12 px-4 p-48:lg">
      <ConnectButton />
      <VaultBalance />
      <ManagerInfo />
      <VaultAddressCard />
      <VaultStatusCard />
      <UnlockCard />
      <SendAllMoneyCard />
    </main>
  );
}
