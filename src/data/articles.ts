export interface Author {
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  instagram?: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  readTime: string;
  author: Author;
  tags: string[];
  content?: string; // We'll use components for the actual content rendering in the Post view, but this could hold markdown
}

export const defaultAuthor: Author = {
  name: "Blogger",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  bio: "Ghi lại những khoảnh khắc tĩnh lặng giữa nhịp sống ồn ã. Nhật ký về du lịch, nhiếp ảnh và việc tìm kiếm ý nghĩa trong cuộc sống thường nhật.",
  twitter: "@blogger",
  instagram: "@blogger.captures"
};

export const articles: Article[] = [
  {
    id: "1",
    slug: "the-art-of-slow-travel",
    title: "Nghệ thuật du lịch chậm: Tìm kiếm ý nghĩa trong những khoảnh khắc chuyển giao",
    excerpt: "Tại sao việc vội vã chạy từ danh lam này sang thắng cảnh khác đang làm mất đi khả năng thực sự trải nghiệm thế giới xung quanh ta.",
    coverImage: "https://picsum.photos/seed/slowtravel/1600/900",
    date: "12 tháng 10, 2023",
    readTime: "8 phút đọc",
    author: defaultAuthor,
    tags: ["Du lịch", "Chánh niệm", "Nhiếp ảnh"],
    content: `# Nghệ thuật du lịch chậm: Tìm kiếm ý nghĩa trong những khoảnh khắc chuyển giao

Du lịch ngày nay đã trở thành một cuộc chạy đua tích lũy những dấu mộc trên hộ chiếu hoặc những bức ảnh check-in tại các địa điểm nổi tiếng. Chúng ta vội vã từ bảo tàng này sang ngôi đền khác, chụp vội một tấm hình rồi lại lên xe đến điểm tiếp theo. Nhưng liệu chúng ta có thực sự *ở đó*?

## Sức hút của những khoảnh khắc "ở giữa"

Nghệ thuật du lịch chậm không nằm ở việc bạn đi được bao xa hay bao nhiêu nơi, mà ở cách bạn kết nối sâu sắc với từng điểm đến. Đó là những buổi chiều ngồi lặng im ngắm nhìn nhịp sống của người dân bản địa, là việc lạc lối trong những con hẻm nhỏ không có trên bản đồ, hay đơn giản là thưởng thức một tách cà phê thơm nồng trong một quán quen ven đường.

### Làm thế nào để thực hành du lịch chậm?

1. **Giảm bớt lịch trình:** Thay vì lên kế hoạch chi tiết cho từng giờ, hãy để lại những khoảng trống lớn trong ngày để khám phá tự do.
2. **Ưu tiên chất lượng hơn số lượng:** Dành thời gian ở một nơi lâu hơn thay vì di chuyển liên tục.
3. **Kết nối với người bản địa:** Trò chuyện với họ, thử những món ăn địa phương trong các quán ăn nhỏ bình dân.

Khi bước chậm lại, thế giới xung quanh bạn sẽ mở ra một cách sống động và đầy ý nghĩa hơn bao giờ hết.`
  },
  {
    id: "2",
    slug: "analog-photography-digital-age",
    title: "Đón nhận ảnh phim Analog giữa kỷ nguyên số cực độ",
    excerpt: "Có một sự bình yên sâu sắc từ tiếng màn trập cơ học tách tách và sự hồi hộp mong đợi khi tráng phim.",
    coverImage: "https://picsum.photos/seed/analog/1600/900",
    date: "28 tháng 9, 2023",
    readTime: "5 phút đọc",
    author: defaultAuthor,
    tags: ["Nhiếp ảnh", "Văn hóa"],
    content: `# Đón nhận ảnh phim Analog giữa kỷ nguyên số cực độ

Trong một thế giới nơi chúng ta có thể chụp hàng nghìn bức ảnh chỉ bằng một cái chạm màn hình điện thoại, ảnh phim analog đang có một sự trở lại vô cùng mạnh mẽ. Tại sao giữa thời đại công nghệ số tiện lợi, nhiều người vẫn lựa chọn sự chậm chạp và phức tạp của những cuộn phim?

## Sự bình yên từ tiếng màn trập cơ học

Chụp ảnh phim đòi hỏi một sự tập trung cao độ và tính kiên nhẫn tối đa. Bạn chỉ có 24 hoặc 36 kiểu ảnh trong một cuộn phim. Mỗi khi nhấn nút chụp, bạn phải cân nhắc kỹ lưỡng về ánh sáng, bố cục và cảm xúc của nhân vật. Tiếng "tách" giòn giã của màn trập cơ học mang lại một cảm giác vô cùng chân thực và thỏa mãn.

### Sự kỳ diệu của phòng tối

Không giống như máy ảnh số có thể xem lại kết quả ngay lập tức, với ảnh phim, bạn phải đợi cho đến khi cuộn phim được tráng xong. Khoảnh khắc nhìn thấy hình ảnh dần hiện lên trên tấm giấy ảnh trong phòng tối là một trải nghiệm kỳ diệu đầy xúc cảm mà không một phần mềm kỹ thuật số nào có thể thay thế được.`
  },
  {
    id: "3",
    slug: "morning-rituals",
    title: "Nghi thức buổi sáng thực sự hiệu quả",
    excerpt: "Vượt ra ngoài trào lưu thức dậy lúc 5 giờ sáng: tìm kiếm một thói quen buổi sáng tôn trọng nhịp sinh học tự nhiên của bạn thay vì chống lại nó.",
    coverImage: "https://picsum.photos/seed/morning/1600/900",
    date: "15 tháng 9, 2023",
    readTime: "6 phút đọc",
    author: defaultAuthor,
    tags: ["Phong cách sống", "Sức khỏe"],
    content: `# Nghi thức buổi sáng thực sự hiệu quả

Trào lưu "Câu lạc bộ 5 giờ sáng" đang được lan truyền rộng rãi như chiếc chìa khóa vạn năng dẫn đến thành công. Tuy nhiên, việc ép buộc bản thân thức dậy quá sớm khi cơ thể chưa sẵn sàng đôi khi phản tác dụng, dẫn đến sự mệt mỏi kéo dài suốt cả ngày.

## Tôn trọng nhịp sinh học của chính bạn

Một nghi thức buổi sáng thực sự hiệu quả không đo bằng việc bạn dậy sớm thế nào, mà bằng việc bạn bắt đầu ngày mới bình yên ra sao. Hãy xây dựng một thói quen buổi sáng dựa trên nhu cầu thực tế của bản thân:

- **Dành 10 phút tĩnh tâm:** Hít thở sâu hoặc thiền nhẹ trước khi kiểm tra điện thoại.
- **Vận động nhẹ nhàng:** Một vài động tác giãn cơ yoga hoặc đi bộ ngắn.
- **Thưởng thức bữa sáng lành mạnh:** Cung cấp năng lượng cho cả ngày dài hoạt động.

Hãy lắng nghe cơ thể của bạn và tạo ra một khởi đầu ngày mới tràn đầy cảm hứng nhất.`
  },
  {
    id: "4",
    slug: "architecture-of-silence",
    title: "Kiến trúc của sự tĩnh lặng",
    excerpt: "Khám phá những không gian được thiết kế đặc biệt để nuôi dưỡng sự yên tĩnh và suy tư trong các thành phố hiện đại.",
    coverImage: "https://picsum.photos/seed/silence/1600/900",
    date: "30 tháng 8, 2023",
    readTime: "10 phút đọc",
    author: defaultAuthor,
    tags: ["Thiết kế", "Kiến trúc", "Tản văn"],
    content: `# Kiến trúc của sự tĩnh lặng

Giữa những đô thị hiện đại sầm uất và đầy tiếng ồn, nhu cầu tìm kiếm một khoảng lặng trở nên cấp thiết hơn bao giờ hết. Các kiến trúc sư trên khắp thế giới đang nỗ lực thiết kế những không gian tĩnh lặng—nơi con người có thể tìm về với sự yên bình sâu thẳm trong tâm hồn.

## Những ngôn ngữ thiết kế của sự yên tĩnh

Kiến trúc tĩnh lặng không chỉ là việc cách âm, mà là việc tạo ra một không gian có sự giao thoa hài hòa giữa ánh sáng, bóng tối, vật liệu tự nhiên và nước:

- **Sử dụng bê tông trần và gỗ tự nhiên:** Tạo cảm giác mộc mạc, gần gũi và bền vững.
- **Điều phối ánh sáng tự nhiên:** Ánh sáng len lỏi qua khe cửa tạo nên những vệt nắng lung linh đầy tính nghệ thuật.
- **Sự xuất hiện của nước:** Tiếng nước chảy róc rách xoa dịu tâm trí và xua tan những căng thẳng thường nhật.

Những không gian này như một nốt lặng tuyệt đẹp trong bản nhạc ồn ào của phố thị, nhắc nhở chúng ta về giá trị của sự tĩnh lặng.`
  },
  {
    id: "5",
    slug: "taste-of-memory",
    title: "Hương vị của ký ức",
    excerpt: "Làm thế nào một bát nước dùng đơn giản có thể đưa tôi trở lại một buổi chiều mưa ở Kyoto.",
    coverImage: "https://picsum.photos/seed/memory/1600/900",
    date: "12 tháng 8, 2023",
    readTime: "4 phút đọc",
    author: defaultAuthor,
    tags: ["Ẩm thực", "Hồi ký"],
    content: `# Hương vị của ký ức

Khứu giác và vị giác là những giác quan kỳ diệu nhất để kết nối chúng ta với quá khứ. Đôi khi, chỉ một mùi hương hay một hương vị quen thuộc cũng đủ để đánh thức những ký ức tưởng chừng đã ngủ quên từ rất lâu.

## Bát nước dùng dashi bên hiên nhà cũ

Tôi nhớ mãi một buổi chiều mưa tầm tã tại một quán ăn nhỏ nép mình trong con hẻm cổ kính tại Kyoto. Tôi gọi một bát mì udon giản đơn. Khi hớp ngụm nước dùng dashi thanh ngọt, ấm nóng, lòng tôi bỗng chốc ngập tràn một cảm giác bình yên khó tả. 

Hương vị ấy, làn khói ấy đã lưu giữ toàn bộ không gian ấm cúng của quán ăn ngày hôm đó, tiếng mưa rơi đềun đặn trên mái hiên và cả sự hiếu khách mộc mạc của người chủ quán già. Ẩm thực không chỉ để thưởng thức, nó là chiếc hộp thời gian lưu trữ những kỷ niệm đẹp đẽ nhất trong cuộc đời mỗi chúng ta.`
  }
];
