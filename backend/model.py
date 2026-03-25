from pydantic import BaseModel,EmailStr
from typing import Optional,List

class Trainer(BaseModel):
    name: str
    skill: str
    email: Optional[EmailStr] = None
    phone: Optional[str] = ""
    qualification: Optional[str] = ""
    location: str
    exp: str = "Select experience"
    trained: int = 0
    courses: int = 0
    status: str = "Active"
    rating: Optional[float] = 4.5
    adminEmail: str
    
    
    
class Courses(BaseModel):
    name: str
    category: Optional[str] = "IT & Software"
    duration: str
    fees: str
    trainer: Optional[str] = ""
    status: str = "Active"
    startDate: Optional[str] = ""
    description: Optional[str] = ""
    syllabus: List[str] = []
    outcomes: List[str] = []
    enrolled: Optional[int] = 0
    adminEmail: str

    
class Placement(BaseModel):
    startupName: str
    legalStatus: str
    dateOfEstablishment: str
    primarySector: str
    secondarySector: str
    companyPAN: str
    gstin: str
    currentTeamSize: str
    maleCount: str
    femaleCount: str
    companyWebsite: str
    numberOfBranches: str   
    


class Certificate(BaseModel):
   
    studentName: str
    course: str
    completionDate: str
    issuedDate: Optional[str] = "-"
    grade: Optional[str] = "-"
    score: Optional[int] = None
    status: str = "Pending"
    adminEmail: str


class BranchAddress(BaseModel):
    fullAddress: Optional[str] = ""
    country: Optional[str] = ""
    state: Optional[str] = ""
    district: Optional[str] = ""
    city: Optional[str] = ""
    area: Optional[str] = ""
    pinCode: Optional[str] = ""
    isPrimary: Optional[bool] = False



class StartupApplication(BaseModel):

    # ---------- Personal ----------
    firstName: Optional[str] = ""
    lastName: Optional[str] = ""
    email: EmailStr
    dateOfBirth: Optional[str] = ""
    gender: Optional[str] = ""

    phoneCountry: Optional[str] = "India"
    phoneCode: Optional[str] = ""
    phone: Optional[str] = ""

    # ---------- Online ----------
    linkedin: Optional[str] = ""
    website: Optional[str] = ""

    # ---------- Company ----------
    designation: Optional[str] = ""
    cin: Optional[str] = ""
    instituteName: Optional[str] = ""
    legalStatus: Optional[str] = ""
    dateOfEstablishment: Optional[str] = ""
    primarySector: Optional[str] = ""
    secondarySector: Optional[str] = ""
    companyPAN: Optional[str] = ""
    gstin: Optional[str] = ""
    companyWebsite: Optional[str] = ""
    numberOfBranches: Optional[int] = 1

    # ---------- Address ----------
    branchAddresses: List[BranchAddress] = []

    # ---------- Team ----------
    currentTeamSize: Optional[int] = 0
    maleCount: Optional[int] = 0
    femaleCount: Optional[int] = 0

    # ---------- Founder ----------
    founderFirstName: Optional[str] = ""
    founderLastName: Optional[str] = ""
    founderEmail: Optional[EmailStr] = None

    founderPhoneCountry: Optional[str] = "India"
    founderPhoneCode: Optional[str] = ""
    founderPhone: Optional[str] = ""

    founderDOB: Optional[str] = ""
    founderGender: Optional[str] = ""
    founderLinkedIn: Optional[str] = ""
    founderFacebook: Optional[str] = ""

    # ---------- Support ----------
    fundingNeeded: Optional[str] = ""
    mentorshipNeeded: Optional[str] = ""
    technologySupport: Optional[str] = ""
    incubationSpace: Optional[str] = ""
    registrationNeeded: Optional[str] = ""
    supportInterest: Optional[str] = ""
    governmentSchemes: Optional[str] = ""

    # ---------- Opportunities ----------
    placementOffered: Optional[str] = ""
    placementType: Optional[str] = ""
    internshipOffered: Optional[str] = ""
    internshipType: Optional[str] = ""
    trainingOffered: Optional[str] = ""
    trainingType: List[str] = []
    fypOffered: Optional[str] = ""
class Ads(BaseModel):
    title: str
    description: str
    image: str
    button: Optional[str] = "Learn More"
    link: Optional[str] = ""
    page: str
    adminEmail: str

    





