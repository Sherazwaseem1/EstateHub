from fastapi import Depends, FastAPI, HTTPException, UploadFile, File, Query, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine
from pathlib import Path
import shutil
from typing import List

# Create all tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Create a new client
@app.post("/clients/", response_model=schemas.Client)
def create_client(client: schemas.ClientCreate, db: Session = Depends(get_db)):
    db_client = crud.get_client_by_email(db, email=client.ClientEmail)
    if db_client:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_client(db=db, client=client)

# Get all clients with pagination
@app.get("/clients/", response_model=list[schemas.Client])
def read_clients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    clients = crud.get_clients(db, skip=skip, limit=limit)
    if not clients:
        raise HTTPException(status_code=404, detail="Clients not found")
    return clients

# Get a client by Email
@app.get("/clients/{client_email}", response_model=schemas.Client)
def read_client_by_email(client_email: str, db: Session = Depends(get_db)):
    db_client = crud.get_client_by_email(db, email=client_email)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client

# Get client password by email
@app.get("/clients/password/{client_email}/{ClientPassword}", response_model=schemas.Client)
def read_client_password_by_email(client_email: str, ClientPassword:str, db: Session = Depends(get_db)):
    db_client_password = crud.get_client_password_by_email(db, email=client_email)
    if db_client_password is None:
        raise HTTPException(status_code=404, detail="Client not found")
    if db_client_password[0] != ClientPassword:
        raise HTTPException(status_code=404, detail="Invalid Credentials")
    db_client =  crud.get_client_by_email(db, email=client_email)
    return db_client

# Get a Client by ID
@app.get("/clients/{client_id}", response_model=schemas.Client)
def read_client_by_id(client_id: int, db: Session = Depends(get_db)):
    db_client = crud.get_client_by_id(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Client not found")
    return db_client


# Create a new office
@app.post("/offices/", response_model=schemas.Office)
def create_office(office: schemas.OfficeCreate, db: Session = Depends(get_db)):
    return crud.create_office(db=db, office=office)

# Get all offices with pagination
@app.get("/offices/", response_model=list[schemas.Office])
def read_offices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_offices(db, skip=skip, limit=limit)

# Get an office by ID
@app.get("/offices/{office_id}", response_model=schemas.Office)
def read_office(office_id: int, db: Session = Depends(get_db)):
    db_office = crud.get_office_by_id(db, office_id=office_id)
    if db_office is None:
        raise HTTPException(status_code=404, detail="Office not found")
    return db_office

# Create a new agent
@app.post("/agents/", response_model=schemas.Agent)
def create_agent(agent: schemas.AgentCreate, db: Session = Depends(get_db)):
    db_agent = crud.get_agent_by_email(db, email=agent.Email)
    if db_agent:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_agent(db=db, agent=agent)

# Get all agents with pagination
@app.get("/agents/", response_model=list[schemas.Agent])
def read_agents(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_agents(db, skip=skip, limit=limit)


# Get all agents by OfficeID
@app.get("/agents/office/{office_id}", response_model=List[schemas.Agent])
def get_agents_by_office_id(office_id: int, db: Session = Depends(get_db)):
    agents = crud.get_agents_by_office_id(db, office_id)
    if not agents:
        raise HTTPException(status_code=404, detail="No agents found for this OfficeID")
    return agents

# Get all agents by Email
@app.get("/agents/email/{email}", response_model=schemas.Agent)
def get_agent_by_email(email: str, db: Session = Depends(get_db)):
    agent = crud.get_agent_by_email(db, email)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent

# Get an agent by ID 
@app.get("/agents/{agent_id}", response_model=schemas.Agent)
def read_agent(agent_id: int, db: Session = Depends(get_db)):
    db_agent = crud.get_agent_by_id(db, agent_id=agent_id)
    if db_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return db_agent

@app.put("/agents/{agent_id}/office", response_model=schemas.Agent)
def update_agent_office(agent_id: int, update_data: schemas.UpdateAgentOffice, db: Session = Depends(get_db)):
    updated_agent = crud.update_agent_office(db, agent_id=agent_id, new_office_id=update_data.OfficeID)
    if updated_agent is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    return updated_agent

# Get agent password by email
@app.get("/agents/password/{agent_email}/{agent_password}", response_model=schemas.Agent)
def read_agent_password_by_email(agent_email: str, agent_password: str, db: Session = Depends(get_db)):
    db_agent_password = crud.get_agent_password_by_email(db, email=agent_email)
    if db_agent_password is None:
        raise HTTPException(status_code=404, detail="Agent not found")
    if db_agent_password[0] != agent_password:
        raise HTTPException(status_code=404, detail="Invalid Credentials")
    db_agent = crud.get_agent_by_email(db, email=agent_email)
    return db_agent


# Create a new property
@app.post("/properties/", response_model=schemas.Property)
def create_property(property: schemas.PropertyCreate, db: Session = Depends(get_db)):
    return crud.create_property(db=db, property=property)

# Get all properties with pagination
@app.get("/properties/", response_model=list[schemas.Property])
def read_properties(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_properties(db, skip=skip, limit=limit)

# Get a property by ID
@app.get("/properties/{property_id}", response_model=schemas.Property)
def read_property(property_id: int, db: Session = Depends(get_db)):
    db_property = crud.get_property_by_id(db, property_id=property_id)
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return db_property

# Create a new transaction
@app.post("/transactions/", response_model=schemas.Transaction)
def create_transaction(transaction: schemas.TransactionCreate, db: Session = Depends(get_db)):

    return crud.create_transaction(db=db, transaction=transaction)

# Get all transactions with pagination
@app.get("/transactions/", response_model=list[schemas.Transaction])
def read_transactions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_transactions(db, skip=skip, limit=limit)

# Get a transaction by ID
@app.get("/transactions/{transaction_id}", response_model=schemas.Transaction)
def read_transaction(transaction_id: int, db: Session = Depends(get_db)):

    db_transaction = crud.get_transaction_by_id(db, transaction_id=transaction_id)
    if db_transaction is None:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return db_transaction

# Get transaction by Property ID
@app.get("/transactions/property/{property_id}", response_model=list[schemas.Transaction])
def read_transaction_by_Propid(property_id: int, db: Session = Depends(get_db)):
    transaction = crud.get_transaction_by_Propertyid(db, property_id=property_id)
    
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return transaction

@app.post("/images/", response_model=schemas.Image)
def create_image(
    PropertyID: int = Form(...),
    ImageURL: str = Form(...),
    db: Session = Depends(get_db)
):
    # Convert PropertyID to integer if necessary (Form should handle this)
    prop = int(PropertyID)
    image_data = schemas.ImageCreate(PropertyID=prop, ImageURL=ImageURL)
    return crud.create_image(db=db, image=image_data)

# Get all images with pagination
@app.get("/images/", response_model=list[schemas.Image])
def read_images(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_images(db, skip=skip, limit=limit)

# Endpoint to get all images by PropertyID
@app.get("/properties/{property_id}/images", response_model=List[schemas.Image])
def get_images_for_property(property_id: int, db: Session = Depends(get_db)):
    images = crud.get_images_by_property_id(db, property_id)
    if not images:
        raise HTTPException(status_code=404, detail="Images not found")
    return images

# Get an image by ID
@app.get("/images/{image_id}", response_model=schemas.Image)
def read_image(image_id: int, db: Session = Depends(get_db)):
    db_image = crud.get_image_by_id(db, image_id=image_id)
    if db_image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return db_image

@app.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    property_ID: int = Query(..., description="ID of the property")
):
    try:
        # Define base path and new folder
        base_path = Path("Property_Images")
        new_folder = base_path / f"Property_{property_ID}"

        # Ensure the folder exists and save the file
        return_value = await crud.create_folder_and_save_file(file, new_folder)

        return {"filename": file.filename, "message": return_value}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {e}")


@app.post("/search/", response_model=List[schemas.Property])
def search_properties(search_params: schemas.PropertySearch, db: Session = Depends(get_db)):
    properties = crud.search_properties(db, search_params)
    if not properties:
        raise HTTPException(status_code=404, detail="No properties found")

    return properties