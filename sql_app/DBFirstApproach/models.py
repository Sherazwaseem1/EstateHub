from typing import List, Optional

from sqlalchemy import Column, Double, Enum, ForeignKeyConstraint, Index, Integer, PrimaryKeyConstraint, String, LargeBinary
from sqlalchemy.orm import Mapped, declarative_base, mapped_column, relationship
from sqlalchemy.orm.base import Mapped

Base = declarative_base()


class Clients(Base):
    __tablename__ = 'clients'
    __table_args__ = (
        PrimaryKeyConstraint('ClientID', name='clients_pkey'),
        Index('ix_clients_ClientEmail', 'ClientEmail', unique=True),
        Index('ix_clients_ClientID', 'ClientID'),
        Index('ix_clients_ClientName', 'ClientName')
    )

    ClientID = mapped_column(Integer)
    ClientName = mapped_column(String)
    ClientEmail = mapped_column(String)
    ClientPhone = mapped_column(String)
    ClientPassword = mapped_column(String)

    transactions: Mapped[List['Transactions']] = relationship('Transactions', uselist=True, back_populates='clients')


class Offices(Base):
    __tablename__ = 'offices'
    __table_args__ = (
        PrimaryKeyConstraint('OfficeID', name='offices_pkey'),
        Index('ix_offices_OfficeID', 'OfficeID'),
        Index('ix_offices_OfficeName', 'OfficeName')
    )

    OfficeID = mapped_column(Integer)
    OfficeName = mapped_column(String)
    Address = mapped_column(String)
    City = mapped_column(String)
    Province = mapped_column(String)
    ZipCode = mapped_column(String)
    PhoneNumber = mapped_column(String)

    agents: Mapped[List['Agents']] = relationship('Agents', uselist=True, back_populates='offices')


class Agents(Base):
    __tablename__ = 'agents'
    __table_args__ = (
        ForeignKeyConstraint(['OfficeID'], ['offices.OfficeID'], name='agents_OfficeID_fkey'),
        PrimaryKeyConstraint('AgentID', name='agents_pkey'),
        Index('ix_agents_AgentID', 'AgentID'),
        Index('ix_agents_Email', 'Email', unique=True)
    )

    AgentID = mapped_column(Integer)
    OfficeID = mapped_column(Integer)
    PhoneNumber = mapped_column(String)
    Email = mapped_column(String)
    Password = mapped_column(String)
    Name = mapped_column(String)

    offices: Mapped[Optional['Offices']] = relationship('Offices', back_populates='agents')
    properties: Mapped[List['Properties']] = relationship('Properties', uselist=True, back_populates='agents')


class Properties(Base):
    __tablename__ = 'properties'
    __table_args__ = (
        ForeignKeyConstraint(['AgentID'], ['agents.AgentID'], name='properties_AgentID_fkey'),
        PrimaryKeyConstraint('PropertyID', name='properties_pkey'),
        Index('ix_properties_PropertyID', 'PropertyID')
    )

    PropertyID = mapped_column(Integer)
    AgentID = mapped_column(Integer)
    City = mapped_column(String)
    Province = mapped_column(String)
    ZipCode = mapped_column(String)
    Price = mapped_column(Double(53))
    Size = mapped_column(Double(53))
    NoOfBedRoom = mapped_column(Integer)
    Status = mapped_column(Enum('Available', 'Sold', 'Pending', name='status_enum'))
    Type = mapped_column(Enum('House', 'Apartment', 'Commercial', name='type_enum'))
    Address = mapped_column(String) 

    agents: Mapped[Optional['Agents']] = relationship('Agents', back_populates='properties')
    images: Mapped[List['Images']] = relationship('Images', uselist=True, back_populates='properties')
    transactions: Mapped[List['Transactions']] = relationship('Transactions', uselist=True, back_populates='properties')


class Images(Base):
    __tablename__ = 'images'
    __table_args__ = (
        ForeignKeyConstraint(['PropertyID'], ['properties.PropertyID'], name='images_PropertyID_fkey'),
        PrimaryKeyConstraint('ImageID', name='images_pkey'),
        Index('ix_images_ImageID', 'ImageID')
    )

    ImageID = mapped_column(Integer)
    PropertyID = mapped_column(Integer)
    ImageURL = mapped_column(String)
    Image_Data = mapped_column(LargeBinary)  # Added BYTEA column

    properties: Mapped[Optional['Properties']] = relationship('Properties', back_populates='images')

class Transactions(Base):
    __tablename__ = 'transactions'
    __table_args__ = (
        ForeignKeyConstraint(['PropertyID'], ['properties.PropertyID'], name='transactions_PropertyID_fkey'),
        PrimaryKeyConstraint('TransactionID', name='transactions_pkey'),
        Index('ix_transactions_TransactionID', 'TransactionID')
    )

    TransactionID = mapped_column(Integer)
    ClientID = mapped_column(Integer)
    PropertyID = mapped_column(Integer)
    Date = mapped_column(String)
    Amount = mapped_column(Double(53))

    # Relationship with other tables
    properties: Mapped[Optional['Properties']] = relationship('Properties', back_populates='transactions')
