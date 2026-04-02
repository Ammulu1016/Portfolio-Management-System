from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class Token(BaseModel):
    access_token: str
    token_type: str


class ProfileCreate(BaseModel):
    name: str
    title: str
    bio: str
    email: str
    phone: Optional[str] = None
    location: Optional[str] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    resume_url: Optional[str] = None
    avatar_url: Optional[str] = None


class ProfileOut(ProfileCreate):
    id: int
    class Config:
        from_attributes = True


class ProjectCreate(BaseModel):
    title: str
    description: str
    tech_stack: str
    github_url: Optional[str] = None
    live_url: Optional[str] = None
    image_url: Optional[str] = None
    is_featured: bool = False
    order_index: int = 0


class ProjectOut(ProjectCreate):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True


class SkillCreate(BaseModel):
    name: str
    category: str
    proficiency: int = 80


class SkillOut(SkillCreate):
    id: int
    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    company: str
    role: str
    duration: str
    description: str
    is_current: bool = False


class ExperienceOut(ExperienceCreate):
    id: int
    class Config:
        from_attributes = True


class CertificationCreate(BaseModel):
    name: str
    issuer: str
    issued_date: str
    credential_url: Optional[str] = None


class CertificationOut(CertificationCreate):
    id: int
    class Config:
        from_attributes = True


class ContactMessage(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str


class ContactMessageOut(ContactMessage):
    id: int
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True
