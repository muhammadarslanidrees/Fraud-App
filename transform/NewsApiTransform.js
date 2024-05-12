import { generateImageUrl } from "../utils/helper.js";

export class NewsApiTransform {
  static transform(news) {
    return {
      id: news.id,
      heading: news.title,
      content: news.content,
      image: generateImageUrl(news.image),
      user: {
        id: news?.user.id,
        name: news?.user.name,
        email: news?.user.email,
        image:
          news?.user?.image != null
            ? generateImageUrl(news?.user?.image)
            : generateImageUrl("js.png"),
      },
      created_at: news.created_at,
    };
  }
}
