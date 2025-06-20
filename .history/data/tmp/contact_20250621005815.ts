export type ContactData = {
  social: {
    facebook: { name: string; url: string; icon: string };
    zalo: { name: string; url: string; icon: string };
    phone: { name: string; url: string; icon: string };
    email: { name: string; url: string; icon: string };
  };
  office: {
    address: { title: string; content: string; icon: string };
    workingHours: { title: string; content: string; icon: string };
  };
};