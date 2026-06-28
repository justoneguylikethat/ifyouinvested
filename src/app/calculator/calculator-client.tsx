"use client";

import { CalculatorForm } from "@/components/calculator-form";
import { useRouter } from "next/navigation";

export function CalculatorClient() {
  const router = useRouter();
  
  return (
    <CalculatorForm 
      onCalculate={(data) => {
        if (data.assets.length > 0) {
          router.push(`/time-machine`);
        }
      }} 
      isLoading={false} 
    />
  );
}
