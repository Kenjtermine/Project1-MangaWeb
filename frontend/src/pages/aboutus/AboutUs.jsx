import { Link } from "react-router-dom";

const stats = [
  { value: "10K+", label: "Đầu truyện đa dạng thể loại" },
  { value: "24/7", label: "Cập nhật chương mới liên tục" },
  { value: "100%", label: "Tối ưu trải nghiệm đọc mượt mà" },
];

const values = [
  {
    title: "Tốc độ tải trang thần tốc",
    description:
      "Nói không với giật lag hay chờ đợi ảnh load từng dòng. Hệ thống được tối ưu để bạn có thể lướt truyện mượt mà dù dùng 4G hay Wi-Fi.",
  },
  {
    title: "Khám phá kho báu dễ dàng",
    description:
      "Hệ thống phân loại chi tiết, bảng xếp hạng cập nhật mỗi ngày và bộ lọc thông minh giúp bạn tìm thấy 'chân ái' chỉ sau vài cú click.",
  },
  {
    title: "Kết nối những tâm hồn đồng điệu",
    description:
      "Không chỉ là nơi đọc truyện, MangaWeb còn là nhà. Lưu truyện yêu thích, nhận thông báo chương mới và thỏa sức bàn luận cùng cộng đồng.",
  },
];

const features = [
  "Giao diện thân thiện, dễ sử dụng cho tất cả người dùng",
  "Bạn được trải nghiệm MangaWeb hoàn toàn miễn phí với đầy đủ các tính năng",
  "Đọc truyện mọi lúc mọi nơi, hỗ trợ đa nền tảng",
];

const AboutUs = () => {
  return (
    <div className="min-h-full bg-neutral-950 text-white">
      <section className="relative overflow-hidden bg-neutral-900 px-6 py-12 md:px-10 lg:px-12">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?auto=format&fit=crop&w=1400&q=80"
            alt="Manga collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-sky-950/50" />
        </div>

        <div className="relative z-10 max-w-5xl">
          <span className="inline-flex rounded-full border border-sky-400/40 bg-sky-500/10 px-4 py-1 text-sm font-semibold text-sky-200">
            Câu chuyện của MangaWeb
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight md:text-5xl">
            Trạm dừng chân lý tưởng cho những tín đồ đam mê Manga.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg">
            Được tạo ra bởi những người yêu truyện dành cho những người đọc truyện. Chúng tôi không chỉ cung cấp một trang web, chúng tôi mang đến một không gian đọc sạch sẽ, tập trung và hoàn toàn thuộc về bạn.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/browse"
              className="rounded bg-yellow-400 px-5 py-3 font-semibold text-neutral-950 shadow-lg transition hover:bg-yellow-300"
            >
              Khám phá ngay
            </Link>
            <Link
              to="/search"
              className="rounded border border-white/20 px-5 py-3 font-semibold text-white transition hover:border-sky-300 hover:bg-white/10"
            >
              Tìm bộ truyện yêu thích
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-6 py-8 md:grid-cols-3 md:px-10 lg:px-12">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-white/10 bg-neutral-900 p-5 shadow-lg"
          >
            <p className="text-3xl font-bold text-sky-400">{item.value}</p>
            <p className="mt-2 text-sm text-gray-300">{item.label}</p>
          </div>
        ))}
      </section>

      <section className="px-6 pb-10 md:px-10 lg:px-12">
        <div className="grid gap-6 lg:grid-cols-[1fr,1fr]">
          <div className="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Sứ mệnh của chúng tôi</h2>
            <p className="mt-4 leading-7 text-gray-300">
              Chúng tôi thấu hiểu cảm giác tuột mood khi đang cuốn vào cốt truyện thì bị quảng cáo rác che khuất, hay thao tác lướt trang giật lag. Vì thế, MangaWeb đặt trải nghiệm người dùng lên hàng đầu: Thiết kế tối giản, loại bỏ hoàn toàn sự xao nhãng để bạn có thể đắm chìm trọn vẹn vào từng khung tranh, từng thế giới tưởng tượng.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow-lg">
            <h2 className="text-2xl font-bold text-white">Chúng tôi có các tính năng nổi bật:</h2>
            <div className="mt-6 grid gap-4 sm:grid-rows-3">
              {features.map((item) => (
                <div
                  key={item}
                  className="rounded border border-sky-400/20 bg-sky-500/10 px-4 py-3 text-sm font-semibold text-sky-100 text-center"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 px-6 pb-12 md:grid-cols-3 md:px-10 lg:px-12">
        {values.map((item) => (
          <article
            key={item.title}
            className="rounded-lg border border-white/10 bg-neutral-900 p-6 shadow-lg transition hover:border-sky-400/50 hover:bg-neutral-800 cursor-default"
          >
            <h3 className="text-lg font-bold text-sky-300">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-gray-300">
              {item.description}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AboutUs;