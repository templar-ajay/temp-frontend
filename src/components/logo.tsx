import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";

const Logo = ({ className }: { className?: string }) => {
  return (
    <Image
      className={cn(className)}
      src="/aic2.jpg"
      alt="aic logo"
      width={200}
      height={200}
    />
  );
};

export default Logo;
