// addressDTO
interface AddressDTO { 
    migrantId?: number;
    address1: string;
    address2: string;
    createdAt?: string;
  }
  
  // imageDTO
  interface ImageDTO {
    migrantId?: number;
    imageUrl: string;
    imageTxt: string;
    createdAt?: string;
  }
  
  // patientDTO
  interface MigrantDTO {
    name: string;
    ssn: string;
    enssn?: string;
    phone: string;
    createdAt?: string;
  }