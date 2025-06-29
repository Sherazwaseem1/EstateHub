from sqlalchemy import Column, Integer, String, ForeignKey, Float, Enum
from sqlalchemy.orm import relationship
from .database import Base

class Client(Base):
    __tablename__ = 'clients'

    ClientID = Column(Integer, primary_key=True, index=True)
    ClientName = Column(String, index=True)
    ClientEmail = Column(String, unique=True, index=True)
    ClientPhone = Column(String)
    ClientPassword = Column(String)

class Office(Base):
    __tablename__ = 'offices'

    OfficeID = Column(Integer, primary_key=True, index=True)
    OfficeName = Column(String, index=True)
    Address = Column(String)
    City = Column(String)
    Province = Column(String)
    ZipCode = Column(String)
    PhoneNumber = Column(String)

class Agent(Base):
    __tablename__ = 'agents'

    AgentID = Column(Integer, primary_key=True, index=True)
    OfficeID = Column(Integer, ForeignKey('offices.OfficeID'))
    PhoneNumber = Column(String)
    Email = Column(String, unique=True, index=True)
    Password = Column(String)
    Name = Column(String)

    office = relationship("Office")

class Property(Base):
    __tablename__ = 'properties'

    PropertyID = Column(Integer, primary_key=True, index=True)
    AgentID = Column(Integer, ForeignKey('agents.AgentID'))
    City = Column(String)
    Province = Column(String)
    ZipCode = Column(String)
    Price = Column(Float)
    Size = Column(Float)
    NoOfBedRoom = Column(Integer)
    Status = Column(Enum("Available", "Sold", "Pending", name="status_enum"))
    Type = Column(Enum("House", "Apartment", "Condo", name="type_enum"))

    agent = relationship("Agent")

class Transaction(Base):
    __tablename__ = 'transactions'

    TransactionID = Column(Integer, primary_key=True, index=True)
    ClientID = Column(Integer, ForeignKey('clients.ClientID'))
    PropertyID = Column(Integer, ForeignKey('properties.PropertyID'))
    Date = Column(String)
    Amount = Column(Float)

    client = relationship("Client")
    property = relationship("Property")

class Image(Base):
    __tablename__ = 'images'

    ImageID = Column(Integer, primary_key=True, index=True)
    PropertyID = Column(Integer, ForeignKey('properties.PropertyID'))
    ImageURL = Column(String)

    property = relationship("Property")
