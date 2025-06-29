from sqlalchemy.orm import Session
from . import models, schemas

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.ClientID == client_id).first()

def get_client_by_email(db: Session, email: str):
    return db.query(models.Client).filter(models.Client.ClientEmail == email).first()

def get_clients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Client).offset(skip).limit(limit).all()

def create_client(db: Session, client: schemas.ClientCreate):
    db_client = models.Client(
        ClientName=client.ClientName,
        ClientEmail=client.ClientEmail,
        ClientPhone=client.ClientPhone,
        ClientPassword=client.ClientPassword
    )
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def get_office(db: Session, office_id: int):
    return db.query(models.Office).filter(models.Office.OfficeID == office_id).first()

def get_offices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Office).offset(skip).limit(limit).all()

def create_office(db: Session, office: schemas.OfficeCreate):
    db_office = models.Office(
        OfficeName=office.OfficeName,
        Address=office.Address,
        City=office.City,
        Province=office.Province,
        ZipCode=office.ZipCode,
        PhoneNumber=office.PhoneNumber
    )
    db.add(db_office)
    db.commit()
    db.refresh(db_office)
    return db_office

def get_agent(db: Session, agent_id: int):
    return db.query(models.Agent).filter(models.Agent.AgentID == agent_id).first()

def get_agents(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Agent).offset(skip).limit(limit).all()

def create_agent(db: Session, agent: schemas.AgentCreate):
    db_agent = models.Agent(
        OfficeID=agent.OfficeID,
        PhoneNumber=agent.PhoneNumber,
        Email=agent.Email,
        Password=agent.Password,
        Name=agent.Name
    )
    db.add(db_agent)
    db.commit()
    db.refresh(db_agent)
    return db_agent

def get_property(db: Session, property_id: int):
    return db.query(models.Property).filter(models.Property.PropertyID == property_id).first()

def get_properties(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Property).offset(skip).limit(limit).all()

def create_property(db: Session, property: schemas.PropertyCreate):
    db_property = models.Property(
        AgentID=property.AgentID,
        City=property.City,
        Province=property.Province,
        ZipCode=property.ZipCode,
        Price=property.Price,
        Size=property.Size,
        NoOfBedRoom=property.NoOfBedRoom,
        Status=property.Status,
    )
