export interface EventDataInterface {
  id: string;
  category: string;
  coverUrl: string;
  theme: {
    imgUrl: string;
    primary: string;
    secondary: string;
  };
  event: {
    title: string;
    startDate: string;
    location: string;
    description: string;
    images: string[];
  };
  about: {
    videoUrl: string;
    imgUrl: string;
    description: string;
  };
  partners: {
    title: string;
    subtitle: string;
    logos: string[];
  };
  whySign: {
    title: string;
    subtitle: string;
    debates: {
      title: string;
      subtitle: string;
      imgUrl: string;
    }[];
  };
  speakers: {
    title: string;
    subtitle: string;
    speakers: {
      fullname: string;
      jobTitle: string;
      imgUrl: string;
    }[];
  };
  sponsors: {
    title: string;
    subtitle: string;
    logos: string[];
  };
  tickets: {
    id: string;
    ticketName: string;
    benefits: string[];
    price: number;
  }[];
  location: {
    title: string;
    subtitle: string;
    images: string[];
    address: string;
    phone: string;
    email: string;
  };
  faqs: {
    imgUrl: string;
    questions: {
      question: string;
      answer: string;
    }[];
  };
}
