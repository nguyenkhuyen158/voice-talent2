export interface HeroData {
  photo: string;
  title: {
    line1: string;
    line2: string;
  };
  description: string;
  buttons: {
    demo: {
      text: string;
      icon: string;
    };
    contact: {
      text: string;
      icon: string;
    };
  };
}
