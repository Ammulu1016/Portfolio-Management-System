from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn, os

from database import engine, get_db
import models, schemas, crud, auth

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Portfolio API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login", auto_error=False)


def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return auth.get_current_user(token, db)


# ── Auth ──────────────────────────────────────────────────────
@app.post("/auth/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = auth.create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}


# ── Public Portfolio Endpoints ────────────────────────────────
@app.get("/portfolio/profile", response_model=schemas.ProfileOut)
def get_profile(db: Session = Depends(get_db)):
    profile = crud.get_profile(db)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not set up yet")
    return profile


@app.get("/portfolio/projects", response_model=List[schemas.ProjectOut])
def list_projects(featured_only: bool = False, db: Session = Depends(get_db)):
    return crud.get_projects(db, featured_only=featured_only)


@app.get("/portfolio/projects/{project_id}", response_model=schemas.ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    p = crud.get_project(db, project_id)
    if not p:
        raise HTTPException(status_code=404, detail="Project not found")
    return p


@app.get("/portfolio/skills", response_model=List[schemas.SkillOut])
def list_skills(db: Session = Depends(get_db)):
    return crud.get_skills(db)


@app.get("/portfolio/experience", response_model=List[schemas.ExperienceOut])
def list_experience(db: Session = Depends(get_db)):
    return crud.get_experience(db)


@app.get("/portfolio/certifications", response_model=List[schemas.CertificationOut])
def list_certifications(db: Session = Depends(get_db)):
    return crud.get_certifications(db)


@app.post("/portfolio/contact")
def submit_contact(msg: schemas.ContactMessage, db: Session = Depends(get_db)):
    crud.save_contact_message(db, msg)
    # Optionally send email via SendGrid
    return {"message": "Thank you! I'll get back to you soon."}


# ── Admin Endpoints ────────────────────────────────────────────
@app.put("/admin/profile", response_model=schemas.ProfileOut)
def upsert_profile(profile: schemas.ProfileCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.upsert_profile(db, profile)


@app.post("/admin/projects", response_model=schemas.ProjectOut)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.create_project(db, project)


@app.put("/admin/projects/{project_id}", response_model=schemas.ProjectOut)
def update_project(project_id: int, project: schemas.ProjectCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.update_project(db, project_id, project)


@app.delete("/admin/projects/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    crud.delete_project(db, project_id)
    return {"message": "Project deleted"}


@app.post("/admin/skills", response_model=schemas.SkillOut)
def create_skill(skill: schemas.SkillCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.create_skill(db, skill)


@app.post("/admin/experience", response_model=schemas.ExperienceOut)
def create_experience(exp: schemas.ExperienceCreate, db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.create_experience(db, exp)


@app.get("/admin/messages", response_model=List[schemas.ContactMessageOut])
def get_messages(db: Session = Depends(get_db), admin=Depends(get_current_admin)):
    return crud.get_contact_messages(db)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
