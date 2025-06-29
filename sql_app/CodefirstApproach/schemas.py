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

    class Config:
        orm_mode = True

class AgentBase(BaseModel):
    OfficeID: int
    PhoneNumber: str
    Email: str
    Name: str

class AgentCreate(AgentBase):
    Password: str

class Agent(AgentBase):
    AgentID: int

    class Config:
        orm_mode = True

class PropertyBase(BaseModel):
    AgentID: int
    City: str
    Province: str
    ZipCode: str
    Price: float
    Size: float
    NoOfBedRoom: int
    Status: Optional[str] = None
    Type: Optional[str] = None
    Address: str

class PropertyCreate(PropertyBase):
    pass

class Property(PropertyBase):
    PropertyID: int

    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    ClientID: int
    AgentID: int
    PropertyID: int
    Date: date
    Price: float
    Status: str

class TransactionCreate(TransactionBase):
    pass

class Transaction(TransactionBase):
    TransactionID: int

    class Config:
        orm_mode = True

class ImageBase(BaseModel):
    PropertyID: int
    ImagePath: str

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    ImageID: int

    class Config:
        orm_mode = True
