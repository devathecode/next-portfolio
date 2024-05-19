"use client"
import { animatePageOut } from "@/utils/animation"
import { usePathname, useRouter } from "next/navigation"

interface Props {
    href: string
    label: string
}

const TransitionLink = ({ href, label }: Props) => {
    const router = useRouter()
    const pathname = usePathname()

    const handleClick = () => {
        if (pathname !== href) {
            animatePageOut(href, router)
        }
    }

    return (
        <span
            className=""
            onClick={handleClick}>
            {label}
        </span>
    )
}

export default TransitionLink