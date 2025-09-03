import Image from "next/image"

interface CoinSymbolProps {
  size?: number
  className?: string
  animate?: boolean
}

export function CoinSymbol({ size = 16, className = "", animate = false }: CoinSymbolProps) {
  return (
    <Image
      src="/placeholder.svg?height=24&width=24&text=💰"
      alt="LEO Coin"
      width={size}
      height={size}
      className={`${className} ${animate ? "animate-pulse" : ""}`}
    />
  )
}

export function CoinDisplay({
  amount,
  size = 16,
  className = "",
}: { amount: number; size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <CoinSymbol size={size} />
      <span className="font-medium">{amount.toLocaleString()}</span>
    </div>
  )
}
