from pydantic import BaseModel
from typing import List, Optional
from datetime import date
        


class ClientBase(BaseModel):
    ClientName: str
    ClientEmail: str
    ClientPhone: Optional[str] = None


class ClientCreate(ClientBase):
    ClientPassword: str


class Client(ClientBase):
    ClientID: int
    transactions: List['Transaction'] = []

    class Config:
        orm_mode = True

class ClientPassword(BaseModel):
    ClientPassword: str

    class Config:
        orm_mode = True

class OfficeBase(BaseModel):
    OfficeName: str
    Address: str
    City: str
    Province: str
    ZipCode: str
    PhoneNumber: Optional[str] = None


class OfficeCreate(OfficeBase):
    pass


class Office(OfficeBase):
    OfficeID: int
    agents: List['Agent'] = []

    class Config:
        orm_mode = True


class AgentBase(BaseModel):
    OfficeID: int
    PhoneNumber: str
    Email: str
    Name: str


class UpdateAgentOffice(BaseModel):
    OfficeID: int

    class Config:
        orm_mode = True

class AgentCreate(AgentBase):
    Password: str


class Agent(AgentBase):
    AgentID: int
    offices: Optional['Office'] = None
    properties: List['Property'] = []

    class Config:
        orm_mode = True


class PropertyBase(BaseModel):
    AgentID: int
    City: str
    Province: str
    ZipCode: str
    Price: int
    Size: int
    NoOfBedRoom: int
    Status: str 
    Type: str
    Address: str 


class PropertyCreate(PropertyBase):
    pass


class Property(PropertyBase):
    PropertyID: int
    agents: Optional['Agent'] = None
    images: List['Image'] = []
    transactions: List['Transaction'] = []

    class Config:
        orm_mode = True


class TransactionBase(BaseModel):
    ClientID: int
    PropertyID: int
    Date: str
    Amount: float


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    TransactionID: int
    clients: Optional['Client'] = None
    properties: Optional['Property'] = None

    class Config:
        orm_mode = True


class ImageBase(BaseModel):
    PropertyID: int
    ImageURL: str


class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    ImageID: int
    properties: Optional['Property'] = None

    class Config:
        orm_mode = True
        

class FileUploadResponse(BaseModel):
    filename: str
    message: str


# Request schema for searching properties
class PropertySearch(BaseModel):
    City: Optional[str] = None
    Province: Optional[str] = None
    Price: Optional[int] = None
    Type: Optional[str] = None
    
    class Config:
        allow_population_by_field_name = True

# Response schema for a property
class PropertyResponse(BaseModel):
    id: int
    city: str
    province: str
    price: int
    property_type: str

    class Config:
        orm_mode = True