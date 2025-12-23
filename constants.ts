
import { UnitData, NLSMapping } from './types';

export const GLOBAL_SUCCESS_DB: Record<string, UnitData[]> = {
  "6": [
    { id: 1, name: "Unit 1: My New School" },
    { id: 2, name: "Unit 2: My House" },
    { id: 3, name: "Unit 3: My Friends" },
    { id: 4, name: "Unit 4: My Neighbourhood" },
    { id: 5, name: "Unit 5: Natural Wonders of Viet Nam" },
    { id: 6, name: "Unit 6: Our Tet Holiday" },
    { id: 7, name: "Unit 7: Television" },
    { id: 8, name: "Unit 8: Sports and Games" },
    { id: 9, name: "Unit 9: Cities of the World" },
    { id: 10, name: "Unit 10: Our Houses in the Future" },
    { id: 11, name: "Unit 11: Our Greener World" },
    { id: 12, name: "Unit 12: Robots" },
  ],
  "7": [
    { id: 1, name: "Unit 1: Hobbies" },
    { id: 2, name: "Unit 2: Healthy Living" },
    { id: 3, name: "Unit 3: Community Service" },
    { id: 4, name: "Unit 4: Music and Arts" },
    { id: 5, name: "Unit 5: Food and Drink" },
    { id: 6, name: "Unit 6: A Visit to School" },
    { id: 7, name: "Unit 7: Traffic" },
    { id: 8, name: "Unit 8: Films" },
    { id: 9, name: "Unit 9: Festivals around the World" },
    { id: 10, name: "Unit 10: Energy Sources" },
    { id: 11, name: "Unit 11: Travelling in the Future" },
    { id: 12, name: "Unit 12: English-speaking Countries" },
  ],
  "8": [
    { id: 1, name: "Unit 1: Leisure Time" },
    { id: 2, name: "Unit 2: Life in the Countryside" },
    { id: 3, name: "Unit 3: Teenagers" },
    { id: 4, name: "Unit 4: Ethnic Groups of Viet Nam" },
    { id: 5, name: "Unit 5: Our Customs and Traditions" },
    { id: 6, name: "Unit 6: Lifestyles" },
    { id: 7, name: "Unit 7: Environmental Protection" },
    { id: 8, name: "Unit 8: Shopping" },
    { id: 9, name: "Unit 9: Natural Disasters" },
    { id: 10, name: "Unit 10: Communication in the Future" },
    { id: 11, name: "Unit 11: Science and Technology" },
    { id: 12, name: "Unit 12: Life on Other Planets" },
  ],
  "9": [
    { id: 1, name: "Unit 1: Local Community" },
    { id: 2, name: "Unit 2: City Life" },
    { id: 3, name: "Unit 3: Teen Stress and Pressure" },
    { id: 4, name: "Unit 4: Life in the Past" },
    { id: 5, name: "Unit 5: Wonders of Viet Nam" },
    { id: 6, name: "Unit 6: Viet Nam: Then and Now" },
    { id: 7, name: "Unit 7: Recipes and Eating Habits" },
    { id: 8, name: "Unit 8: Tourism" },
    { id: 9, name: "Unit 9: English in the World" },
    { id: 10, name: "Unit 10: Space Travel" },
    { id: 11, name: "Unit 11: Changing Roles in Society" },
    { id: 12, name: "Unit 12: My Future Career" },
  ]
};

export const USER_NLS_MAPPING: Record<string, Record<string, NLSMapping>> = {
  "6": {
    "Unit 1": { code: "TC 1.1.a", activity: "HS xác định được các từ khóa (keywords) như 'British schools', 'school activities' để tìm kiếm hình ảnh và thông tin cơ bản trên Google, phục vụ việc thiết kế poster về ngôi trường mơ ước." },
    "Unit 2": { code: "TC 2.1.b", activity: "HS sử dụng Padlet để đăng tải mô tả ngắn về phòng ngủ của mình bằng tiếng Anh và phản hồi (comment) lịch sự bằng icon hoặc từ vựng đơn giản vào bài làm của bạn cùng lớp." },
    "Unit 6": { code: "TC 1.2.b", activity: "HS biết cách kiểm tra thông tin về các phong tục Tết ở các nước châu Á từ ít nhất 2 nguồn web khác nhau để xác nhận tính chính xác trước khi thuyết trình nhóm." }
  },
  "7": {
    "Unit 1": { code: "TC 3.1.a", activity: "HS sử dụng ứng dụng Canva hoặc PowerPoint để thiết kế một sơ đồ tư duy (mind map) giới thiệu về sở thích cá nhân, biết cách chèn và điều chỉnh kích thước hình ảnh minh họa phù hợp." },
    "Unit 3": { code: "TC 2.2.c", activity: "HS thực hiện soạn thảo một email ngắn gửi cho tổ chức tình nguyện bằng Google Docs và biết cách sử dụng tính năng 'Share' để mời bạn cùng nhóm vào chỉnh sửa bài viết chung." },
    "Unit 8": { code: "TC 4.1.a", activity: "HS biết cách tạo mật khẩu đơn giản nhưng an toàn khi đăng ký tài khoản trên các nền tảng học tập trực tuyến (như Quizizz/Kahoot) để tham gia trò chơi ôn tập về từ vựng điện ảnh." }
  },
  "8": {
    "Unit 2": { code: "TC 3.1.c", activity: "HS biên tập một video ngắn (vlog) giới thiệu về cảnh đẹp quê hương, biết cách cắt ghép clip, chèn phụ đề tiếng Anh và nhạc nền không vi phạm bản quyền trên ứng dụng CapCut." },
    "Unit 4": { code: "TC 1.3.a", activity: "HS biết cách tạo các thư mục trên Google Drive theo tên từng dân tộc để lưu trữ, sắp xếp các tài liệu, hình ảnh thu thập được một cách khoa học, dễ tìm kiếm." },
    "Unit 10": { code: "TC 4.2.b", activity: "HS tham gia thảo luận về các quy tắc ứng xử trên mạng (Netiquette), biết cách nhận diện và từ chối nhấn vào các đường link lạ có nguy cơ chứa mã độc khi trao đổi bài học qua mạng xã hội." }
  },
  "9": {
    "Unit 1": { code: "TC 2.1.c", activity: "HS sử dụng các tính năng nâng cao trên phần mềm họp trực tuyến (giơ tay, chia phòng nhóm - breakout rooms) để thảo luận về các vấn đề môi trường tại địa phương và ghi lại biên bản cuộc họp bằng file Word chung." },
    "Unit 5": { code: "TC 1.2.c", activity: "HS phân tích và đối chiếu các đánh giá (reviews) về một kỳ quan trên các trang du lịch khác nhau (TripAdvisor, Booking) để chọn lọc thông tin khách quan nhất cho bài thuyết trình." },
    "Unit 11": { code: "TC 5.2.a", activity: "HS tự giải quyết được các lỗi kỹ thuật thông thường khi nộp bài tập về nhà trên hệ thống LMS (như lỗi định dạng file .docx, .pdf hoặc lỗi đường truyền internet bằng cách thử lại hoặc chuyển đổi định dạng)." }
  }
};

export const LESSON_TYPES = [
  "Getting Started", 
  "A Closer Look 1", 
  "A Closer Look 2", 
  "Communication", 
  "Skills 1", 
  "Skills 2", 
  "Looking Back & Project"
];
