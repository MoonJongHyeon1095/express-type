// addressDTO
interface AddressDTO { 
    patientId?: number;
    address1: string;
    address2: string;
    createdAt?: string;
  }
  
  // imageDTO
  interface ImageDTO {
    patientId?: number;
    imageUrl: string;
    imageSize: number;
    imageTxt: string;
    createdAt?: string;
  }
  
  // patientDTO
  interface PatientDTO {
    name: string;
    ssn: string;
    enssn?: string;
    birthDate: string;
    cellPhone: string;
    phone: string;
    email: string;
    createdAt?: string;
  }