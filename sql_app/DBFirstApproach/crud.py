from sqlalchemy.orm import Session
from sqlalchemy import text
from . import schemas
from pathlib import Path
import shutil
from fastapi import UploadFile
from typing import List


# Create client
def create_client(db: Session, client: schemas.ClientCreate):
    sql = text("""
        INSERT INTO clients ("ClientName", "ClientEmail", "ClientPhone", "ClientPassword")
        VALUES (:ClientName, :ClientEmail, :ClientPhone, :ClientPassword)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "ClientName": client.ClientName,
            "ClientEmail": client.ClientEmail,
            "ClientPhone": client.ClientPhone,
            "ClientPassword": client.ClientPassword
        }
    ).fetchone()
    db.commit()
    return result

# Get client by Email
def get_client_by_email(db: Session, email: str):
    sql = text("""
        SELECT "ClientID", "ClientName", "ClientEmail", "ClientPhone", "ClientPassword"
        FROM clients
        WHERE "ClientEmail" = :email;
    """)
    result = db.execute(sql, {"email": email}).fetchone()
    return result

# Get Client By ID
def get_client_by_id(db: Session, client_id: int):
    sql = text("""
        SELECT * FROM clients WHERE "ClientID" = :client_id;
    """)
    result = db.execute(sql, {"client_id": client_id}).fetchone()
    return result

def get_client_password_by_email(db: Session, email: str):
    sql = text("""
        SELECT "ClientPassword" FROM clients WHERE "ClientEmail" = :email;
    """)
    result = db.execute(sql, {"email": email}).fetchone()
    return result

# Get clients with pagination
def get_clients(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM clients OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results

# Create office
def create_office(db: Session, office: schemas.OfficeCreate):
    sql = text("""
        INSERT INTO offices ("OfficeName", "Address", "City", "Province", "ZipCode", "PhoneNumber")
        VALUES (:OfficeName, :Address, :City, :Province, :ZipCode, :PhoneNumber)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "OfficeName": office.OfficeName,
            "Address": office.Address,
            "City": office.City,
            "Province": office.Province,
            "ZipCode": office.ZipCode,
            "PhoneNumber": office.PhoneNumber
        }
    ).fetchone()
    db.commit()
    return result

# Get office by ID 
def get_office_by_id(db: Session, office_id: int):
    sql = text("""
        SELECT * FROM offices WHERE "OfficeID" = :office_id;
    """)
    result = db.execute(sql, {"office_id": office_id}).fetchone()
    return result

# Get offices with pagination
def get_offices(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM offices OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results

# Create agent
def create_agent(db: Session, agent: schemas.AgentCreate):
    sql = text("""
        INSERT INTO agents ("OfficeID", "PhoneNumber", "Email", "Password", "Name")
        VALUES (:OfficeID, :PhoneNumber, :Email, :Password, :Name)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "OfficeID": agent.OfficeID,
            "PhoneNumber": agent.PhoneNumber,
            "Email": agent.Email,
            "Password": agent.Password,
            "Name": agent.Name
        }
    ).fetchone()
    db.commit()
    return result

# Update the Office of an Agent
def update_agent_office(db: Session, agent_id: int, new_office_id: int):
    sql = text("""
        UPDATE agents
        SET "OfficeID" = :OfficeID
        WHERE "AgentID" = :AgentID
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "AgentID": agent_id,
            "OfficeID": new_office_id
        }
    ).fetchone()
    db.commit()
    return result

# Get agent by ID 
def get_agent_by_id(db: Session, agent_id: int):
    sql = text("""
        SELECT * FROM agents WHERE "AgentID" = :agent_id;
    """)
    result = db.execute(sql, {"agent_id": agent_id}).fetchone()
    return result

# Get all agents by OfficeID
def get_agents_by_office_id(db: Session, office_id: int):
    sql = text("""
        SELECT * FROM agents WHERE "OfficeID" = :office_id;
    """)
    result = db.execute(sql, {"office_id": office_id}).fetchall()
    return result

# Get agent password by email address
def get_agent_password_by_email(db: Session, email: str):
    sql = text("""
        SELECT "Password" FROM agents WHERE "Email" = :email;
    """)
    result = db.execute(sql, {"email": email}).fetchone()
    return result

# Get agent by Email
def get_agent_by_email(db: Session, email: str):
    sql = text("""
        SELECT "AgentID", "Name", "Email", "PhoneNumber", "Password", "OfficeID"
        FROM agents
        WHERE "Email" = :email;
    """)
    result = db.execute(sql, {"email": email}).fetchone()
    return result

# Get agents with pagination
def get_agents(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM agents OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results

# Create property
def create_property(db: Session, property: schemas.PropertyCreate):
    sql = text("""
        INSERT INTO properties ("AgentID", "City", "Province", "ZipCode", "Price", "Size", "NoOfBedRoom", "Status", "Type", "Address")
        VALUES (:AgentID, :City, :Province, :ZipCode, :Price, :Size, :NoOfBedRoom, :Status, :Type, :Address)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "AgentID": property.AgentID,
            "City": property.City,
            "Province": property.Province,
            "ZipCode": property.ZipCode,
            "Price": property.Price,
            "Size": property.Size,
            "NoOfBedRoom": property.NoOfBedRoom,
            "Status": property.Status,
            "Type": property.Type,
            "Address": property.Address,
        }
    ).fetchone()
    db.commit()
    return result

# Get property by ID NOT DONE!!!
def get_property_by_id(db: Session, property_id: int):
    sql = text("""
        SELECT * FROM properties WHERE PropertyID = :property_id;
    """)
    result = db.execute(sql, {"property_id": property_id}).fetchone()
    return result

# Get properties with pagination
def get_properties(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM properties OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results

# Create image
def create_image(db: Session, image: schemas.ImageCreate):
    sql = text("""
        INSERT INTO images ("PropertyID", "ImageURL")
        VALUES (:PropertyID, :ImageURL)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "PropertyID": image.PropertyID,
            "ImageURL": image.ImageURL,
        }
    ).fetchone()
    db.commit()
    return result

# Get image by ID NOT DONE!!!
def get_image_by_id(db: Session, image_id: int):
    sql = text("""
        SELECT * FROM images WHERE ImageID = :image_id;
    """)
    result = db.execute(sql, {"image_id": image_id}).fetchone()
    return result

# Function to get all images by PropertyID
def get_images_by_property_id(db: Session, property_id: int):
    sql = text("""
        SELECT * FROM images WHERE "PropertyID" = :property_id;
    """)
    results = db.execute(sql, {"property_id": property_id}).fetchall()
    return results

# Get images with pagination
def get_images(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM images OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results

# Create transaction
def create_transaction(db: Session, transaction: schemas.TransactionCreate):
    
    sql = text("""
        INSERT INTO transactions ("ClientID", "PropertyID", "Date", "Amount")
        VALUES (:ClientID, :PropertyID, :Date, :Amount)
        RETURNING *;
    """)
    result = db.execute(
        sql,
        {
            "ClientID": transaction.ClientID,
            "PropertyID": transaction.PropertyID,
            "Date": transaction.Date,
            "Amount": transaction.Amount
        }
    ).fetchone()
    db.commit()
    return result

# Get transaction by ID
def get_transaction_by_id(db: Session, transaction_id: int):
    sql = text("""
        SELECT * FROM transactions WHERE TransactionID = :transaction_id;
    """)
    result = db.execute(sql, {"transaction_id": transaction_id}).fetchone()
    return result

# Get transaction by Property ID
def get_transaction_by_Propertyid(db: Session, property_id: int):
    sql = text("""
        SELECT * FROM transactions WHERE "PropertyID" = :property_id;
    """)
    results = db.execute(sql, {"property_id": property_id}).fetchall()

    return results

# Get transactions with pagination
def get_transactions(db: Session, skip: int = 0, limit: int = 100):
    sql = text("""
        SELECT * FROM transactions OFFSET :skip LIMIT :limit;
    """)
    results = db.execute(sql, {"skip": skip, "limit": limit}).fetchall()
    return results


async def create_folder_and_save_file(file: UploadFile, destination_folder: Path):

    destination_folder.mkdir(parents=True, exist_ok=True)

    destination_path = destination_folder / file.filename

    # Save the file to the destination path
    with destination_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return destination_path


# Search properties with dynamic filters
def search_properties(db: Session, search_params: schemas.PropertySearch) -> List[schemas.Property]:
        
    
    base_query = """
        SELECT * FROM properties WHERE 1=1
    """

    filters = []
    params = {}

    if search_params.City != "":
        filters.append('AND "City" = :city')
        params["city"] = search_params.City

    if search_params.Province != "":
        filters.append('AND "Province" = :province')
        params['province'] = search_params.Province

    if search_params.Price != 0:
        filters.append('AND "Price" <= :price_lte')
        params['price_lte'] = search_params.Price

    if search_params.Type != "":
        filters.append('AND "Type" = :property_type')
        params['property_type'] = search_params.Type

    # Combine the base query with the filters
    sql = text(base_query + " ".join(filters))
    
    # Execute the query with dynamic parameters
    result = db.execute(sql, params).fetchall()

    # Convert the result to the desired response schema
    # Convert the result to the desired response schema
    return result