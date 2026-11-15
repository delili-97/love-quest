import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClick: () => void
  variant?: 'pink' | 'lavender'
}

export default function PixelButton({ children, onClick, variant = 'pink' }: Props) {
  const color =
    variant === 'pink'
      ? 'bg-pink-500 hover:bg-pink-400 text-white shadow-[0_-4px_0_0_#ec4899,0_4px_0_0_#ec4899,-4px_0_0_0_#ec4899,4px_0_0_0_#ec4899,6px_6px_0_4px_#6b2a8f]'
      : 'bg-violet-300 hover:bg-violet-200 text-violet-950 shadow-[0_-4px_0_0_#c4b5fd,0_4px_0_0_#c4b5fd,-4px_0_0_0_#c4b5fd,4px_0_0_0_#c4b5fd,6px_6px_0_4px_#6b2a8f]'

  return (
    <button
      onClick={onClick}
      className={`${color} m-3 px-4 py-3 text-xs cursor-pointer active:translate-x-1 active:translate-y-1`}
    >
      {children}
    </button>
  )
}