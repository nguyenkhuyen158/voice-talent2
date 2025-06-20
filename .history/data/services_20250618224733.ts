export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;  // URL của icon
  features: string[];  // Các tính năng của dịch vụ
}

export interface ServicesData {
  services: Service[];
}
