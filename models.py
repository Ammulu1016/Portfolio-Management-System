from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base


class AdminUser(Base):
    __tablename__ = "admin_users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))


class Profile(Base):
    __tablename__ = "profile"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    title = Column(String(200))
    bio = Column(Text)
    email = Column(String(100))
    phone = Column(String(30), nullable=True)
    location = Column(String(100), nullable=True)
    github_url = Column(String(300), nullable=True)
    linkedin_url = Column(String(300), nullable=True)
    resume_url = Column(String(300), nullable=True)
    avatar_url = Column(String(500), nullable=True)


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200))
    description = Column(Text)
    tech_stack = Column(String(500))   # comma-separated
    github_url = Column(String(300), nullable=True)
    live_url = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Skill(Base):
    __tablename__ = "skills"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    category = Column(String(100))   # Frontend, Backend, Database, DevOps, etc.
    proficiency = Column(Integer, default=80)  # 0-100


class Experience(Base):
    __tablename__ = "experience"
    id = Column(Integer, primary_key=True, index=True)
    company = Column(String(200))
    role = Column(String(200))
    duration = Column(String(100))  # e.g. "Jan 2022 – Present"
    description = Column(Text)
    is_current = Column(Boolean, default=False)


class Certification(Base):
    __tablename__ = "certifications"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200))
    issuer = Column(String(200))
    issued_date = Column(String(50))
    credential_url = Column(String(300), nullable=True)


class ContactMessage(Base):
    __tablename__ = "contact_messages"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(100))
    subject = Column(String(200))
    message = Column(Text)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
