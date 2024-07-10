"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { truncate } from "@/lib/utils";
import { ConnectKitButton, useIsMounted } from "connectkit";

export default function Header() {
  const isMounted = useIsMounted();

  return (
    <div className="w-full h-16 bg-background border-b sticky top-0 left-0 z-50">
      <div className="size-full flex items-center justify-between px-4">
        <Link href="/" className="size-max">
          <Image src="/core.svg" alt="core" width={120} height={30} />
        </Link>

        <div className="flex items-center gap-4">
          {isMounted ? (
            <ConnectKitButton.Custom>
              {({ isConnected, isConnecting, show, address }) => {
                return isConnected ? (
                  <Button onClick={show} variant="secondary">
                    {truncate(`${address}`)}
                  </Button>
                ) : (
                  <Button onClick={show}>
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                );
              }}
            </ConnectKitButton.Custom>
          ) : (
            "Loading..."
          )}
        </div>
      </div>
    </div>
  );
}
