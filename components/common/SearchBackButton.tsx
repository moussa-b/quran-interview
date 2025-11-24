"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

type SearchBackButtonProps = {
  label: string
}

export function SearchBackButton({ label }: SearchBackButtonProps) {
  const router = useRouter()

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="cursor-pointer px-0 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      onClick={() => router.back()}
    >
      <ArrowLeft className="size-4" aria-hidden />
      {label}
    </Button>
  )
}

