import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d0a1a] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#a855f7] mb-4">404</h1>
        <h2 className="text-2xl font-bold text-[#f5f5f7] mb-4">Không tìm thấy truyện</h2>
        <p className="text-[#9ca3af] mb-8">
          Truyện bạn tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <Button asChild className="bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-90 text-white rounded-full px-8">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Link>
        </Button>
      </div>
    </div>
  )
}
