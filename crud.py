from sqlalchemy.orm import Session
from fastapi import HTTPException
import models, schemas


def get_profile(db: Session):
    return db.query(models.Profile).first()


def upsert_profile(db: Session, profile: schemas.ProfileCreate):
    existing = get_profile(db)
    if existing:
        for k, v in profile.dict().items():
            setattr(existing, k, v)
        db.commit()
        db.refresh(existing)
        return existing
    obj = models.Profile(**profile.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_projects(db: Session, featured_only: bool = False):
    q = db.query(models.Project)
    if featured_only:
        q = q.filter(models.Project.is_featured == True)
    return q.order_by(models.Project.order_index).all()


def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()


def create_project(db: Session, project: schemas.ProjectCreate):
    obj = models.Project(**project.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def update_project(db: Session, project_id: int, project: schemas.ProjectCreate):
    obj = get_project(db, project_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Project not found")
    for k, v in project.dict().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj


def delete_project(db: Session, project_id: int):
    obj = get_project(db, project_id)
    if obj:
        db.delete(obj)
        db.commit()


def get_skills(db: Session):
    return db.query(models.Skill).all()


def create_skill(db: Session, skill: schemas.SkillCreate):
    obj = models.Skill(**skill.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_experience(db: Session):
    return db.query(models.Experience).order_by(models.Experience.is_current.desc()).all()


def create_experience(db: Session, exp: schemas.ExperienceCreate):
    obj = models.Experience(**exp.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def get_certifications(db: Session):
    return db.query(models.Certification).all()


def save_contact_message(db: Session, msg: schemas.ContactMessage):
    obj = models.ContactMessage(**msg.dict())
    db.add(obj)
    db.commit()


def get_contact_messages(db: Session):
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
