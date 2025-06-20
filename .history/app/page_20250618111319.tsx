import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 p-6">
      <header className="flex flex-col items-center gap-4 mt-8">
        <Image
          src="/file.svg"
          alt="Voice Talent Logo"
          width={80}
          height={80}
          className="rounded-full shadow-lg bg-white"
        />
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 text-center">
          Tôi là Voice Talent
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 text-center max-w-2xl mt-2">
          Chào mừng bạn đến với trang cá nhân của tôi! Tôi là một voice talent
          chuyên nghiệp với kinh nghiệm lồng tiếng quảng cáo, video, radio, TVC,
          thuyết minh, và nhiều lĩnh vực khác. Giọng đọc truyền cảm, đa dạng
          phong cách, phù hợp với nhiều dự án.
        </p>
      </header>
      <main className="flex flex-col items-center gap-8 mt-12 w-full max-w-3xl">
        <section className="bg-white/80 rounded-xl shadow-lg p-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2 text-blue-700">
            Dịch vụ của tôi
          </h2>
          <ul className="list-disc list-inside text-gray-800 text-left space-y-1">
            <li>Lồng tiếng quảng cáo (TV, Radio, Online)</li>
            <li>Thuyết minh video, phim, tài liệu</li>
            <li>Đọc sách nói, truyện audio</li>
            <li>IVR, tổng đài, hướng dẫn tự động</li>
            <li>
              Giọng đọc đa dạng: trẻ trung, truyền cảm, nghiêm túc, hài hước...
            </li>
          </ul>
        </section>
        <section className="bg-white/80 rounded-xl shadow-lg p-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2 text-pink-700">
            Demo giọng đọc
          </h2>
          <audio controls className="w-full max-w-md mt-2">
            <source src="/demo-voice.mp3" type="audio/mpeg" />
            Trình duyệt của bạn không hỗ trợ audio.
          </audio>
        </section>
        <section className="bg-white/80 rounded-xl shadow-lg p-6 w-full flex flex-col items-center">
          <h2 className="text-2xl font-semibold mb-2 text-green-700">
            Liên hệ hợp tác
          </h2>
          <p className="text-gray-700 mb-2">
            Bạn cần giọng đọc chuyên nghiệp cho dự án của mình? Hãy liên hệ với tôi:
          </p>
          <a
            href="mailto:your.email@example.com"
            className="text-blue-600 underline font-medium"
          >
            your.email@example.com
          </a>
          <span className="text-gray-500 mt-1">Hoặc Zalo: 0123 456 789</span>
        </section>
      </main>
      <footer className="mt-12 mb-4 text-gray-500 text-sm text-center">
        © {new Date().getFullYear()} Voice Talent | Thiết kế bởi tôi
      </footer>
    </div>
  );
}
