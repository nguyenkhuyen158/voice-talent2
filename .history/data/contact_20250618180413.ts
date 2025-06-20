export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface OfficeInfo {
  title: string;
  content: string;
  icon: string;
}

export interface ContactData {
  social: {
    facebook: SocialLink;
    zalo: SocialLink;
    phone: SocialLink;
    email: SocialLink;
  };
  office: {
    address: OfficeInfo;
    workingHours: OfficeInfo;
  };
}

export interface Contact {
  contact: ContactData;
}
