import Link from "next/link"
import Image from "next/image"
import { Facebook, MessageCircle, Send, Instagram } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="bg-[#0d0a1a] border-t border-[#2d1f4a]/50 mt-12 relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1428]/30 to-transparent pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-12 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Vibe Truyện Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                  vibe truyện
                </span>
                <span className="text-xs text-[#9ca3af]">Đọc truyện theo vibe của bạn</span>
              </div>
            </Link>
            <p className="text-sm text-[#9ca3af] leading-relaxed max-w-sm">
              Vibe Truyện - nơi bạn tìm thấy những câu chuyện phù hợp với cảm xúc và phong cách của riêng mình.
            </p>
            <div className="flex items-center gap-3">
              <Link href="#" className="w-9 h-9 rounded-full bg-[#1a1428] flex items-center justify-center text-[#9ca3af] hover:text-[#a855f7] hover:bg-[#2d1f4a] transition-all">
                <Facebook className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-[#1a1428] flex items-center justify-center text-[#9ca3af] hover:text-[#a855f7] hover:bg-[#2d1f4a] transition-all">
                <MessageCircle className="w-4 h-4" />
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-[#1a1428] flex items-center justify-center text-[#9ca3af] hover:text-[#a855f7] hover:bg-[#2d1f4a] transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Link>
              <Link href="#" className="w-9 h-9 rounded-full bg-[#1a1428] flex items-center justify-center text-[#9ca3af] hover:text-[#a855f7] hover:bg-[#2d1f4a] transition-all">
                <Instagram className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Khám phá */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#f5f5f7]">Khám phá</h4>
            <ul className="space-y-2.5">
              <li><Link href="/the-loai" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Thể loại</Link></li>
              <li><Link href="/moi-cap-nhat" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Mới cập nhật</Link></li>
              <li><Link href="/hoan-thanh" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Truyện hoàn thành</Link></li>
              <li><Link href="/truyen-hot" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Truyện đang hot</Link></li>
              <li><Link href="/ngau-nhien" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Truyện ngẫu nhiên</Link></li>
            </ul>
          </div>

          {/* Hỗ trợ */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#f5f5f7]">Hỗ trợ</h4>
            <ul className="space-y-2.5">
              <li><Link href="/tro-giup" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Trung tâm trợ giúp</Link></li>
              <li><Link href="/huong-dan" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Hướng dẫn sử dụng</Link></li>
              <li><Link href="/quy-dinh" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Quy định cộng đồng</Link></li>
              <li><Link href="/bao-mat" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Chính sách bảo mật</Link></li>
              <li><Link href="/dieu-khoan" className="text-sm text-[#9ca3af] hover:text-[#a855f7] transition-colors">Điều khoản sử dụng</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#f5f5f7]">Nhận thông tin mới nhất</h4>
            <p className="text-sm text-[#9ca3af]">
              Đăng ký nhận newsletter để không bỏ lỡ truyện hay và sự kiện hấp dẫn!
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Nhập email của bạn..."
                className="flex-1 h-10 bg-[#1a1428] border-[#2d1f4a] text-[#f5f5f7] placeholder:text-[#6b7280] focus:border-[#a855f7] rounded-lg text-sm"
              />
              <Button size="icon" className="h-10 w-10 bg-gradient-to-r from-[#a855f7] to-[#ec4899] hover:opacity-90 rounded-lg shrink-0">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#2d1f4a]/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6b7280]">
            &copy; 2026 Vibe Truyện. All rights reserved.
          </p>
          <p className="text-sm text-[#6b7280] flex items-center gap-1">
            Made with <span className="text-[#ec4899]">&#9829;</span> for readers
          </p>
        </div>
      </div>
    </footer>
  )
}
